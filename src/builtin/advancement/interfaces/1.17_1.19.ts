/**
 * __at_root__: true // key is in root of condition
 * __empty__: true // condition is empty
 */
import {
	biome,
	damage,
	dimensionType,
	distance,
	tags,
	effect,
	entity,
	item,
	numberRange,
	potionType,
	slot,
	state,
	type
} from '../model';

export type criteria =
'allay_drop_item_on_block' |
'avoid_vibration' |
'bee_nest_destroyed' |
'bred_animals' |
'brewed_potion' |
'changed_dimension' |
'channeled_lightning' |
'construct_beacon' |
'consume_item' |
'cured_zombie_villager' |
'effects_changed' |
'enchanted_item' |
'enter_block' |
'entity_hurt_player' |
'entity_killed_player' |
'fall_from_height' |
'filled_bucket' |
'fishing_rod_hooked' |
'hero_of_the_village' |
'impossible' |
'inventory_changed' |
'item_durability_changed' |
'item_used_on_block' |
'kill_mob_near_sculk_catalyst' |
'killed_by_crossbow' |
'levitation' |
'lightning_strike' |
'location' |
'nether_travel' |
'placed_block' |
'player_generates_container_loot' |
'player_hurt_entity' |
'player_interacted_with_entity' |
'player_killed_entity' |
'recipe_unlocked' |
'ride_entity_in_lava' |
'shot_crossbow' |
'slept_in_bed' |
'slide_down_block' |
'started_riding' |
'summoned_entity' |
'tame_animal' |
'target_hit' |
'tick' |
'thrown_item_picked_up_by_entity' |
'thrown_item_picked_up_by_player' |
'used_ender_eye' |
'used_totem' |
'using_item' |
'villager_trade' |
'voluntary_exile'
;

export interface allay_drop_item_on_block {
	player: entity | null,
	item: item | null,
	location: location | null
}

export interface avoid_vibration {
	player: entity | null
}


export interface bee_nest_destroyed {
	block: string | null,
	item: item | null,
	num_bees_inside: number
}

export interface bred_animals {
	child: entity,
	parent: entity,
	partner: entity | null
}

export interface brewed_potion {
	potion: potionType
}

export interface changed_dimension {
	from: dimensionType,
	to: dimensionType
}

export interface channeled_lightning {
	victims: entity[]
}

export interface construct_beacon {
	level: number | numberRange;
}

export interface consume_item {
	item: item
}

export interface cured_zombie_villager {
	villager: entity,
	zombie: entity
}

export interface effects_changed {
	effects: effect
}

export interface enchanted_item {
	item: item,
	levels: number | numberRange
}

export interface enter_block {
	state: state,
	block: string
}

export interface entity_hurt_player {
	damage: damage
}

export interface entity_killed_player {
	entity: entity,
	killing_blow: type
}

export interface fall_from_height {
	player: entity | null,
	start_position: location | null,
	distance: distance | null
}

export interface filled_bucket {
	item: item
}

export interface fishing_rod_hooked {
	entity: entity,
	item: item,
	rod: item
}

export interface hero_of_the_village {
	__at_root__: true,
	biome: biome
}

export interface impossible {
	__empty__: true
}

export interface inventory_changed {
	items: item[],
	slots: slot
}

export interface item_durability_changed {
	delta: number | numberRange,
	durability: number | numberRange,
	item: item
}

export interface item_used_on_block {
	item: item,
	location: biome
}

export interface kill_mob_near_sculk_catalyst {
	player: entity,
	entity: entity,
	killing_blow: {
		tags: tags | null,
		direct_entity: entity | null,
		source_entity: entity | null,
	}
}

export interface killed_by_crossbow {
	unique_entity_types: number | numberRange,
	victims: entity[]
}

export interface levitation {
	distance: distance,
	duration: number | numberRange
}

export interface lightning_strike {
	player: entity | null,
	lightning: entity | null,
	bystander: entity | null
}

export interface location {
	__at_root__: true,
	biome: biome
}

export interface nether_travel {
	distance: distance
}

export interface placed_block {
	item: item,
	location: biome,
	block: string
}

export interface player_generates_container_loot {
	loot_table: string
}

export interface player_hurt_entity {
	entity: entity,
	damage: damage
}

export interface player_interacted_with_entity {
	item: item,
	entity: entity
}

export interface player_killed_entity {
	entity: entity,
	killing_blow: type
}

export interface recipe_unlocked {
	recipe: string
}

export interface ride_entity_in_lava {
	player: entity,
  start_position: location | null,
  distance: distance | null
}

export interface shot_crossbow {
	item: item
}

export interface slept_in_bed {
	__at_root__: true,
	biome: biome
}

export interface slide_down_block {
	block: string
}

export interface started_riding {
	player: entity
}

export interface summoned_entity {
	entity: entity
}

export interface tame_animal {
	entity: entity
}

export interface target_hit {
	shooter: entity,
	signal_strength: number,
	projectile: string
}

export interface tick {
	__empty__: true
}

export interface thrown_item_picked_up_by_entity {
	entity: entity,
	item: item
}

export interface thrown_item_picked_up_by_player {
	player: entity,
	entity: entity,
	item: item
}

export interface used_ender_eye {
	distance: number | numberRange
}

export interface used_totem {
	item: item
}

export interface using_item {
	player: entity
	item: item
}

export interface villager_trade {
	item: item,
	villager: entity
}

export interface voluntary_exile {
	__at_root__: true,
	biome: biome
}
