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
import { crafting, furnace, furnaceGen, smithing, smithingGen, stonecutter, stonecutterGen, tableGen, texturesType } from './interface';
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

	async generateFurnace(data: furnaceGen) {
		if (!data.recipe.length)
			throw new Error('empty_recipe');
		if (!data.result.length)
			throw new Error('empty_result');
		if (!data.options.experience || data.options.experience <= 0)
			throw new Error('empty_experience');
		if (!data.options.time || data.options.time <= 0)
			throw new Error('empty_time');

		const model = {} as furnace;
		model.type = data.type;
		model.ingredient = { item: `minecraft:${data.recipe}` };
		model.result = `minecraft:${data.result}`;
		model.experience = data.options.experience;
		model.cookingtime = data.options.time;
		if (data.options.group)
			model.group = data.options.group;
		else
			delete model.group;
		return model;
	}

	async generatePlayerTable(data: tableGen) {
		const model: crafting = {} as crafting;
		const isPlayer = (data.recipes.length === 4);
				
		if (!data.recipes.filter((e) => e.length).length)
			throw new Error('empty_recipes');
		if (!data.result.length)
			throw new Error('empty_result');
		if (!data.count)
			throw new Error('empty_count');
		if (data.count <= 0 || data.count > 64)
			throw new Error('incorrect_count');

		model.result = {
			item: `minecraft:${data.result}`,
			count: data.count,
		};
		model.isPlayer = isPlayer;
		if (data.options.group)
			model.group = data.options.group;
		else
			delete model.group;
		if (data.options.shapeless) {
			model.type = 'minecraft:crafting_shapeless';
			delete model.pattern;
			delete model.key;
			model.ingredients = data.recipes.filter((e) => e.length).map((e) => ({ item: `minecraft:${e}` }));
		} else {
			model.type = 'minecraft:crafting_shaped';
			model.key = {} as Record<string, { item: string }>;
			model.pattern = [] as string[];
			delete model.ingredients;

			const tempPattern: string[][] = [];
			const size = (isPlayer)
				? 2
				: 3;
			let key = 'A';
			const addKey = (id: string) => {
				if (!model.key)
					return;
				if (!/\S/.test(id))
					return { key: ' ' };
				for (const x in model.key) {
					if (model.key[x].item === id)
						return { key: x, item: model.key[x].item };
				}
				const __key = key;
				key = String.fromCharCode(key.charCodeAt(0) + 1);
				model.key[__key] = { item: id };
				return { key: __key, item: id };
			};
				
			for (let i = 0; i < size; i++)
				tempPattern.push(new Array(size) as string[]);
			for (let row = 0, i = 0; i < data.recipes.length; row++) {
				for (let col = 0; col < size; col++) {
					const char = (data.recipes[i].length)
						? data.recipes[i]
						: ' ';
					tempPattern[row][col] = char;
					++i;
				}
			}
				
			if (!data.options.exactPosition) {
				//#region Reduce top/bottom
				const middle = () => ((tempPattern.length - 1) / 2);
				for (
					let top = 0;
					top <= middle() && !/\S/.test(tempPattern[top].join(''));
					top++
				)
					tempPattern.splice(top, 1);
				for (
					let bottom = tempPattern.length - 1;
					bottom >= middle() && !/\S/.test(tempPattern[bottom].join(''));
					bottom--
				)
					tempPattern.splice(bottom, 1);
					//#endregion Reduce top/bottom
					//#region Reduce left/right
				const __while__ = (n?: number) => {
					let count = 0;
					for (const line of tempPattern) {
						const x = n ?? line.length - 1;
						if (!/\S/.test(line[x]))
							++count;
					}
					if (count >= tempPattern.length) {
						for (const line of tempPattern) {
							const x = n ?? line.length - 1;
							line.splice(x, 1);
						}
						return true;
					}
					return false;
				};
				while (__while__(0))
					;
				while (__while__())
					;
					//#endregion Reduce left/right
			}
			for (const row of tempPattern) {
				let line = '';
				for (const col of row) {
					const __key = addKey(col);
					line += __key?.key;
				}
				model.pattern.push(line);
			}
		};
		return model;
	}

	async generateStoneCutter(data: stonecutterGen) {
		if (!data.recipe.length)
			throw new Error('empty_recipe');
		if (!data.result.length)
			throw new Error('empty_result');
		if (!data.count)
			throw new Error('empty_count');
		if (data.count <= 0 || data.count > 64)
			throw new Error('incorrect_count');
			
		const model = {} as stonecutter;
		model.type = 'minecraft:stonecutting';
		model.ingredient = { item: `minecraft:${data.recipe}` };
		model.result = `minecraft:${data.result}`;
		model.count = data.count;
		if (data.group)
			model.group = data.group;
		else
			delete model.group;
		return model;
	}

	async generateSmithing(data: smithingGen) {
		if (!data.base.length)
			throw new Error('empty_base');
		if (!data.addition.length)
			throw new Error('empty_addition');
		if (!data.result.length)
			throw new Error('empty_result');

		const model = {} as smithing;
		model.type = 'minecraft:smithing';
		model.base = { item: `minecraft:${data.base}` };
		model.addition = { item: `minecraft:${data.addition}` };
		model.result = { item: `minecraft:${data.result}` };
		if (data.group)
			model.group = data.group;
		else
			delete model.group;
		return model;
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
		furnace: (data: furnaceGen) => __instance__.generateFurnace(data),
		table: (data: tableGen) => __instance__.generatePlayerTable(data),
		stonecutter: (data: stonecutterGen) => __instance__.generateStoneCutter(data),
		smithing: (data: smithingGen) => __instance__.generateSmithing(data)
	}
});
