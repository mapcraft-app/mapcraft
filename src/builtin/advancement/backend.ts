import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { randomBytes } from 'crypto';
import { existsSync, readdirSync, readFileSync, rmSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { minecraft } from 'mapcraft-api';

import iso from 'api/isoDate';
import deepClone from 'api/deepClone';
import { block, items, minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';
import { envInterface } from '../interface';
import { main, advancement as advance, insideAdvancement, display, rewards } from './model';

interface advancementList {
	path: string;
	data: main;
}

interface criteria {
	trigger: string;
	conditions: Record<any, unknown>;
}

interface realCriteria {
	display: display;
	criteria: Record<string, criteria>,
	requirements: string[][],
	rewards: rewards,
	parent?: string,
	sends_telemetry_event?: boolean
}

class advancement {
	private env: envInterface;
	private version: minecraftVersion;
	public path: {
		base: string,
		data: string
	};
	public list: advancementList[];
	public textureBlock: { id: string, path: string }[];
	public textureItem: { id: string, path: string }[];

	constructor(env: envInterface, minecraftVersion: minecraftVersion) {
		const tempPath = {
			block: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'block'),
			item: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'item'),
		};
		
		this.env = env;
		this.version = minecraftVersion;
		this.path = {
			base: resolve(env.datapack.base, 'advancements'),
			data: resolve(env.datapack.base, 'advancements', 'data')
		};
		this.list = [];
		this.textureBlock = (minecraft.get(minecraftVersion, 'block') as block[]).map((e) => ({ id: e.name, path: resolve(tempPath.block, `${e.name}.png`) }));
		this.textureItem = (minecraft.get(minecraftVersion, 'item') as items[]).map((e) => ({ id: e.name, path: resolve(tempPath.item, `${e.name}.png`) }));

		if (!existsSync(this.path.data))
			mkdir(this.path.data, { recursive: true });
		else
			this.readDir();
	}

	public readDir() {
		this.list.length = 0;
		readdirSync(this.path.data, { encoding: 'utf-8', withFileTypes: true })
			.forEach((f) => {
				if (f.isFile() && extname(f.name) === '.json') {
					this.list.push({
						path: resolve(this.path.data, f.name),
						data: JSON.parse(readFileSync(resolve(this.path.data, f.name), { encoding: 'utf-8', flag: 'r' })) as main
					});
				}
			});
	}

	public getTextures(id: string) {
		const getId = () => {
			const reg = /^minecraft:(.*)$/m.exec(id);
			if (reg && reg.length > 0)
				return reg[1];
			return id;
		};
		const __id = getId();
		const temp = this.textureBlock.find((e) => e.id === __id);
		if (!temp)
			return this.textureItem.find((e) => e.id === __id) as { id: string, path: string };
		return temp;
	}

	public getAdvancements() {
		return this.list;
	}

	public getAdvancement(path: string) {
		for (const i in this.list) {
			if (this.list[i].path === path)
				return this.list[i];
		}
	}

	public createAdvancement(): Promise<advancementList> {
		return new Promise((res, rej) => {
			const id = randomBytes(8).toString('hex');
			const path = resolve(this.path.data, `${id}_${iso.now().iso.replaceAll(':', '_')}.json`);
			const data = {
				id,
				name: 'new advancement',
				background: 'minecraft:textures/gui/advancements/backgrounds/stone.png',
				telemetry: false
			} as main;
			writeFile(
				path,
				JSON.stringify(data, null, 2),
				{ encoding: 'utf-8', flag: 'w' }
			)
				.then(() => {
					this.list.push({ path, data });
					res({ path, data });
				})
				.catch((e) => rej(e));
		});
	}

	public saveAdvancement(data: string): Promise<void> {
		const json = JSON.parse(data) as advancementList;

		return new Promise((res, rej) => {
			for (const i in this.list) {
				if (this.list[i].path === json.path) {
					this.list[i].data = json.data;
					if (minecraft.semverCompare(this.version, '1.20') < 0)
						delete json.data.telemetry;
					writeFile(
						this.list[i].path,
						JSON.stringify(json.data, null, 2),
						{ encoding: 'utf-8', flag: 'w' }
					)
						.then(() => res())
						.catch((e) => rej(e));
					return;
				}
			}
			rej('not_found');
		});
	}

	public deleteAdvancement(data: string): Promise<void> {
		const json = JSON.parse(data) as advancementList;

		return new Promise((res, rej) => {
			for (const i in this.list) {
				if (this.list[i].path === json.path) {
					rm(this.list[i].path, { force: true })
						.then(() => {
							this.list.splice(Number(i), 1);
							res();
						})
						.catch((e) => rej(e));
					return;
				}
			}
			rej('not_found');
		});
	}

	public async generateFiles(path: string): Promise<void> {
		const adv = this.getAdvancement(path);
		if (!adv)
			return;

		const write = (name: string, json: insideAdvancement, parent?: string): string => {
			const criterias = {} as Record<string, criteria>;

			for (const adv of json.criteria) {
				if (Object.prototype.hasOwnProperty.call(adv, 'conditions')) {
					if (Object.prototype.hasOwnProperty.call(adv.conditions, '__at_root__')) {
						const temp = {} as Record<any, any>;
						for (const key in adv.conditions) {
							if (key === '__at_root__')
								continue;
							if (Object.keys(adv.conditions[key]).length) {
								for (const subKey in adv.conditions[key])
									temp[subKey] = deepClone(adv.conditions[key][subKey]);
							}
						}
						criterias[adv.name] = {
							trigger: `minecraft:${adv.trigger}`,
							conditions: temp
						} as criteria;
					} else {
						criterias[adv.name] = {
							trigger: `minecraft:${adv.trigger}`,
							conditions: deepClone(adv.conditions)
						} as criteria;
					}
				}
			}
			const temp = {
				criteria: criterias,
				requirements: json.requirements,
				rewards: json.rewards
			} as realCriteria;

			if (minecraft.semverCompare(this.version, '1.20') < 0)
				temp.sends_telemetry_event = adv.data.telemetry ?? false;
			if (!Object.prototype.hasOwnProperty.call(json, 'utility') || json.utility === false)
				temp.display = json.display;
			if (parent)
				temp.parent = `mapcraft-data:${parent}`;
			else
				temp.display.background = adv.data.background ?? 'minecraft:textures/gui/advancements/backgrounds/stone.png';
			writeFile(
				resolve(this.path.base, `${adv.data.id}_${name}.json`),
				JSON.stringify(temp),
				{ flag: 'w', encoding: 'utf-8' }
			);
			return `${adv.data.id}_${name}.json`;
		};

		const recursive = (adv: advance, parent: string) => {
			if (adv.children && adv.children.length) {
				for (const child of adv.children) {
					const retName = write(child.id, child.data, parent);
					if (child.children && child.children.length)
						recursive(child, retName);
				}
			}
		};
		readdirSync(this.path.base, { withFileTypes: true })
			.filter((dir) => dir.isFile() && dir.name.includes(adv.data.id))
			.forEach((e) => rmSync(resolve(this.path.base, e.name)));
		recursive(adv.data.data, write('root', adv.data.data.data));
	}
}

let __instance__: advancement;

exposeInMainWorld('advancement', {
	init: (env: envInterface, version: minecraftVersion) => {
		__instance__ = new advancement(env, version);
	},
	readDir: () => __instance__.readDir(),
	getTexture: (id: string) => __instance__.getTextures(id),

	gets: () => __instance__.getAdvancements(),
	get: (path: string) => __instance__.getAdvancement(path),
	create: () => __instance__.createAdvancement(),
	save: (data: string) => __instance__.saveAdvancement(data),
	delete: (data: string) => __instance__.deleteAdvancement(data),
	generate: (path: string) => __instance__.generateFiles(path)
});
