import { resolve } from 'path';
import { minecraft } from 'mapcraft-api';
import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { block, entities, items, minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';
import { envInterface } from '../interface';

interface list {
	id: string,
	name: string,
	path: string | undefined
}

class utility {
	private minecraftData: {
		blocks: block[],
		entity: entities[],
		items: items[]
	};
	private saveList: {
		block: list[],
		entity: list[],
		item: list[],
	};

	public resourcesPath: {
		base: string,
		block: string,
		entity: string,
		item: string
	};

	constructor(env: envInterface, minecraftVersion: minecraftVersion) {
		const temp = {
			block: minecraft.get(minecraftVersion, 'block'),
			entity: minecraft.get(minecraftVersion, 'entity'),
			items: minecraft.get(minecraftVersion, 'item') 
		};

		if (!temp.block || !temp.items || !temp.entity)
			throw new Error(`Minecraft version ${minecraftVersion} don't exist`);
		this.minecraftData = {
			blocks: temp.block as block[],
			entity: temp.entity as entities[],
			items: temp.items as items[],
		};
		this.saveList = {
			block: [],
			entity: [],
			item: []
		};

		this.resourcesPath = {
			base: resolve(env.resourcepack, 'assets', 'minecraft', 'textures'),
			block: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'block'),
			entity: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'entity'),
			item: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'item'),
		};
	}

	async entities(): Promise<list[]> {
		return new Promise((res) => {
			if (!this.saveList.entity.length) {
				this.saveList.entity = this.minecraftData.entity.map(e => {
					return {
						id: e.name,
						name: e.name.replaceAll('_', ' '),
						path: resolve(this.resourcesPath.entity, `${e.name}.png`) ?? undefined
					};
				});
			}
			res(this.saveList.entity);
		});
	}

	async textures(type: 'blocks' | 'items'): Promise<list[]> {
		return new Promise((res) => {
			if (type === 'blocks') {
				if (!this.saveList.block.length) {
					this.saveList.block = this.minecraftData.blocks.map(e => {
						return {
							id: e.name,
							name: e.name.replaceAll('_', ' '),
							path: resolve(this.resourcesPath.block, `${e.name}.png`) ?? undefined
						};
					});
				}
				res(this.saveList.block);
			} else {
				if (!this.saveList.item.length) {
					this.saveList.item = this.minecraftData.items.map(e => {
						return {
							id: e.name,
							name: e.name.replaceAll('_', ' '),
							path: resolve(this.resourcesPath.item, `${e.name}.png`) ?? undefined
						};
					});
				}
				res(this.saveList.item);
			}
		});
	}
}

let __instance__: utility;

exposeInMainWorld('utility', {
	init: (env: envInterface, version: minecraftVersion) => {
		if (__instance__ === undefined)
			__instance__ = new utility(env, version);
	},
	entities: () => __instance__.entities(),
	textures: (type: 'blocks' | 'items') => __instance__.textures(type),
});
