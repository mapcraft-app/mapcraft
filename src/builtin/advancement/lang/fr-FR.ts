export default {
	menu: {
		name: 'Progrès'
	},

	main: {
		name: 'Nom',
		save: {
			start: 'sauvegarde des progrès',
			end: 'sauvegarde des progrès réussi',
			fail: 'sauvegarde des progrès échoué',
		},
		autosave: {
			start: 'auto-sauvegarde des progrès',
			end: 'auto-sauvegarde des progrès réussi',
			fail: 'auto-sauvegarde des progrès échoué',
		},
		delete: {
			start: 'suppression du progrès',
			end: 'suppression du progrès réussi',
			fail: 'suppression du progrès échoué',
		},
		generate: {
			start: 'génération du progrès',
			end: 'génération du progrès réussi',
			fail: 'génération du progrès échoué',
		},
		fsError: 'une erreur s\'est produite lors de l\'écriture du fichier',
		rmError: 'une erreur s\'est produite lors de la suppression du fichier'
	},

	interface: {
		common: {
			block: 'bloc',
			enchantement: 'enchantement',
			nbt: 'nbt',
			tag: 'étiquette',
			state: 'état',
			x: 'x',
			y: 'y',
			z: 'z'
		},
		biome: {
			biome: 'biome',
			fluid: 'fluide',
			feature: 'fonctionnalité',
			smokey: 'fumé',
			position: 'position',
			light: 'lumière'
		},
		damage: {
			damage: 'dommage',
			dealt: 'traité',
			taken: 'pris',
			blocked: 'bloqué',
			type: 'type',
			source: 'entité source'
		},
		distance: {
			absolute: 'absolu',
			horizontal: 'horizontal',
		},
		effect: {
			amplifier: 'amplificateur',
			duration: 'durée'
		},
		entityPlayer: {
			type: 'type',
			isBaby: 'est un bébé ?',
			isFire: 'est en feu ?',
			isSneaking: 'est-ce qu\'il se faufille ?',
			isSprinting: 'est-ce qu\'il court ?',
			isSwimming: 'est-ce qu\'il nage ?',
			distance: 'distance',
			effect: 'effet',
			location: 'localisation',
			equipement: 'équipement',
			passenger: 'passager',
			player: 'joueur',
			lightningBolt: 'éclair',
			blocksSetOnFire: 'blocs incendiés',
			entityStruck: 'entité frappée',
			team: 'équipe',
			level: 'niveau',
			recipes: 'recettes',
			advancements: 'progrès',
			stats: 'statistiques',
			targetedEntity: 'entité ciblée',
			lookingAt: 'regardant',
			vehicle: 'véhicule',
			steppingOn: 'marche sur'
		},
		equipement: {
			head: 'tête',
			chest: 'poitrine',
			legs: 'jambes',
			feet: 'pied',
			mainhand: 'main courante',
			offhand: 'autre main'
		},
		fluid: {
			flags: 'drapeaux',
			id: 'id'
		},
		item: {
			item: 'élément',
			items: 'éléments',
			count: 'compte',
			delta: 'delta',
			durability: 'durabilité',
			potion: 'potion',
			enchantements: 'enchantements',
			storedEnchantements: 'enchantements stockés'
		},
		slot: {
			slot: 'slot',
			empty: 'vide',
			full: 'remplie',
			occupied: 'Occupé'
		},
		type: {
			type: 'type',
			directEntity: 'Entité directe',
			sourceEntity: 'Entité source',
			bypassArmor: 'contourner l\'armure',
			bypassInvulnerability: 'contourner l\'invulnérabilité',
			bypassMagic: 'contourner la magie',
			isExplosion: 'est une explosion',
			isFire: 'est en feu',
			isMagic: 'est magique',
			isProjectile: 'est un projectile',
			isLightning: 'est un éclair'
		}
	},

	tab: {
		background: 'image d\'arrière-plan',
		telemetry: 'envoie un événement de télémétrie',
		telemetryExplanation: 'détermine si les données télémétriques doivent être collectées lorsque ce progrès est réalisé ou non',
		display: {
			utility: ['utilitaire', 'désactiver l\'onglet d\'affichage, utile pour les avancements qui sont destinés à exécuter des fonctions, etc...'],
			title: 'titre',
			description: 'description',
			iconItem: 'icône de l\'élément',
			nbt: 'nbt',
			frame: 'cadre',
			toast: 'montrer le toast ?',
			chat: 'annoncer dans le chat ?',
			hidden: 'caché ?',
			errors: ['le titre est nécessaire', 'la description est nécessaire'],
			text: 'texte',
			color: 'couleur',
			noResult: 'aucun résultat',
			bold: 'gras',
			italic: 'italique',
			obfuscated: 'obfusqué',
			strikethrough: 'barré',
			underlined: 'souligné',
			colorList: ['noir', 'bleu foncé', 'vert foncé', 'bleu eau foncé', 'rouge foncé', 'violet foncé', 'or', 'gris', 'gris foncé', 'bleu', 'vert', 'bleu eau', 'rouge', 'violet clair', 'jaune', 'blanc']
		},
		requirements: {
			and: 'et'
		},
		rewards: {
			experience: 'expérience',
			recipes: 'recettes',
			loot: 'tables de butin',
			function: 'fonction'
		},
		
		beeNestDestroyed: {
			number: 'nombre d\'abeilles à l\'intérieur'
		},
		bredAnimals: {
			child: 'enfant',
			parent: 'parent',
			partner: 'partenaire'
		},
		changedDimension: {
			from: 'de',
			to: 'à'
		},
		channeledLightning: {
			victim: 'victime {x}'
		},
		curedZombieVillager: {
			zombie: 'zombie'
		},
		fishingRodHooked: {
			rod: 'canne à pêche'
		},
		inventoryChanged: {
			item: 'élément {x}'
		},
		killedBy: {
			unique: 'types d\'entités uniques',
			victims: 'victimes'
		},
		targetHit: {
			strength: 'force du signal'
		},
		villagerTrade: {
			villager: 'villageois'
		},
		killingBlow: 'coup mortel',
		tags: {
			title: 'étiquettes',
			id: 'id',
			expected: 'attendue'
		},
		lightningStrike: {
			lightning: 'foudre',
			bystander: 'spectateur'
		},
		recipe_crafted: {
			recipeId: 'identité de la recette',
			ingredients: 'ingrédients',
			itemTag: 'étiquette de l\'article',
		},
		ride_entity_in_lava: {
			startPosition: 'position de départ'
		}
	},

	select: {
		block: 'bloc',
		item: 'élément',
		color: 'couleur',
		dimension: 'dimension',
		entity: 'entité',
		frame: 'cadre',
		gamemode: 'mode de jeu',
		gamemodes: ['aventure', 'créatif', 'spectateur', 'survie'],
		potion: 'potion',
		stats: 'statistique',
		structure: 'structure',
		loot: 'butin',
		killingBlow: 'coup fatal',
		theEnd: 'l\'end',
		overworld: 'le monde normal',
		theNether: 'le nether'
	},

	type: {
		range: 'définir la plage',
		recipe: 'recette',
		key: 'clé',
		value: 'valeur',
		stat: 'statistique'
	},

	trigger: {
		beeNestDestroyed: 'nid d\'abeilles détruit',
		bredAnimals: 'animaux élevés',
		brewedPotion: 'potion brassée',
		changedDimension: 'changement de dimension',
		channeledLightning: 'éclair canalisé',
		constructBeacon: 'construction d\'une balise',
		consumeItem: 'consommer un élément',
		curedZombieVillager: 'villageois zombies guéris',
		effectsChanged: 'effets modifiés',
		enchantedItem: 'élément enchanté',
		enterBlock: 'entrer le bloc',
		entityHurtPlayer: 'une entité a blessé le joueur',
		entityKilledPlayer: 'une entité a tué le joueur',
		filledBucket: 'seau rempli',
		fishingRodHooked: 'canne à pêche accrochée',
		heroOfTheVillage: 'héros du village',
		impossible: 'impossible',
		inventoryChanged: 'inventaire modifié',
		itemDurabilityChanged: 'la durabilité de l\'élément a été modifiée',
		itemUsedOnBlock: 'élément utilisé sur le bloc',
		killedByCrossbow: 'tué par une arbalète',
		levitation: 'lévitation',
		location: 'emplacement',
		netherTravel: 'voyage dans le nether',
		placedBlock: 'bloc placé',
		playerGeneratesContainerLoot: 'le joueur génère le butin du conteneur',
		playerHurtEntity: 'entité blessée par un joueur',
		playerInteractedWithEntity: 'le joueur a interagi avec une entité',
		playerKilledEntity: 'entité tuée par un joueur',
		recipeUnlocked: 'recette débloquée',
		safelyHarvestHoney: 'récolte du miel en toute sécurité',
		shotCrossbow: 'tir à l\'arbalète',
		sleptInBed: 'dormir dans un lit',
		slideDownBlock: 'bloc glissement vers le bas',
		summonedEntity: 'entité invoquée',
		tameAnimal: 'animal apprivoisé',
		targetHit: 'cible atteinte',
		thrownItemPickedUpByEntity: 'élément jeté ramassé par une entité',
		tick: 'tick',
		usedEnderEye: 'œil d\'ender utilisé',
		usedTotem: 'totem utilisé',
		villagerTrade: 'commerce de villageois',
		voluntaryExile: 'exil volontaire',
		notFound: 'ce critère n\'existe pas'
	}
};
