/*
import ipc from 'electron/ipc/render';
import { fs } from 'mapcraft-api/backend';
import database, { tableInterface } from 'mapcraft-api/dist/types/src/backend/sql';
import { mapEngineInstance } from 'electron/preload/engine';
import { exposeInMainWorld } from 'api/plugins/backend';
*/
import { access, constants, mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { minecraft } from 'mapcraft-api';
import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import {
	crafting,
	furnace,
	furnaceGen,
	smithing,
	smithingGen,
	stonecutter,
	stonecutterGen,
	tableGen,
	texturesType,
	listInterface,
	tabsName,
	caseData,
	resultTable,
	furnaceTable,
	stonecutterTable,
	smithingTable
} from './interface';
import { block, items, minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';

interface list {
	id: string,
	name: string,
	path: string | undefined
}

export interface envInterface {
	datapack: {
		base: string;
		default: string;
	},
	resourcepack: string;
}

class recipe {
	private minecraftData: {
		blocks: block[],
		items: items[]
	};
	private recipeDir: string;
	private saveList: {
		block: list[],
		item: list[],
	};

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
		this.recipeDir = resolve(env.datapack.base, 'recipes');
		this.saveList = {
			block: [],
			item: []
		};
		this.resourcesPath = {
			base: resolve(env.resourcepack, 'assets', 'minecraft', 'textures'),
			block: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'block'),
			item: resolve(env.resourcepack, 'assets', 'minecraft', 'textures', 'item'),
		};

		access(this.recipeDir)
			.catch(async () => await mkdir(this.recipeDir, { recursive: true }));
	}

	//#region Data
	async textures(type: texturesType): Promise<{ id: string, name: string, path: string | undefined }[]> {
		return new Promise((res) => {
			if (type === 'block') {
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

	async recipeList(): Promise<listInterface[]> {
		const list: listInterface[] = [{ group: 'default', el: [] }];
		const group = (name?: string) => {
			if (!name)
				return 0;
			for (const x in list) {
				if (list[x].group === name)
					return Number(x);
			}
			list.push({ group: name, el: [] });
			return list.length - 1;
		};
		const type = (t: string, player?: boolean): tabsName => {
			if (t === 'minecraft:crafting_shapeless' || t === 'minecraft:crafting_shaped') {
				return (player)
					? 'player'
					: 'craft';
			}
			if (t === 'minecraft:smelting')
				return 'furnace';
			if (t === 'minecraft:blasting')
				return 'blast';
			if (t === 'minecraft:campfire_cooking')
				return 'campfire';
			if (t === 'minecraft:smoking')
				return 'smoker';
			if (t === 'minecraft:stonecutting')
				return 'stonecutter';
			return 'smithing';
		};

		return new Promise((res, rej) => {
			readdir(this.recipeDir, { encoding: 'utf-8', withFileTypes: true })
				.then(async (files) => {
					const temp = files.filter((e) => e.isFile() && /\.json$/m.test(e.name));
					for (const e of temp) {
						const path = resolve(this.recipeDir, e.name);
						await readFile(path, { encoding: 'utf-8', flag: 'r' })
							.then((d) => JSON.parse(d))
							.then((d) => {
								const reg = /^(.+)\.json$/m.exec(e.name);
								if (reg)
									list[group(d.group ?? undefined)].el.push({ name: reg[1], type: type(d.type), path });
							})
							.catch((e) => rej(e));
					}
					res(list);
				})
				.catch((e) => rej(e));
		});
	}
	//#endregion Data

	//#region Generation
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
				model.key[__key] = { item: `minecraft:${id}` };
				return { key: __key, item: `minecraft:${id}` };
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
	//#endregion Generation

	//#region Handle file
	async createFile(data: any, name: string) {
		return writeFile(resolve(this.recipeDir, `${name}.json`), JSON.stringify(data, null, 2), { encoding: 'utf-8', flag: 'w' });
	}

	async readFile(path: string) {
		return readFile(path, { encoding: 'utf-8', flag: 'r' });
	}

	async deleteFile(name: string): Promise<void> {
		return new Promise((res, rej) => {
			const path = resolve(this.recipeDir, `${name}.json`);
			access(path, constants.F_OK)
				.then(() => {
					rm(path, { force: true })
						.then(() => res())
						.catch((e) => rej(e));
				})
				.catch((e) => rej(e));
		});
	}
	//#endregion Handle file

	//#region Read data
	private itemData(name: string) {
		const isExist = (__list: list[]) => {
			for (const el of __list) {
				if (el.id === name || el.name === name)
					return (el);
			}
			return undefined;
		};

		let exist = isExist(this.saveList.block);
		let isBlock = true;
		if (!exist) {
			exist = isExist(this.saveList.item);
			isBlock = false;
		}
		return { isBlock, data: exist };
	}

	private getElement(item: string): caseData | undefined {
		const reg = item.match(/(?<=^minecraft:).*/m);
		if (!reg)
			return undefined;
		const temp = __instance__.itemData(reg[0]);
		if (temp && temp.data) {
			 return {
				type: (temp.isBlock)
					? 'block'
					: 'item',
				id: temp.data.id,
				path: (temp.isBlock)
					? `/imgs/minecraft/block/${temp.data.id}.webp`
					: String(temp.data.path)
			};
		}
		return undefined;
	}

	recipeType(data: any) {
		switch (data.type) {
		case 'minecraft:crafting_shapeless':
		case 'minecraft:crafting_shaped':
			return 'table';
			// return this.readTable(name, data);
		case 'minecraft:smelting':
		case 'minecraft:blasting':
		case 'minecraft:campfire_cooking':
		case 'minecraft:smoking':
			return 'furnace';
			// return this.readFurnace(name, data);
		case 'minecraft:smithing':
			return 'smithing';
			// return this.readSmithing(name, data);
		case 'minecraft:stonecutting':
		default:
			return 'stonecutter';
			// return this.readStonecutter(name, data);
		}
	}

	readTable(name: string, data: any): resultTable {
		const ret: resultTable = {
			cases: [],
			result: { item: {} as caseData, count: 0 },
			options: {
				exact: false
			}
		};
		const size = (data.isPlayer && data.isPlayer === true)
			? 2
			: 3;
		const limit = size * size + 1;
		const addCase = (item: string, index: number) => {
			const reg = item.match(/(?<=^minecraft:).*/m);
			if (!reg)
				return;
			const temp = __instance__.itemData(reg[0]);
			if (temp && temp.data) {
				ret.cases[index] = {
					type: (temp.isBlock)
						? 'block'
						: 'item',
					id: temp.data.id,
					path: (temp.isBlock)
						? `/imgs/minecraft/block/${temp.data.id}.webp`
						: String(temp.data.path)
				};
			}
		};
		const getItemWithKey = (json: any, key: string) => {
			for (const element in json.key) {
				if (element === key)
					return json.key[key].item;
			}
			return undefined;
		};

		for (let i = 0; i < limit; i++)
			ret.cases.push({ type: 'block', id: '', path: '' });
		ret.result.count = data.result.count;
		addCase(data.result.item, limit - 1);
		ret.result.item = this.getElement(data.result.item) as caseData;
		ret.options.outputName = name;
		if (data.group)
			ret.options.group = data.group;
		if (data.type === 'minecraft:crafting_shapeless') {
			for (const i in data.ingredients)
				addCase(data.ingredients[i].item, Number(i));
		} else {
			for (let row = 0, _case = 0; data.pattern.length > row; row++) {
				_case = row * size;
				const items: string[] = Array.from(data.pattern[row]);
				for (const item of items) {
					const key = getItemWithKey(data, item);
					if (key !== undefined)
						addCase(key, _case);
					++_case;
				}
			}
		}
		return ret;
	}

	readFurnace(name: string, data: any): furnaceTable {
		const ret: furnaceTable = {} as furnaceTable;

		ret.recipe = this.getElement(data.ingredient.item) as caseData;
		ret.result = this.getElement(data.result) as caseData;
		ret.options.experience = data.experience;
		ret.options.time = data.cookingtime / 20;
		ret.options.outputName = name;
		if (data.group)
			ret.options.group = data.group;
		return ret;
	}

	readStonecutter(name: string, data: any): stonecutterTable {
		const ret: stonecutterTable = {} as stonecutterTable;

		ret.recipe = this.getElement(data.ingredient.item) as caseData;
		ret.result = this.getElement(data.result) as caseData;
		ret.count = data.count;
		ret.outputName = name;
		if (data.group)
			ret.group = data.group;

		return ret;
	}

	readSmithing(name: string, data: any) {
		const ret: smithingTable = {} as smithingTable;

		ret.base = this.getElement(data.base.item) as caseData;
		ret.addition = this.getElement(data.addition.item) as caseData;
		ret.result = this.getElement(data.result.item) as caseData;
		ret.outputName = name;
		if (data.group)
			ret.group = data.group;
		return ret;
	}
	//#endregion Read data
}

let __instance__: recipe;

exposeInMainWorld('recipe', {
	init: (env: envInterface, version: minecraftVersion) => {
		if (__instance__ === undefined)
			__instance__ = new recipe(env, version);
	},
	paths: () => __instance__.resourcesPath,
	textures: (type: texturesType) => __instance__.textures(type),
	list: () => __instance__.recipeList(),
	generate: {
		furnace: (data: furnaceGen) => __instance__.generateFurnace(data),
		table: (data: tableGen) => __instance__.generatePlayerTable(data),
		stonecutter: (data: stonecutterGen) => __instance__.generateStoneCutter(data),
		smithing: (data: smithingGen) => __instance__.generateSmithing(data)
	},
	read: {
		type: (data: any) => __instance__.recipeType(data),
		table: (name: string, data: any) => __instance__.readTable(name, data),
		furnace: (name: string, data: any) => __instance__.readFurnace(name, data),
		stonecutter: (name: string, data: any) => __instance__.readStonecutter(name, data),
		smithing: (name: string, data: any) => __instance__.readSmithing(name, data),
	},
	file: {
		create: (data: any, name: string) => __instance__.createFile(data, name),
		read: (path: string) => __instance__.readFile(path),
		delete: (name: string) => __instance__.deleteFile(name)
	}
});
