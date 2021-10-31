exports.advancement = {
	parent: String,
	display: {
		icon: {
			item: String,
			nbt: String,
		},
		title: {
			text: String,
			color: String,
			bold: Boolean,
			italic: Boolean,
			underlined: Boolean,
			strikethrough: Boolean,
			obfuscated: Boolean,
		},
		description: {
			text: String,
			color: String,
			bold: Boolean,
			italic: Boolean,
			underlined: Boolean,
			strikethrough: Boolean,
			obfuscated: Boolean,
		},
		frame: String,
		background: String,
		show_toast: Boolean,
		announce_to_chat: Boolean,
		hidden: Boolean,
	},
	criteria: {
		custom_trigger_name: {
			trigger: String,
			conditions: {
				durability: {
					min: Number,
					max: Number,
				},
				delta: {
					min: Number,
					max: Number,
				},
				slots: {
					occupied: {
						min: Number,
						max: Number,
					},
					full: {
						min: Number,
						max: Number,
					},
					empty: {
						min: Number,
						max: Number,
					},
				},
				items: [
					{
						item: String,
						tag: String,
						count: {
							min: Number,
							max: Number,
						},
						durability: {
							min: Number,
							max: Number,
						},
						potion: String,
						enchantments: [
							{
								enchantment: String,
								levels: {
									min: Number,
									max: Number,
								},
							},
						],
					},
				],
				item: {
					item: String,
					tag: String,
					count: {
						min: Number,
						max: Number,
					},
					durability: {
						min: Number,
						max: Number,
					},
					potion: String,
					enchantments: [
						{
							enchantment: String,
							levels: {
								min: Number,
								max: Number,
							},
						},
					],
				},
				levels: {
					min: Number,
					max: Number,
				},
				recipe: String,
				position: {
					x: {
						min: Number,
						max: Number,
					},
					y: {
						min: Number,
						max: Number,
					},
					z: {
						min: Number,
						max: Number,
					},
				},
				biome: String,
				feature: String,
				dimension: String,
				from: String,
				to: String,
				block: String,
				state: { state_name: String },
				entity: {
					type: String,
					distance: {
						min: Number,
						max: Number,
					},
				},
				killing_blow: {
					bypasses_armor: Boolean,
					bypasses_invulnerability: Boolean,
					bypasses_magic: Boolean,
					is_explosion: Boolean,
					is_fire: Boolean,
					is_magic: Boolean,
					is_projectile: Boolean,
					direct_entity: {
						type: String,
						distance: {
							min: Number,
							max: Number,
						},
					},
					source_entity: {
						type: String,
						distance: {
							min: Number,
							max: Number,
						},
					},
				},
				distance: {
					min: Number,
					max: Number,
				},
				parent: {
					type: String,
					distance: {
						min: Number,
						max: Number,
					},
				},
				partner: {
					type: String,
					distance: {
						min: Number,
						max: Number,
					},
				},
				child: {
					type: String,
					distance: {
						min: Number,
						max: Number,
					},
				},
				potion: String,
				level: {
					min: Number,
					max: Number,
				},
				damage: {
					dealt: {
						min: Number,
						max: Number,
					},
					taken: {
						min: Number,
						max: Number,
					},
					blocked: Boolean,
					type: {
						bypasses_armor: Boolean,
						bypasses_invulnerability: Boolean,
						bypasses_magic: Boolean,
						is_explosion: Boolean,
						is_fire: Boolean,
						is_magic: Boolean,
						is_projectile: Boolean,
						direct_entity: {
							type: String,
							distance: {
								min: Number,
								max: Number,
							},
						},
						source_entity: {
							type: String,
							distance: {
								min: Number,
								max: Number,
							},
						},
					},
					source_entity: {
						type: String,
						distance: {
							min: Number,
							max: Number,
						},
					},
				},
			},
		},
	},
	requirements: [[String]],
	rewards: {
		recipes: [String],
		loot: [String],
		experience: Number,
		function: String,
	},
};
