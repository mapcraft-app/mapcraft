const { MCsearch } = require('mapcraft-api');

const getMinMax = (min, max) =>
{
	if (min && !max)
		return { min: Number(min), max: Number(min) };
	if (!min && max)
		return { min: Number(max), max: Number(max) };
	if (min && max)
		return { min: Number(min), max: Number(max) };
	return undefined;
};

/**
 * Insert value in json if exist
 * @param {json} json json object
 * @param {string} key key of value
 * @param {string} value value of key
 * @param {constructor} type Specified object constructor, default to undefined
 */
const insert = (json, key, value, type = undefined) =>
{
	if (value)
		json[key] = (type) ? type(value) : value; //eslint-disable-line no-param-reassign
};

class GetForm
{
	static search(element, value)
	{
		switch (element)
		{
			default:
				throw new Error('No predefined search');
			case '__SEARCH_BIOMES':
				return { biome: `minecraft:${value}` };
			case '__SEARCH_BLOCKS':
				return { block: `minecraft:${value}` };
			case '__SEARCH_BLOCKSITEMS':
			case '__SEARCH_ITEMS':
				return { item: `minecraft:${value}` };
			case '__SEARCH_EFFECTS':
				return { effect: `minecraft:${value}` };
			case '__SEARCH_ENCHANTEMENTS':
				return { enchantement: `minecraft:${value}` };
			case '__SEARCH_ENTITIES':
				return { entity: `minecraft:${value}` };
			case '__SEARCH_POTIONS':
				return { potion: `minecraft:${value}` };
			case '__SEARCH_STRUCTURES':
				return { structure: `minecraft:${value}` };
		}
	}

	/**
	 * Get value of item modal
	 * @param {Element} modal element of modal body
	 */
	static items(modal)
	{
		const json = {};
		insert(json, 'item', MCsearch.GetValue(modal.querySelector('#form-item-modal-item')));
		insert(json, 'nbt', modal.querySelector('#form-item-modal-nbt').value);
		insert(json, 'data', modal.querySelector('#form-item-modal-data').value, Number);
		insert(json, 'tag', modal.querySelector('#form-item-modal-tag').value);
		insert(json, 'count', getMinMax(modal.querySelector('#form-item-modal-count-min').value, modal.querySelector('#form-item-modal-count-max').value));
		insert(json, 'durability', getMinMax(modal.querySelector('#form-item-modal-durability-min').value, modal.querySelector('#form-item-modal-durability-max').value));
		insert(json, 'potion', MCsearch.GetValue(modal.querySelector('#form-item-modal-potion')));
		//enchantement form-item-modal-stored-enchantements-list
		const enchantementsList = modal.querySelectorAll('#form-item-modal-enchantements-list > div');
		if (enchantementsList.length > 0)
		{
			json.enchantements = [];
			for (const enchantement of enchantementsList)
			{
				const value = `minecraft:${MCsearch.GetValue(enchantement.querySelector('#form-item-modal-enchantements-list-search'))}`;
				if (value)
				{
					const retJson = {};
					insert(retJson, 'levels', getMinMax(enchantement.querySelector('#form-item-modal-enchantements-list-level-min').value, enchantement.querySelector('#form-item-modal-enchantements-list-level-max').value));
					retJson.enchantement = String(value);
					json.enchantements.push(retJson);
				}
			}
		}
		//stored-enchantements
		const storedEnchantementsList = modal.querySelectorAll('#form-item-modal-stored-enchantements-list > div');
		if (storedEnchantementsList.length > 0)
		{
			json.stored_enchantments = [];
			for (const enchantement of storedEnchantementsList)
			{
				const value = `minecraft:${MCsearch.GetValue(enchantement.querySelector('#form-item-modal-stored-enchantements-list-search'))}`;
				if (value)
				{
					const retJson = {};
					insert(retJson, 'levels', getMinMax(enchantement.querySelector('#form-item-modal-stored-enchantements-list-level-min').value, enchantement.querySelector('#form-item-modal-stored-enchantements-list-level-max').value));
					retJson.enchantement = String(value);
					json.stored_enchantments.push(retJson);
				}
			}
		}
		return json;
	}

