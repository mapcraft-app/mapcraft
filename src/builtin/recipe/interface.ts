/**
 * shapeless, ingredients is using, and pattern & key is deleted
 * shape, ingredients is deleted, and pattern & key is using
 */
export interface crafting {
	type: string,
	group: string,
	ingredients?: { item: string }[],
	pattern?: string[],
	key?: Record<string, { item: string }>,
	result: {
		item: string,
		count: number,
	},
	isPlayer: boolean,
	exactPosition: boolean
}

/**
 * furnace: smelting
 * blast_furnace: blasting
 * campfire: campfire_cooking
 * smoker: smoking
 */
export interface furnace {
	type: 'smelting' | 'blasting' | 'campfire_cooking' | 'smoking' | string,
	group: string,
	ingredient: string[],
	result: string,
	experience: number,
	cookingtime: number
}

export interface stonecutter {
	type: string,
	group: string,
	ingredient: {
		item: string
	},
	result: string,
	count: number
}

export interface smithing {
	type: string,
	group: string,
	base: {
		item: string
	},
	addition: {
		item: string
	},
	result: {
		item: string
	}
}

export interface caseData {
	type: 'block' | 'item',
	id: string;
	path: string
}

export interface tableGen {
	recipes: string[],
	result: string,
	count: number,
	options: {
		shapeless: boolean,
		exactPosition: boolean,
		group: string | null,
		outputName: string | null
	}
}

export type tabsName = 'player' | 'craft' | 'furnace' | 'blast' | 'campfire' | 'smoker' | 'stonecutter' | 'smithing';

export type texturesType = 'block' | 'item';
