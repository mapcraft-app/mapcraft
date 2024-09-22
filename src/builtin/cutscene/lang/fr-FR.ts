export default {
	notification: 'Une cinématique a reçu une modification',
	menu: {
		name: 'cinématique',
	},
	list: {
		title: 'liste des cinématiques',
		add: 'ajouter une cinématique',
		addName: 'nom de la cinématique'
	},
	option: {
		title: 'options',
		name: 'nom',
		description: 'description',
		end: {
			title: 'position finale de l\'entité',
			origin: {
				label: 'replacer l\'entité à son point d\'origine',
				desc: 'au début de la cinématique, la position de l\'entité sera enregistrée. À la fin, elle sera remise à sa position initiale.'
			},
			last: {
				label: 'mettre l\'entité au dernier point de la cinématique',
				desc: 'à la fin, l\'entité sera placée à la position exacte du dernier point de la cinématique'
			},
			custom: {
				label: 'placer l\'entité à une position exacte',
				desc: 'à la fin, l\'entité sera placée à la position prédéfinie ci-dessous'
			}
		}
	},
	content: {
		menu: {
			editStart: 'modifier le mcfunction de départ',
			editDuring: 'modifier le mcfunction exécuté pendant la scène',
			editEnd: 'modifier le mcfunction de fin',
			option: 'modifier les options',
			save: {
				start: 'sauvegarder la cinématique',
				end: 'succès de la sauvegarde',
				fail: 'échec de la sauvegarde',
			},
			autosave: {
				start: 'auto-sauvegarde de la cinématique',
				end: 'succès de l\'auto-sauvegarde',
				fail: 'échec de l\'auto-sauvegarde',
			},
			generate: {
				start: 'générer la cinémantique',
				end: 'succès de la génération',
				fail: 'échec de la génération'
			}
		},
		header: {
			x: 'x',
			y: 'y',
			z: 'z',
			rx: 'rx',
			ry: 'ry',
			duration: 'durée',
			transition: 'transition'
		},
		table: {
			s: 's',
			error: {
				noData: 'la valeur est obligatoire',
				noNeg: 'ne peut être négatif'
			}
		}
	}
};
