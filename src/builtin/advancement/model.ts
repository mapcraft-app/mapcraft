import { criteria } from './conditions';

export type textColor = 'black' | 'dark_blue' | 'dark_green' | 'dark_aqua' | 'dark_red' | 'dark_purple' | 'gold' | 'gray' | 'dark_gray' | 'blue' | 'green' | 'aqua' | 'red' | 'light_purple' | 'yellow' | 'white';
export type frameType = 'challenge' | 'goal' | 'task';
export type potionType = 'empty' | 'mundane' | 'thick' | 'awkward' | 'night vision' | 'long night vision' | 'invisibility' | 'long invisibility' | 'leaping' | 'long leaping' | 'strong leaping' | 'fire resistance' | 'long fire resistance' | 'swiftness' | 'long swiftness' | 'strong swiftness' | 'slowness' | 'long slowness' | 'strong slowness' | 'turtle master' | 'long turtle master' | 'strong turtle master';
export type gamemodeType = 'adventure' | 'creative' | 'spectator' | 'survival';
export type dimensionType = 'overworld' | 'the_end' | 'the_nether';
export type statsType = 'minecraft:broken' | 'minecraft:crafted' | 'minecraft:custom' | 'minecraft:dropped' | 'minecraft:killed' | 'minecraft:killed_by' | 'minecraft:mined' | 'minecraft:picked_up' | 'minecraft:used';

//#region Display
export interface titleModel {
	text: string,
	color?: textColor,
	bold?: boolean,
	italic?: boolean,
	obfuscated?: boolean,
	strikethrough?: boolean,
	underlined?: boolean
}

export interface display {
	title: titleModel,
	description: titleModel,
	icon: {
		item: string,
		nbt: string
	},
	frame: frameType,
	show_toast: boolean,
	announce_to_chat: boolean,
	hidden: boolean,
	namespace: {
		text: 'mapcraft-data' | string
	},
	background:'minecraft:textures/gui/advancements/backgrounds/stone.png' | string 
}

export interface trigger {
	trigger: criteria,
	conditions: any
}
//#endregion Display

//#region Type
export interface numberRange {
	min: number,
	max: number
}

export interface recipe {
	[name: string]: boolean
}

export interface state {
	[name: string]: string
}

export interface stats {
	type: statsType | null,
	stat: string | null,
	value: number | numberRange | null
}
//#endregion Type

//#region Interface
export interface biome {
	biome: string,
	block: block | null,
	fluid: fluid | null,
	dimension: dimensionType | null,
	feature: string | null,
	smokey: boolean | null,
	position: {
		x: number | numberRange | null,
		y: number | numberRange | null,
		z: number | numberRange | null
	},
	light: light
}

export interface block {
	block: string,
	tag: string | null,
	nbt: string | null,
	state: state | null
}

export interface damage {
	dealt: number | numberRange,
	taken: number | numberRange,
	blocked: boolean | null,
	type: type | null,
	source_entity: entity | null
}

export interface distance {
	absolute: number | numberRange,
	horizontal: number | numberRange,
	x: number | numberRange,
	y: number | numberRange,
	z: number | numberRange,
}

export interface effect {
	[name: string]: {
		amplifier: number | numberRange,
		duration: number | numberRange
	}
}

export interface enchantement {
	levels: number | numberRange,
	enchantment: string,
}

export interface entity {
	type: string,
	nbt: string | null,
	distance: distance | null,
	effects: effect | null,
	location: biome | null,
	equipement: equipement | null,
	passenger: entity | null,
	player: player | null,
	flags: {
		is_baby: boolean,
		is_on_fire: boolean,
		is_sneaking: boolean,
		is_sprinting: boolean,
		is_swimming: boolean
	},
	lightning_bolt: {
		blocks_set_on_fire: number | null,
		entity_struck: entity | null
	}
}

export interface equipement {
	head: item | null,
	chest: item | null,
	legs: item | null,
	feet: item | null,
	mainhand: item | null,
	offhand: item | null
}

export interface fluid {
	id: string,
	state: state | null,
	tag: string | null
}

export interface item {
	item: string,
	count: number | numberRange | null,
	durability: number | numberRange | null,
	nbt: string | null,
	tag: string | null,
	potion: potionType | null,
	enchantements: enchantement[],
	stored_enchantements: enchantement[],
}

export interface light {
	light: number | numberRange,
}

export interface player {
	gamemode: gamemodeType,
	team: string | null,
	level: number | numberRange | null,
	recipes: recipe | null,
	advancements: state | null,
	stats: stats[],
	targeted_entity: entity | null,
	looking_at: entity | null,
	vehicle: entity | null,
	stepping_on: biome | null
}

export interface slot {
	empty: number | numberRange,
	full: number | numberRange,
	occupied: number | numberRange
}

export interface type {
	direct_entity: entity | null,
	source_entity: entity | null,
	bypasses_armor: boolean | null,
	bypasses_invulnerability: boolean | null,
	is_explosion: boolean | null,
	bypasses_magic: boolean | null,
	is_fire: boolean | null,
	is_magic: boolean | null,
	is_projectile: boolean | null,
	is_lightning: boolean | null
}
//#endregion Interface

//#region Json
export interface advancementList {
	id: string;
	name: string;
	path: string;
	data: main
}

export interface rewards {
	recipes?: string[],
	loot?: string[],
	experience?: number,
	function?: string
}

export interface advancement {
	id: string;
	data: {
		display: display;
		criteria: Record<string, trigger>,
		requirements: string[][],
		rewards: rewards
	},
	children?: advancement[];
}

export interface main {
	id: string;
	name: string;
	namespace: 'mapcraft-data' | string;
	background: 'minecraft:textures/gui/advancements/backgrounds/stone.png' | string;
	data: advancement
}
//#endregion Json
