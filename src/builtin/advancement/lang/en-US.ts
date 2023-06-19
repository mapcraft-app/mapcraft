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
		generate: {
			start: 'generate advancement',
			end: 'generate advancement success',
			fail: 'generate advancement failed',
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
		telemetry: 'sends telemetry event',
		telemetryExplanation: 'determines whether telemetry data should be collected when this advancement is achieved or not',
		display: {
			utility: ['utility', 'disable the display tab, useful for advancements that are meant to run functions, etc...'],
			title: 'title',
			description: 'description',
			iconItem: 'icon item',
			nbt: 'nbt',
			frame: 'frame',
			toast: 'show toast ?',
			chat: 'announce to chat ?',
			hidden: 'hidden ?',
			errors: ['title is needed', 'description is needed'],
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
			no: 'no criteria exist',
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
		},
		killingBlow: 'killing blow',
		tags: {
			title: 'tags',
			id: 'id',
			expected: 'expected'
		},
		lightningStrike: {
			lightning: 'lightning',
			bystander: 'bystander'
		},
		recipe_crafted: {
			recipeId: 'recipe id',
			ingredients: 'ingredients',
			itemTag: 'item tag',
		},
		rideEntityInLava: {
			startPosition: 'start position'
		},
		thrownItemPickedUpByPlayer: 'thrower entity'
	},

	select: {
		block: 'block',
		item: 'item',
		color: 'color',
		dimension: 'dimension',
		entity: 'entity',
		frame: 'frame',
		gamemode: 'gamemode',
		gamemodes: ['adventure', 'creative', 'spectator', 'survival'],
		potion: 'potion',
		stats: 'stats',
		structure: 'structure',
		loot: 'loot',
		killingBlow: 'killing blow',
		theEnd: 'the end',
		overworld: 'overworld',
		theNether: 'the nether'
	},

	type: {
		range: 'set range',
		recipe: 'recipe',
		key: 'key',
		value: 'value',
		stat: 'stat'
	},

	trigger: {
		allayDropItemOnBlock: 'allay drop item on block',
		avoidVibration: 'avoid vibration',
		
		beeNestDestroyed: 'bee nest destroyed',
		bredAnimals: 'bred animals',
		brewedPotion: 'brewed potion',
		changedDimension: 'changed dimension',
		channeledLightning: 'channeled lightning',
		constructBeacon: 'construct beacon',
		consumeItem: 'consume item',
		curedZombieVillager: 'cured zombie villager',
		effectsChanged: 'effects changed',
		enchantedItem: 'enchanted item',
		enterBlock: 'enter block',
		entityHurtPlayer: 'entity hurt player',
		entityKilledPlayer: 'entity killed player',
		fallFromHeight: 'fall from height',
		filledBucket: 'filled bucket',
		fishingRodHooked: 'fishing rod hooked',
		heroOfTheVillage: 'hero of the village',
		impossible: 'impossible',
		inventoryChanged: 'inventory changed',
		itemDurabilityChanged: 'item durability changed',
		itemUsedOnBlock: 'item used on block',
		killMobNearSculkCatalyst: 'kill mob near sculk catalyst',
		killedByCrossbow: 'killed by crossbow',
		levitation: 'levitation',
		lightningStrike: 'lightning strike',
		location: 'location',
		netherTravel: 'nether travel',
		placedBlock: 'placed block',
		playerGeneratesContainerLoot: 'player generates container loot',
		playerHurtEntity: 'player hurt entity',
		playerInteractedWithEntity: 'player interacted with entity',
		playerKilledEntity: 'player killed entity',
		recipeCrafted: 'recipe crafted',
		recipeUnlocked: 'recipe unlocked',
		rideEntityInLava: 'ride entity in lava',
		safelyHarvestHoney: 'safely harvest honey',
		shotCrossbow: 'shot crossbow',
		sleptInBed: 'slept in bed',
		slideDownBlock: 'slide down block',
		startedRinding: 'started rinding',
		summonedEntity: 'summoned entity',
		tameAnimal: 'tame animal',
		targetHit: 'target hit',
		thrownItemPickedUpByEntity: 'thrown item picked up by entity',
		thrownItemPickedUpByPlayer: 'thrown item picked up by player',
		tick: 'tick',
		usedEnderEye: 'used ender eye',
		usedTotem: 'used totem',
		usingItem: 'using item',
		villagerTrade: 'villager trade',
		voluntaryExile: 'voluntary exile',
		notFound: 'this criteria does not exist'
	}
};
