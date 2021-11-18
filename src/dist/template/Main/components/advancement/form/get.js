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
const isEmpty = (json) => (!Object.keys(json).length);

/**
 * Insert value in json if exist
 * @param {json} json json object
 * @param {string} key key of value
 * @param {string} value value of key
 * @param {constructor} type Specified object constructor, default to undefined
 */
const insert = (json, key, value, type = undefined) =>
{
	if (value || (typeof value === 'object' && Object.keys(value).length))
		json[key] = (type) ? type(value) : value; //eslint-disable-line no-param-reassign
};

class GetForm
{
	static form(type, modal)
	{
		switch (type)
		{
			default:
				throw new Error('No predefined form');
			case '__FORM_DAMAGE':
				return this.damage(modal);
			case '__FORM_DISTANCE':
				return this.distance(modal);
			case '__FORM_DURABILITY':
				return this.durability(modal);
			case '__FORM_EFFECTS':
				return this.effect(modal);
			case '__FORM_ENTITIES':
				return this.entity(modal);
			case '__FORM_ITEMS':
				return this.items(modal);
			case '__FORM_ITEMS_LIST':
				return this.itemsList(modal);
			case '__FORM_LOCATION':
				return this.location(modal);
			case '__FORM_PLAYER':
				return this.player(modal);
			case '__FORM_SLOT':
				return this.slot(modal);
			case '__FORM_STATE':
				return this.state(modal);
			case '__FORM_TYPE':
				return this.type(modal);
			case '__FORM_VICTIMS':
				return this.victim(modal);
		}
	}

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

	static damage(modal)
	{
		const json = {};
		insert(json, 'dealt', getMinMax(modal.querySelector('#form-damage-modal-dealt-min').value, modal.querySelector('#form-damage-modal-dealt-max').value));
		insert(json, 'taken', getMinMax(modal.querySelector('#form-damage-modal-taken-min').value, modal.querySelector('#form-damage-modal-taken-max').value));
		insert(json, 'blocked', modal.querySelector('#form-damage-modal-blocked').checked, Boolean);
		insert(json, 'type', this.type(modal.querySelector('#form-damage-modal-type > div')));
		insert(json, 'source_entity', this.entity(modal.querySelector('#form-damage-modal-entity > div')));
		return json;
	}

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

	static durability(modal)
	{
		const json = {};
		insert(json, 'delta', getMinMax(modal.querySelector('#form-durability-modal-delta-min').value, modal.querySelector('#form-durability-modal-delta-max').value));
		insert(json, 'durability', getMinMax(modal.querySelector('#form-durability-modal-durability-min').value, modal.querySelector('#form-durability-modal-durability-max').value));
		insert(json, 'item', this.items(modal.querySelector('#form-durability-modal-item > div')));
		return json;
	}

	static effect(modal)
	{
		const json = {};
		const effectList = modal.querySelectorAll('#form-effects-modal-effect-list > div');
		for (const effect of effectList)
		{
			const ret = {};
			insert(ret, 'effect', MCsearch.GetValue(effect.querySelector('#form-effects-block-search')));
			insert(ret, 'duration', effect.querySelector('#form-effects-block-duration').value, Number);
			insert(ret, 'amplifier', effect.querySelector('#form-effects-block-amplifier').value, Number);
			if (ret.effect && (ret.duration || ret.amplifier))
			{
				const newItem = {};
				if (ret.duration)
					insert(newItem, 'duration', getMinMax(ret.duration, ret.duration));
				if (ret.amplifier)
					insert(newItem, 'amplifier', getMinMax(ret.amplifier, ret.amplifier));
				insert(json, `minecraft:${ret.effect}`, newItem);
			}
		}
		return json;
	}

	static entity(modal)
	{
		const json = {};
		insert(json, 'type', MCsearch.GetValue(modal.querySelector('#form-entity-modal-entity')));
		insert(json, 'nbt', modal.querySelector('#form-entity-modal-nbt').value);
		//flags
		json.flags = {};
		const flagsList = {
			is_baby: Boolean(modal.querySelector('#form-entity-modal-check-baby').checked),
			is_on_fire: Boolean(modal.querySelector('#form-entity-modal-check-fire').checked),
			is_sneaking: Boolean(modal.querySelector('#form-entity-modal-check-sneak').checked),
			is_sprinting: Boolean(modal.querySelector('#form-entity-modal-check-sprint').checked),
			is_swimming: Boolean(modal.querySelector('#form-entity-modal-check-swim').checked),
		};
		insert(json.flags, 'is_baby', flagsList.is_baby, Boolean);
		insert(json.flags, 'is_on_fire', flagsList.is_on_fire, Boolean);
		insert(json.flags, 'is_sneaking', flagsList.is_sneaking, Boolean);
		insert(json.flags, 'is_sprinting', flagsList.is_sprinting, Boolean);
		insert(json.flags, 'is_swimming', flagsList.is_swimming, Boolean);
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
		//distance
		const distanceList = {
			absolute: getMinMax(modal.querySelector('#form-distance-modal-absolute-min').value, modal.querySelector('#form-distance-modal-absolute-max').value),
			horizontal: getMinMax(modal.querySelector('#form-distance-modal-horizontal-min').value, modal.querySelector('#form-distance-modal-horizontal-max').value),
			x: getMinMax(modal.querySelector('#form-distance-modal-x-min').value, modal.querySelector('#form-distance-modal-x-max').value),
			y: getMinMax(modal.querySelector('#form-distance-modal-y-min').value, modal.querySelector('#form-distance-modal-y-max').value),
			z: getMinMax(modal.querySelector('#form-distance-modal-z-min').value, modal.querySelector('#form-distance-modal-z-max').value),
		};
		if (distanceList.absolute || distanceList.horizontal || distanceList.x || distanceList.y || distanceList.z)
		{
			json.distance = {};
			insert(json.distance, 'absolute', distanceList.absolute);
			insert(json.distance, 'horizontal', distanceList.horizontal);
			insert(json.distance, 'x', distanceList.x);
			insert(json.distance, 'y', distanceList.y);
			insert(json.distance, 'z', distanceList.z);
		}
		//location
		insert(json, 'location', this.location(modal.querySelector('#form-entity-modal-location > div')));
		//equipement
		const equipementList = {
			head: this.items(modal.querySelector('#form-entity-modal-switcher-head > div')),
			mainhand: this.items(modal.querySelector('#form-entity-modal-switcher-main-hand > div')),
			offhand: this.items(modal.querySelector('#form-entity-modal-switcher-off-hand > div')),
			chest: this.items(modal.querySelector('#form-entity-modal-switcher-chest > div')),
			legs: this.items(modal.querySelector('#form-entity-modal-switcher-legs > div')),
			feet: this.items(modal.querySelector('#form-entity-modal-switcher-feets > div')),
		};
		//eslint-disable-next-line max-len
		if (!isEmpty(equipementList.head) || !isEmpty(equipementList.mainhand) || !isEmpty(equipementList.offhand) || !isEmpty(equipementList.chest) || !isEmpty(equipementList.legs) || !isEmpty(equipementList.feet))
		{
			json.equipement = {};
			insert(json.equipement, 'head', equipementList.head);
			insert(json.equipement, 'mainhand', equipementList.mainhand);
			insert(json.equipement, 'offhand', equipementList.offhand);
			insert(json.equipement, 'chest', equipementList.chest);
			insert(json.equipement, 'legs', equipementList.legs);
			insert(json.equipement, 'feet', equipementList.feet);
		}
		return json;
	}

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

