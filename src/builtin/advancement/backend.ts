import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { randomBytes } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { extname, resolve } from 'path';
import { minecraft } from 'mapcraft-api';

import { block, items, minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';
import { envInterface } from '../interface';
import { main } from './model';

class advancement {
	private env: envInterface;
	public path: {
		base: string,
		data: string
	};
	public list: main[];
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
		else {
			readdirSync(this.path.data, { encoding: 'utf-8', withFileTypes: true })
				.forEach((f) => {
					if (f.isFile() && extname(f.name) === '.json')
						this.list.push(JSON.parse(readFileSync(resolve(this.path.data, f.name), { encoding: 'utf-8', flag: 'r' })) as main);
				});
		}
	}

	private randomString(size = 8) {
		return randomBytes(size).toString('hex');
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
}

let __instance__: advancement;

exposeInMainWorld('advancement', {
	init: (env: envInterface, version: minecraftVersion) => {
		__instance__ = new advancement(env, version);
	},
	getList: () => __instance__.list,
	getTexture: (id: string) => __instance__.getTextures(id)
});
