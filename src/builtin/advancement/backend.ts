import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { extname, resolve } from 'path';
import { minecraft } from 'mapcraft-api';

import iso from 'api/isoDate';
import { block, items, minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';
import { envInterface } from '../interface';
import { main, advancement as advancementModel } from './model';
import { randomBytes } from 'crypto';

interface advancementList {
	path: string;
	data: main;
}

class advancement {
	private env: envInterface;
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

	//#region advancements
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
			const id = `${randomBytes(6).toString('hex')}_${iso.now().iso.replaceAll(':', '_')}.json`;
			const path = resolve(this.path.data, id);
			const data = {
				id,
				name: 'new advancement',
				namespace: 'mapcraft-data',
				background: 'minecraft:textures/gui/advancements/backgrounds/stone.png',
				data: {} as advancementModel
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
	//#endregion advancements
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
	delete: (data: string) => __instance__.deleteAdvancement(data)
});