	static itemsList(modal)
	{
		const json = [];
		const itemsList = modal.querySelectorAll('#form-item-list-modal-list div.uk-modal-body');
		if (itemsList.length > 0)
			for (const item of itemsList)
			{
				const ret = this.items(item);
				if (Object.keys(ret).length)
					json.push(ret);
			}
		return json;
	}

	static location(modal)
	{
		const json = {};
		const biome = MCsearch.GetValue(modal.querySelector('#form-location-modal-biome'));
		if (biome)
			insert(json, 'biome', `minecraft:${biome}`);
		const dimensionSelected = modal.querySelector('#form-location-modal-dimension').value;
		if (dimensionSelected !== 'default')
			insert(json, 'dimension', dimensionSelected);
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

	static player(modal)
	{
		const json = {};
		const statList = modal.querySelectorAll('#form-player-modal-list div.state-form');
		insert(json, 'gamemode', modal.querySelector('#form-player-modal-gamemode').value);
		insert(json, 'level', getMinMax(modal.querySelector('#form-player-modal-level-min').value, modal.querySelector('#form-player-modal-level-max').value));
		if (statList.length)
		{
			json.stats = [];
			for (const stat of statList)
			{
				const ret = {};
				insert(ret, 'type', stat.querySelector('#player-form-type').value);
				insert(ret, 'stat', stat.querySelector('#state-form-stat').value);
				insert(ret, 'value', getMinMax(stat.querySelector('#player-form-value-min').value, stat.querySelector('#player-form-value-max').value));
				if (Object.keys(ret).length)
					json.stats.push(ret);
			}
		}
		return json;
	}

	static slot(modal)
	{
		const json = {};
		insert(json, 'empty', getMinMax(modal.querySelector('#form-slot-modal-empty-min').value, modal.querySelector('#form-slot-modal-empty-max').value));
		insert(json, 'full', getMinMax(modal.querySelector('#form-slot-modal-full-min').value, modal.querySelector('#form-slot-modal-full-max').value));
		insert(json, 'occupied', getMinMax(modal.querySelector('#form-slot-modal-occupied-min').value, modal.querySelector('#form-slot-modal-occupied-max').value));
		return json;
	}

	static state(modal)
	{
		const json = {};
		const stateList = modal.querySelectorAll('#form-state-modal-list > div');
		for (const state of stateList)
		{
			const jsonKey = state.querySelector('#state-form-name').value;
			const jsonValue = state.querySelector('#state-form-value').value;
			if (jsonKey && jsonValue)
				json[jsonKey] = String(jsonValue);
		}
		return json;
	}

	static type(modal)
	{
		const json = {};
		const checkboxList = modal.querySelectorAll(':scope > div input.uk-checkbox');
		insert(json, 'is_explosion', checkboxList[0].checked, Boolean);
		insert(json, 'is_fire', checkboxList[1].checked, Boolean);
		insert(json, 'is_magic', checkboxList[2].checked, Boolean);
		insert(json, 'is_projectile', checkboxList[3].checked, Boolean);
		insert(json, 'is_lightning', checkboxList[4].checked, Boolean);
		insert(json, 'bypasses_armor', checkboxList[5].checked, Boolean);
		insert(json, 'bypasses_invulnerability', checkboxList[6].checked, Boolean);
		insert(json, 'bypasses_magic', checkboxList[7].checked, Boolean);
		insert(json, 'direct_entity', this.entity(modal.querySelector('#form-type-modal-type-source-entity > div')));
		insert(json, 'source_entity', this.entity(modal.querySelector('#form-type-modal-type-direct-entity > div')));
		return json;
	}

	static victim(modal)
	{
		const json = [];
		const victimList = modal.querySelectorAll('#form-victim-modal-list div.uk-modal-body');
		for (const victim of victimList)
		{
			const newVictim = this.entity(victim);
			if (Object.keys(newVictim).length)
				json.push(newVictim);
		}
		return json;
	}
}

module.exports = GetForm;
