/*
import ipc from 'electron/ipc/render';
import { fs } from 'mapcraft-api/backend';
import database, { tableInterface } from 'mapcraft-api/dist/types/src/backend/sql';
import { mapEngineInstance } from 'electron/preload/engine';
import { exposeInMainWorld } from 'api/plugins/backend';
*/
import { access, mkdir } from 'fs/promises';
import { resolve } from 'path';
import { minecraft } from 'mapcraft-api';
import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { crafting, tableGen, texturesType } from './interface';
import { block, items, minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';


export interface envInterface {
	datapack: {
		base: string;
		default: string;
	},
	resourcepack: string;
}

class recipe {
	private regex: {
		output: RegExp,
		isShapeless: RegExp,
		isExactPosition: RegExp
	};
	private minecraftData: {
		blocks: block[],
		items: items[]
	};
	private resourceData: {
		blocks: { name: string, path: string }[] | undefined,
		items: { name: string, path: string }[] | undefined
	};
	private recipeDir: string;
	public resourcesPath: {
		base: string,
		block: string,
		item: string
	};

	constructor(env: envInterface, minecraftVersion: minecraftVersion) {
		const temp = {
			block: minecraft.get(minecraftVersion, 'block'),
			items: minecraft.get(minecraftVersion, 'item') 
		};

		if (!temp.block || !temp.items)
			throw new Error(`Minecraft version ${minecraftVersion} don't exist`);
		this.minecraftData = {
			blocks: temp.block as block[],
			items: temp.items as items[],
		};
		this.regex = {
			output: new RegExp('(?:formOutput$)', 'gm'),
			isShapeless: new RegExp('(?:shapeless$)', 'gm'),
			isExactPosition: new RegExp('(?:exactPosition$)', 'gm')
		};
		this.recipeDir = resolve(env.datapack.base, 'recipes');
		this.resourcesPath = {
			base: resolve(env.resourcepack, 'assets', 'minecraft', 'textures'),
			block: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'block'),
			item: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'item'),
		};
		this.resourceData = {
			blocks: undefined,
			items: undefined
		};

		access(this.recipeDir)
			.catch(async () => await mkdir(this.recipeDir, { recursive: true }));
	}

	async textures(type: texturesType): Promise<{ id: string, name: string, path: string | undefined }[]> {
		/*const __readdir = (path: string): Promise<{ name: string, path: string }[]> => new Promise((res, rej) => {
			readdir(path, { encoding: 'utf-8', withFileTypes: true })
				.then((files) => {
					res(files
						.map(e => {
							if (e.isFile()) {
								const reg = /^([\w]+)\.png|jpg|jpeg|webp/.exec(e.name);
								if (reg) 
									return { name: reg[1].toLowerCase(), path: resolve(path, e.name) };
							}
							return undefined;
						})
						.filter((e) => e !== undefined) as { name: string, path: string }[]);
				})
				.catch((err) => {
					rej(err);
				});
		});*/

		return new Promise((res) => {
			if (type === 'block') {
				res(
					this.minecraftData.blocks.map(e => {
						return {
							id: e.name,
							name: e.name.replaceAll('_', ' '),
							path: resolve(this.resourcesPath.block, `${e.name}.png`) ?? undefined
						};
					})
				);
				/*if (this.resourceData.blocks === undefined) {
					__readdir(this.resourcesPath.block)
						.then((d) => {
							this.resourceData.blocks = d;
							res(d);
						});
				} else
					res(this.resourceData.blocks);*/
			} else {
				res(
					this.minecraftData.items.map(e => {
						return {
							id: e.name,
							name: e.name.replaceAll('_', ' '),
							path: resolve(this.resourcesPath.item, `${e.name}.png`) ?? undefined
						};
					})
				);
				/*if (this.resourceData.items === undefined) {
					__readdir(this.resourcesPath.item)
						.then((d) => {
							this.resourceData.items = d;
							res(d);
						});
				} else
					res(this.resourceData.items);*/
			}
		});
	}

	async generatePlayerTable(data: tableGen) {
		const model: crafting = {} as crafting;
		const isPlayer = (data.recipes.length === 4);
			
		if (!data.recipes.filter((e) => e.length).length)
			throw new Error('empty_recipes');
		if (!data.result.length)
			throw new Error('empty_result');
		if (data.count <= 0)
			data.count = 1;
		if (data.count > 64)
			data.count = 64;

		model.result = {
			item: `minecraft:${data.result}`,
			count: data.count,
		};
		model.isPlayer = isPlayer;
		if (data.options.shapeless) {
			model.type = 'minecraft:crafting_shapeless';
			delete model.pattern;
			delete model.key;
			model.ingredients = data.recipes.filter((e) => e.length).map((e) => ({ item: `minecraft:${e}` }));
		} else {
			const tempPattern: string[][] = [];
			const finalPattern: string[] = [];
			const tempKeys = {} as Record<string, { item: string }>;
			const size = (isPlayer)
				? 2
				: 3;
			let key = 'A';
			const addKey = (id: string) => {
				if (!id.length)
					return { key: ' ' };
				for (const x in tempKeys) {
					if (tempKeys[x].item === id)
						return { key: x, item: tempKeys[x].item };
				}
				const __key = key;
				key = String.fromCharCode(key.charCodeAt(0) + 1);
				tempKeys[__key] = { item: id };
				return { key: __key, item: id };
			};

			model.type = 'minecraft:crafting_shaped';
			delete model.ingredients;
			for (let i = 0; i < size; i++)
				tempPattern.push(new Array(size) as string[]);
			for (let row = 0, i = 0; i < data.recipes.length; row++) {
				for (let col = 0; col < size; col++)
					tempPattern[row][col] = data.recipes[i++];
			}
			for (const row of tempPattern) {
				let test = '';
				for (const id of row) {
					const ret = addKey(id);
					test += (!ret.item)
						? ' '
						: ret.key;
				}
				finalPattern.push(test);
			}
			if (!data.options.exactPosition) {
				// row
				for (const x in finalPattern) {
					if (!isPlayer && Number(x) !== 1 || isPlayer) {
						if (!/\S/.test(finalPattern[x]))
							finalPattern.splice(Number(x), 1);
					}
				}
				// column
				let start = 0, end = 0;
				for (const x in finalPattern) {
					if (/^\s/.test(finalPattern[x]))
						++start;
					if (/\s$/.test(finalPattern[x]))
						++end;
				}
				if (start >= finalPattern.length) {
					for (const i in finalPattern)
						finalPattern[i] = finalPattern[i].trimStart();
				}
				if (end >= finalPattern.length) {
					for (const i in finalPattern)
						finalPattern[i] = finalPattern[i].trimEnd();
				}
			}
			model.key = tempKeys;
			model.pattern = finalPattern;
		};
		return (model);
	}
}

let __instance__: recipe;

exposeInMainWorld('recipe', {
	init: (env: envInterface, version: minecraftVersion) => {
		if (__instance__ === undefined)
			__instance__ = new recipe(env, version);
	},
	paths: () => __instance__.resourcesPath,
	textures: (type: texturesType) => __instance__.textures(type),
	generate: {
		table: (data: tableGen) => __instance__.generatePlayerTable(data)
	}
});
