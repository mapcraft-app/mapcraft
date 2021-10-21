/**
 * shapeless, ingredients is using, and pattern & key is deleted
 * shape, ingredients is deleted, and pattern & key is using
 */
exports.crafting_player = {
	type: String,
	group: String,
	ingredients: Array,
	pattern: Array,
	key: {},
	result: {
		item: String,
		count: Number,
	},
	isPlayer: Boolean,
	exactPosition: Boolean,
};

/**
 * furnace: smelting
 * blast_furnace: blasting
 * campfire: campfire_cooking
 * smoker: smoking
 */

exports.furnace = {
	type: String,
	group: String,
	ingredient: Array,
	result: String,
	experience: Number,
	cookingtime: Number,
};

exports.stonecutter = {
	type: String,
	group: String,
	ingredient: { item: String },
	result: String,
	count: Number,
};

exports.smithing_table = {
	type: String,
	group: String,
	base: { item: String },
	addition: { item: String },
	result: { item: String },
};
