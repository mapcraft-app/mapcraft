export type textColor = 'black' | 'dark_blue' | 'dark_green' | 'dark_aqua' | 'dark_red' | 'dark_purple' | 'gold' | 'gray' | 'dark_gray' | 'blue' | 'green' | 'aqua' | 'red' | 'light_purple' | 'yellow' | 'white';
export type frameType = 'challenge' | 'goal' | 'task';
export type potionType = 'empty' | 'mundane' | 'thick' | 'awkward' | 'night vision' | 'long night vision' | 'invisibility' | 'long invisibility' | 'leaping' | 'long leaping' | 'strong leaping' | 'fire resistance' | 'long fire resistance' | 'swiftness' | 'long swiftness' | 'strong swiftness' | 'slowness' | 'long slowness' | 'strong slowness' | 'turtle master' | 'long turtle master' | 'strong turtle master';
export type gamemodeType = 'adventure' | 'creative' | 'spectator' | 'survival';
export type dimensionType = 'overworld' | 'the_end' | 'the_nether';

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
	background: string | 'minecraft:textures/gui/advancements/backgrounds/stone.png'
}

export interface trigger {
	trigger: string,
	conditions: Record<string, any>
}

export interface base {
	display?: display,
	criteria: Record<string, trigger>
}
//#endregion Display

//#region Type
export interface numberRange {
	min: number,
	max: number
}

export interface state {
	[name: string]: string
}

export interface recipe {
	[name: string]: boolean
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
	nbt?: string,
	distance?: distance,
	effects?: effect,
	location: biome,
	equipement: equipement,
	passenger: entity,
	player: player,
	flags: {
		is_baby: boolean,
		is_on_fire: boolean,
		is_sneaking: boolean,
		is_sprinting: boolean,
		is_swimming: boolean
	},
	lightning_bolt?: {
		blocks_set_on_fire?: number,
		entity_struck?: entity
	}
}

export interface equipement {
	head: item,
	chest: item,
	legs: item,
	feet: item,
	mainhand: item,
	offhand: item
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
	enchantements: enchantement[] | null,
	stored_enchantements: enchantement[] | null,
}

export interface light {
	light: number | numberRange,
}

export interface player {
	gamemode: gamemodeType,
	team?: string,
	level?: number | numberRange,
	recipes?: recipe,
	advancements?: state,
	targeted_entity?: entity,
	looking_at?: entity,
	vehicle?: entity,
	stepping_on?: biome
}

export interface type {
	direct_entity?: entity,
	source_entity?: entity,
	bypasses_armor?: boolean,
	bypasses_invulnerability?: boolean,
	is_explosion?: boolean,
	bypasses_magic?: boolean,
	is_fire?: boolean,
	is_magic?: boolean,
	is_projectile?: boolean,
	is_lightning?: boolean
}

export interface slot {
	empty: number | numberRange,
	full: number | numberRange,
	occupied: number | numberRange
}
//#endregion Interface