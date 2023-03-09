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
		display: {
			title: 'titre',
			description: 'description',
			iconItem: 'icône de l\'élément',
			nbt: 'nbt',
			frame: 'cadre',
			toast: 'montrer le toast ?',
			chat: 'annoncer dans le chat ?',
			hidden: 'caché ?',

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
		potion: 'potion',
		stats: 'statistique',
		structure: 'structure',
		loot: 'butin',
		killingBlow: 'coup fatal'
	},

	type: {
		range: 'définir la plage',
		recipe: 'recette',
		key: 'clé',
		value: 'valeur',
		stat: 'statistique'
	},

	trigger: {
		beeNestDestroyed: 'Nid d\'abeilles détruit',
		bredAnimals: 'Animaux élevés',
		brewedPotion: 'Potion brassée',
		changedDimension: 'Changement de dimension',
		channeledLightning: 'Éclair canalisé',
		constructBeacon: 'Construction d\'une balise',
		consumeItem: 'Consommer un élément',
		curedZombieVillager: 'Villageois zombies guéris',
		effectsChanged: 'Effets modifiés',
		enchantedItem: 'Élément enchanté',
		enterBlock: 'Entrer le bloc',
		entityHurtPlayer: 'Une entité a blessé le joueur',
		entityKilledPlayer: 'Une entité a tué le joueur',
		filledBucket: 'Seau rempli',
		fishingRodHooked: 'Canne à pêche accrochée',
		heroOfTheVillage: 'Héros du village',
		impossible: 'Impossible',
		inventoryChanged: 'Inventaire modifié',
		itemDurabilityChanged: 'La durabilité de l\'élément a été modifiée',
		itemUsedOnBlock: 'Élément utilisé sur le bloc',
		killedByCrossbow: 'Tué par une arbalète',
		levitation: 'Lévitation',
		location: 'Emplacement',
		netherTravel: 'Voyage dans les Bas-Fonds',
		placedBlock: 'Bloc placé',
		playerGeneratesContainerLoot: 'Le joueur génère le butin du conteneur',
		playerHurtEntity: 'Entité blessée par un joueur',
		playerInteractedWithEntity: 'Le joueur a interagi avec une entité',
		playerKilledEntity: 'Entité tuée par un joueur',
		recipeUnlocked: 'Recette débloquée',
		safelyHarvestHoney: 'Récolte du miel en toute sécurité',
		shotCrossbow: 'Tir à l\'arbalète',
		sleptInBed: 'Dormir dans un lit',
		slideDownBlock: 'Bloc glissement vers le bas',
		summonedEntity: 'Entité invoquée',
		tameAnimal: 'Animal apprivoisé',
		targetHit: 'Cible atteinte',
		thrownItemPickedUpByEntity: 'Élément jeté ramassé par une entité',
		tick: 'Tick',
		usedEnderEye: 'Œil d\'ender utilisé',
		usedTotem: 'Totem utilisé',
		villagerTrade: 'Commerce de villageois',
		voluntaryExile: 'L\'exil volontaire',
		notFound: 'Ce critère n\'existe pas'
	}
};
