export default {
	menu: {
		name: 'Advancement'
	},

	main: {
		name: 'Name',
		save: {
			start: 'save advancement',
			end: 'save advancement success',
			fail: 'save advancement failed',
		},
		autosave: {
			start: 'autosave advancement',
			end: 'autosave advancement success',
			fail: 'autosave advancement failed',
		},
		delete: {
			start: 'delete advancement',
			end: 'delete advancement success',
			fail: 'delete advancement failed',
		},
		fsError: 'an error while writing the file has occurred',
		rmError: 'an error while deleting the file has occurred'
	},

	interface: {
		common: {
			block: 'block',
			enchantement: 'enchantement',
			nbt: 'nbt',
			tag: 'tag',
			state: 'state',
			x: 'x',
			y: 'y',
			z: 'z'
		},
		biome: {
			biome: 'biome',
			fluid: 'fluid',
			feature: 'feature',
			smokey: 'smokey',
			position: 'position',
			light: 'light'
		},
		damage: {
			damage: 'damage',
			dealt: 'dealt',
			taken: 'taken',
			blocked: 'blocked',
			type: 'type',
			source: 'source entity'
		},
		distance: {
			absolute: 'absolute',
			horizontal: 'horizontal',
		},
		effect: {
			amplifier: 'amplifier',
			duration: 'duration'
		},
		entityPlayer: {
			type: 'type',
			isBaby: 'is baby ?',
			isFire: 'is on fire ?',
			isSneaking: 'is sneaking ?',
			isSprinting: 'is sprinting ?',
			isSwimming: 'is swimming ?',
			distance: 'distance',
			effect: 'effect',
			location: 'location',
			equipement: 'equipement',
			passenger: 'passenger',
			player: 'player',
			lightningBolt: 'lightning bolt',
			blocksSetOnFire: 'blocks set on fire',
			entityStruck: 'entity struck',
			team: 'team',
			level: 'level',
			recipes: 'recipes',
			advancements: 'advancements',
			stats: 'stats',
			targetedEntity: 'targeted entity',
			lookingAt: 'looking at',
			vehicle: 'vehicle',
			steppingOn: 'stepping on'
		},
		equipement: {
			head: 'head',
			chest: 'chest',
			legs: 'legs',
			feet: 'feet',
			mainhand: 'mainhand',
			offhand: 'offhand'
		},
		fluid: {
			flags: 'flags',
			id: 'id'
		},
		item: {
			item: 'item',
			items: 'items',
			count: 'count',
			delta: 'delta',
			durability: 'durability',
			potion: 'potion',
			enchantements: 'enchantements',
			storedEnchantements: 'stored enchantements'
		},
		slot: {
			slot: 'slot',
			empty: 'empty',
			full: 'full',
			occupied: 'occupied'
		},
		type: {
			type: 'type',
			directEntity: 'Direct entity',
			sourceEntity: 'Source entity',
			bypassArmor: 'bypass armor',
			bypassInvulnerability: 'bypass invulnerability',
			bypassMagic: 'bypass magic',
			isExplosion: 'is explosion',
			isFire: 'is fire',
			isMagic: 'is magic',
			isProjectile: 'is projectile',
			isLightning: 'is lightning'
		}
	},

	tab: {
		background: 'background image',
		display: {
			title: 'title',
			description: 'description',
			iconItem: 'icon item',
			nbt: 'nbt',
			frame: 'frame',
			toast: 'show toast ?',
			chat: 'announce to chat ?',
			hidden: 'hidden ?',

			text: 'text',
			color: 'color',
			noResult: 'no results',
			bold: 'bold',
			italic: 'italic',
			obfuscated: 'obfuscated',
			strikethrough: 'strikethrough',
			underlined: 'underlined',
			colorList: ['black', 'dark blue', 'dark green', 'dark aqua', 'dark red', 'dark purple', 'gold', 'gray', 'dark gray', 'blue', 'green', 'aqua', 'red', 'light purple', 'yellow', 'white']
		},
		requirements: {
			and: 'and'
		},
		rewards: {
			experience: 'experience',
			recipes: 'recipes',
			loot: 'loot tables',
			function: 'function'
		},

		beeNestDestroyed: {
			number: 'number of bee inside'
		},
		bredAnimals: {
			child: 'child',
			parent: 'parent',
			partner: 'partner'
		},
		changedDimension: {
			from: 'from',
			to: 'to'
		},
		channeledLightning: {
			victim: 'victim {x}'
		},
		curedZombieVillager: {
			zombie: 'zombie'
		},
		fishingRodHooked: {
			rod: 'rod'
		},
		inventoryChanged: {
			item: 'Item {x}'
		},
		killedBy: {
			unique: 'unique entity types',
			victims: 'victims'
		},
		targetHit: {
			strength: 'signal strength'
		},
		villagerTrade: {
			villager: 'villager'
		}
	},

	select: {
		block: 'block',
		item: 'item',
		color: 'color',
		dimension: 'dimension',
		entity: 'entity',
		frame: 'frame',
		gamemode: 'gamemode',
		potion: 'potion',
		stats: 'stats',
		structure: 'structure',
		loot: 'loot',
		killingBlow: 'killing blow'
	},

	type: {
		range: 'set range',
		recipe: 'recipe',
		key: 'key',
		value: 'value',
		stat: 'stat'
	},

	trigger: {
		beeNestDestroyed: 'Bee nest destroyed',
		bredAnimals: 'Bred animals',
		brewedPotion: 'Brewed potion',
		changedDimension: 'Changed dimension',
		channeledLightning: 'Channeled lightning',
		constructBeacon: 'Construct beacon',
		consumeItem: 'Consume item',
		curedZombieVillager: 'Cured zombie villager',
		effectsChanged: 'Effects changed',
		enchantedItem: 'Enchanted item',
		enterBlock: 'Enter block',
		entityHurtPlayer: 'Entity hurt player',
		entityKilledPlayer: 'Entity killed player',
		filledBucket: 'Filled bucket',
		fishingRodHooked: 'Fishing rod hooked',
		heroOfTheVillage: 'Hero of the village',
		impossible: 'Impossible',
		inventoryChanged: 'Inventory changed',
		itemDurabilityChanged: 'Item durability changed',
		itemUsedOnBlock: 'Item used on block',
		killedByCrossbow: 'Killed by crossbow',
		levitation: 'Levitation',
		location: 'Location',
		netherTravel: 'Nether travel',
		placedBlock: 'Placed block',
		playerGeneratesContainerLoot: 'Player generates container loot',
		playerHurtEntity: 'Player hurt entity',
		playerInteractedWithEntity: 'Player interacted with entity',
		playerKilledEntity: 'Player killed entity',
		recipeUnlocked: 'Recipe unlocked',
		safelyHarvestHoney: 'Safely harvest honey',
		shotCrossbow: 'Shot crossbow',
		sleptInBed: 'Slept in bed',
		slideDownBlock: 'Slide down block',
		summonedEntity: 'Summoned entity',
		tameAnimal: 'Tame animal',
		targetHit: 'Target hit',
		thrownItemPickedUpByEntity: 'Thrown item picked up by entity',
		tick: 'Tick',
		usedEnderEye: 'Used ender eye',
		usedTotem: 'Used totem',
		villagerTrade: 'Villager trade',
		voluntaryExile: 'Voluntary exile',
		notFound: 'This criteria does not exist'
	}
};