	/**
	 * Get value of entity modal
	 * @param {Element} modal element of modal body
	 */
	static entity(modal)
	{
		const json = {};
		insert(json, 'type', MCsearch.GetValue(modal.querySelector('#form-entity-modal-entity')));
		insert(json, 'nbt', modal.querySelector('#form-entity-modal-nbt').value);
		json.flags = {
			is_baby: Boolean(modal.querySelector('#form-entity-modal-check-baby').checked),
			is_on_fire: Boolean(modal.querySelector('#form-entity-modal-check-fire').checked),
			is_sneaking: Boolean(modal.querySelector('#form-entity-modal-check-sneak').checked),
			is_sprinting: Boolean(modal.querySelector('#form-entity-modal-check-sprint').checked),
			is_swimming: Boolean(modal.querySelector('#form-entity-modal-check-swim').checked),
		};
		//effects
		const effectsList = modal.querySelectorAll('#form-entity-modal-effect-list > div');
		if (effectsList.length > 0)
			json.effects = {};
		for (const effect of effectsList)
		{
			const jsoneffect = {};
			const name = MCsearch.GetValue(effect.querySelector('#form-effects-block-search'));
			const amplifier = effect.querySelector('#form-effects-block-duration').value;
			const duration = effect.querySelector('#form-effects-block-amplifier').value;
			if (name)
			{
				if (amplifier)
					jsoneffect.amplifier = { min: Number(amplifier), max: Number(amplifier) };
				if (duration)
					jsoneffect.duration = { min: Number(duration), max: Number(duration) };
				json.effects[`minecraft:${name}`] = jsoneffect;
			}
		}
		//location
		json.location = this.location(modal.querySelector('#form-entity-modal-location > div'));
		//equipement
		json.equipement = {
			head: this.items(modal.querySelector('#form-entity-modal-switcher-head > div')),
			mainhand: this.items(modal.querySelector('#form-entity-modal-switcher-main-hand > div')),
			offhand: this.items(modal.querySelector('#form-entity-modal-switcher-off-hand > div')),
			chest: this.items(modal.querySelector('#form-entity-modal-switcher-chest > div')),
			legs: this.items(modal.querySelector('#form-entity-modal-switcher-legs > div')),
			feet: this.items(modal.querySelector('#form-entity-modal-switcher-feets > div')),
		};
		return json;
	}

	/**
	 * Get value of distance modal
	 * @param {Element} modal element of modal body
	 */
	static distance(modal)
	{
		const json = {};
		insert(json, 'absolute', getMinMax(modal.querySelector('#form-distance-modal-absolute-min').value, modal.querySelector('#form-distance-modal-absolute-max').value));
		insert(json, 'horizontal', getMinMax(modal.querySelector('#form-distance-modal-horizontal-min').value, modal.querySelector('#form-distance-modal-horizontal-max').value));
		insert(json, 'x', getMinMax(modal.querySelector('#form-distance-modal-x-min').value, modal.querySelector('#form-distance-modal-x-max').value));
		insert(json, 'y', getMinMax(modal.querySelector('#form-distance-modal-y-min').value, modal.querySelector('#form-distance-modal-y-max').value));
		insert(json, 'z', getMinMax(modal.querySelector('#form-distance-modal-z-min').value, modal.querySelector('#form-distance-modal-z-max').value));
		return json;
	}

	/**
	 * Get value of location modal
	 * @param {Element} modal element of modal body
	 */
	static location(modal)
	{
		const json = {};
		insert(json, 'biome', MCsearch.GetValue(modal.querySelector('#form-location-modal-biome')));
		insert(json, 'dimension', modal.querySelector('#form-location-modal-dimension').value);
		insert(json, 'feature', MCsearch.GetValue(modal.querySelector('#form-location-modal-feature')));
		insert(json, 'smokey', modal.querySelector('#form-location-modal-check-smokey').checked);
		//Block
		const tabBlock = {
			block: MCsearch.GetValue(modal.querySelector('#form-location-modal-block-block')),
			tag: modal.querySelector('#form-location-modal-block-tag').value,
			nbt: modal.querySelector('#form-location-modal-block-nbt').value,
		};
		if (tabBlock.block || tabBlock.tag || tabBlock.nbt)
		{
			json.block = {};
			if (tabBlock.block)
				json.block.block = String(`minecraft:${tabBlock.block}`);
			if (tabBlock.tag)
				json.block.tag = String(tabBlock.tag);
			if (tabBlock.nbt)
				json.block.nbt = String(tabBlock.nbt);
		}

		//Fluid
		const tabFluid = {
			id: modal.querySelector('#form-location-modal-fluid-id').value,
			tag: modal.querySelector('#form-location-modal-fluid-tag').value,
		};
		if (tabFluid.id || tabFluid.tag)
		{
			json.fluid = {};
			if (tabFluid.id)
				json.fluid.id = String(tabFluid.id);
			if (tabFluid.tag)
				json.fluid.tag = String(tabFluid.tag);
		}

		//Position
		const tabPosition = {
			x: getMinMax(modal.querySelector('#form-location-modal-x-min').value, modal.querySelector('#form-location-modal-x-max').value),
			y: getMinMax(modal.querySelector('#form-location-modal-y-min').value, modal.querySelector('#form-location-modal-y-max').value),
			z: getMinMax(modal.querySelector('#form-location-modal-z-min').value, modal.querySelector('#form-location-modal-z-max').value),
		};
		if (tabPosition.x || tabPosition.y || tabPosition.z)
		{
			json.position = {};
			if (tabPosition.x)
				json.position.x = tabPosition.x;
			if (tabPosition.y)
				json.position.y = tabPosition.y;
			if (tabPosition.z)
				json.position.z = tabPosition.z;
		}

		//Light
		const retLight = getMinMax(modal.querySelector('#form-location-modal-light-min').value, modal.querySelector('#form-location-modal-light-max').value);
		if (retLight)
			json.light = { light: retLight };
		return json;
	}
}

module.exports = GetForm;
