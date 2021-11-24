/*eslint-disable no-param-reassign*/
const path = require('path');
const { Mapcraft, MCsearch, MCtemplate, MCutilities } = require('mapcraft-api');
const FORM = require('./form');

const ListOfEnchantements = MCutilities.GetDataGameElement('enchantements');
let LANG = MCutilities.GetLang(path.join(__dirname, '../'), Mapcraft.GetConfig().Env.Lang);
function UpdateLang()
{
	LANG = MCutilities.GetLang(path.join(__dirname, '../'), Mapcraft.GetConfig().Env.Lang);
}

const TEMPLATE = new MCtemplate(path.join(__dirname, '../'));
const FORM_TEMPLATE = new MCtemplate(__dirname);

const isEmpty = (json) => (!Object.keys(json).length);

/**
 * Set value in input
 * @param {Element} form Element where value is set
 * @param {JSON} json json data
 * @param {String} key key of data
 * @param {Boolean} isMCsearch set to true if data is MCsearch
 * @param {Boolen} keepNamespace set to true if you want to keep minecraft namespace
 */
const setValue = (form, json, key, isMCsearch = false, keepNamespace = false) =>
{
	if (form && Object.prototype.hasOwnProperty.call(json, key))
	{
		let value = json[key];
		if (/^minecraft:/.test(value) && !keepNamespace)
			value = value.slice(10);
		if (isMCsearch)
			MCsearch.SetValue(form, String(value));
		else
			switch (form.type)
			{
				case 'text':
					form.value = String(value);
					break;
				case 'checkbox':
					form.checked = Boolean(value);
					break;
				case 'Number':
				default:
					form.value = Number(value);
			}
	}
};

class Set
{
	static main(name, form, json)
	{
		UpdateLang();
		switch (name)
		{
			case '__FORM_DAMAGE':
				this.damage(form, json);
				break;
			case '__FORM_DISTANCE':
				this.distance(form, json);
				break;
			case '__FORM_DURABILITY':
				this.durability(form, json);
				break;
			case '__FORM_EFFECTS':
				this.effect(form, json);
				break;
			case '__FORM_ENTITIES':
				this.entity(form, json);
				break;
			case '__FORM_ITEMS':
				this.item(form, json);
				break;
			case '__FORM_ITEMS_LIST':
				this.itemList(form, json);
				break;
			case '__FORM_LOCATION':
				this.location(form, json);
				break;
			case '__FORM_PLAYER':
				this.player(form, json);
				break;
			case '__FORM_SLOT':
				this.slot(form, json);
				break;
			case '__FORM_STATE':
				this.state(form, json);
				break;
			case '__FORM_TYPE':
				this.type(form, json);
				break;
			case '__FORM_VICTIMS':
			default:
				this.victim(form, json);
				break;
		}
	}

	static damage(form, json)
	{
		setValue(form.querySelector('#form-damage-modal-blocked'), json, 'blocked');
		if (Object.prototype.hasOwnProperty.call(json, 'dealt'))
		{
			setValue(form.querySelector('#form-damage-modal-dealt-min'), json.dealt, 'min');
			setValue(form.querySelector('#form-damage-modal-dealt-max'), json.dealt, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'taken'))
		{
			setValue(form.querySelector('#form-damage-modal-taken-min'), json.taken, 'min');
			setValue(form.querySelector('#form-damage-modal-taken-max'), json.taken, 'max');
		}
	}

	static distance(form, json)
	{
		if (Object.prototype.hasOwnProperty.call(json, 'absolute'))
		{
			setValue(form.querySelector('#form-distance-modal-absolute-min'), json.absolute, 'min');
			setValue(form.querySelector('#form-distance-modal-absolute-max'), json.absolute, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'horizontal'))
		{
			setValue(form.querySelector('#form-distance-modal-horizontal-min'), json.horizontal, 'min');
			setValue(form.querySelector('#form-distance-modal-horizontal-max'), json.horizontal, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'x'))
		{
			setValue(form.querySelector('#form-distance-modal-x-min'), json.x, 'min');
			setValue(form.querySelector('#form-distance-modal-x-max'), json.x, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'y'))
		{
			setValue(form.querySelector('#form-distance-modal-y-min'), json.y, 'min');
			setValue(form.querySelector('#form-distance-modal-y-max'), json.y, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'z'))
		{
			setValue(form.querySelector('#form-distance-modal-z-min'), json.z, 'min');
			setValue(form.querySelector('#form-distance-modal-z-max'), json.z, 'max');
		}
	}

	static durability(form, json)
	{
		if (Object.prototype.hasOwnProperty.call(json, 'delta'))
		{
			setValue(form.querySelector('#form-durability-modal-delta-min'), json.delta, 'min');
			setValue(form.querySelector('#form-durability-modal-delta-max'), json.delta, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'durability'))
		{
			setValue(form.querySelector('#form-durability-modal-durability-min'), json.durability, 'min');
			setValue(form.querySelector('#form-durability-modal-durability-max'), json.durability, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'item'))
			this.item(form.querySelector('#form-durability-modal-item'), json.item);
	}

	static effect(form, json)
	{
		const EffectList = form.querySelector('#form-effects-modal-effect-list');
		for (const key in json)
			if (Object.prototype.hasOwnProperty.call(json, key))
			{
				const newEffect = document.createElement('div');
				FORM_TEMPLATE.render(newEffect, 'effectBlock.tp');
				newEffect.classList.add('edit-block', 'edit-block-criteria', 'uk-margin');
				newEffect.querySelector('#form-effects-block-close').addEventListener('click', () => newEffect.remove());
				MCsearch.effects(newEffect.querySelector('#form-effects-block-search'));
				MCsearch.SetValue(newEffect.querySelector('#form-effects-block-search'), key.slice(10));
				if (Object.prototype.hasOwnProperty.call(json[key], 'amplifier'))
					setValue(newEffect.querySelector('#form-effects-block-amplifier'), json[key].amplifier, 'min');
				if (Object.prototype.hasOwnProperty.call(json[key], 'duration'))
					setValue(newEffect.querySelector('#form-effects-block-duration'), json[key].duration, 'min');
				TEMPLATE.updateLang(newEffect, LANG.Data);
				EffectList.appendChild(newEffect);
			}
	}

	static entity(form, json)
	{
		const EffectList = form.querySelector('#form-entity-modal-effect-list');
		setValue(form.querySelector('#form-entity-modal-entity'), json, 'type', true);
		setValue(form.querySelector('#form-entity-modal-nbt'), json, 'nbt');
		if (Object.prototype.hasOwnProperty.call(json, 'flags'))
		{
			setValue(form.querySelector('#form-entity-modal-check-baby'), json.flags, 'is_baby');
			setValue(form.querySelector('#form-entity-modal-check-fire'), json.flags, 'is_on_fire');
			setValue(form.querySelector('#form-entity-modal-check-sneak'), json.flags, 'is_sneaking');
			setValue(form.querySelector('#form-entity-modal-check-sprint'), json.flags, 'is_sprinting');
			setValue(form.querySelector('#form-entity-modal-check-swim'), json.flags, 'is_swimming');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'effects'))
			for (const x in json.effects)
				if (Object.prototype.hasOwnProperty.call(json.effects, x))
				{
					const newEffect = document.createElement('div');
					FORM_TEMPLATE.render(newEffect, 'effectBlock.tp');
					newEffect.classList.add('edit-block', 'edit-block-criteria', 'uk-margin');
					newEffect.querySelector('#form-effects-block-close').addEventListener('click', () => newEffect.remove());
					MCsearch.effects(newEffect.querySelector('#form-effects-block-search'));
					MCsearch.SetValue(newEffect.querySelector('#form-effects-block-search'), x.slice(10));
					if (Object.prototype.hasOwnProperty.call(json.effects[x], 'duration'))
						setValue(newEffect.querySelector('#form-effects-block-duration'), json.effects[x].duration, 'min');
					if (Object.prototype.hasOwnProperty.call(json.effects[x], 'amplifier'))
						setValue(newEffect.querySelector('#form-effects-block-amplifier'), json.effects[x].amplifier, 'min');
					TEMPLATE.updateLang(newEffect, LANG.Data);
					EffectList.appendChild(newEffect);
				}
		if (Object.prototype.hasOwnProperty.call(json, 'distance'))
			this.distance(form.querySelector('#form-entity-modal-distance > div'), json.distance);
		if (Object.prototype.hasOwnProperty.call(json, 'location'))
			this.location(form.querySelector('#form-entity-modal-location > div'), json.location);
		if (Object.prototype.hasOwnProperty.call(json, 'equipement'))
		{
			if (Object.prototype.hasOwnProperty.call(json.equipement, 'head') && !isEmpty(json.equipement.head))
				this.item(form.querySelector('#form-entity-modal-switcher-head > div'), json.equipement.head);
			if (Object.prototype.hasOwnProperty.call(json.equipement, 'mainhand') && !isEmpty(json.equipement.mainhand))
				this.item(form.querySelector('#form-entity-modal-switcher-main-hand > div'), json.equipement.mainhand);
			if (Object.prototype.hasOwnProperty.call(json.equipement, 'offhand') && !isEmpty(json.equipement.offhand))
				this.item(form.querySelector('#form-entity-modal-switcher-off-hand > div'), json.equipement.offhand);
			if (Object.prototype.hasOwnProperty.call(json.equipement, 'chest') && !isEmpty(json.equipement.chest))
				this.item(form.querySelector('#form-entity-modal-switcher-chest > div'), json.equipement.chest);
			if (Object.prototype.hasOwnProperty.call(json.equipement, 'legs') && !isEmpty(json.equipement.legs))
				this.item(form.querySelector('#form-entity-modal-switcher-legs > div'), json.equipement.legs);
			if (Object.prototype.hasOwnProperty.call(json.equipement, 'feet') && !isEmpty(json.equipement.feet))
				this.item(form.querySelector('#form-entity-modal-switcher-feets > div'), json.equipement.feet);
		}
	}

	static item(form, json)
	{
		const addEnchantement = (baseString, enchantement) =>
		{
			const BLOCK = document.createElement('div');
			FORM_TEMPLATE.render(BLOCK, 'enchantementBlock.tp', { type: baseString });
			BLOCK.classList.add('edit-block', 'edit-block-criteria', 'uk-margin');
			const SearchID = MCsearch.enchantements(BLOCK.querySelector(`#form-item-modal-${baseString}-list-search`));
			const MinMax = {
				min: BLOCK.querySelector(`#form-item-modal-${baseString}-list-level-min`),
				max: BLOCK.querySelector(`#form-item-modal-${baseString}-list-level-max`),
			};
			BLOCK.querySelector(`#search-dropdown-${SearchID}`).addEventListener('input', (eventForm) =>
			{
				for (const element of ListOfEnchantements)
					if (element.id === eventForm.target.value)
					{
						MinMax.min.value = element.level[0]; // eslint-disable-line
						MinMax.min.setAttribute('min', element.level[0]);
						MinMax.min.setAttribute('max', element.level[1]);
						MinMax.max.value = element.level[0]; // eslint-disable-line
						MinMax.max.setAttribute('min', element.level[0]);
						MinMax.max.setAttribute('max', element.level[1]);
						break;
					}
			});
			MCsearch.SetValue(BLOCK.querySelector(`#search-dropdown-${SearchID}`), enchantement.enchantement.slice(10));
			BLOCK.querySelector(`#search-dropdown-${SearchID}`).dispatchEvent(new Event('input'));
			MinMax.min.value = enchantement.levels.min;
			MinMax.max.value = enchantement.levels.max;
			BLOCK.querySelector(`#form-item-modal-${baseString}-list-close`).addEventListener('click', () => BLOCK.remove());
			TEMPLATE.updateLang(BLOCK, LANG.Data);
			form.querySelector(`#form-item-modal-${baseString}-list`).appendChild(BLOCK);
		};
		setValue(form.querySelector('#form-item-modal-item'), json, 'item', true);
		setValue(form.querySelector('#form-item-modal-nbt'), json, 'nbt');
		setValue(form.querySelector('#form-item-modal-data'), json, 'data');
		setValue(form.querySelector('#form-item-modal-tag'), json, 'tag');
		if (Object.prototype.hasOwnProperty.call(json, 'count'))
		{
			setValue(form.querySelector('#form-item-modal-count-min'), json.count, 'min');
			setValue(form.querySelector('#form-item-modal-count-max'), json.count, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'durability'))
		{
			setValue(form.querySelector('#form-item-modal-durability-min'), json.durability, 'min');
			setValue(form.querySelector('#form-item-modal-durability-max'), json.durability, 'max');
		}
		setValue(form.querySelector('#form-item-modal-potion'), json, 'potion', true);
		if (Object.prototype.hasOwnProperty.call(json, 'enchantements'))
			for (const enchantement of json.enchantements)
				addEnchantement('enchantements', enchantement);
		if (Object.prototype.hasOwnProperty.call(json, 'stored_enchantments'))
			for (const enchantement of json.stored_enchantments)
				addEnchantement('stored-enchantements', enchantement);
	}

	static itemList(form, json)
	{
		const LIST = form.querySelector('#form-item-list-modal-list');
		for (const item of json)
		{
			const newItem = document.createElement('div');
			FORM_TEMPLATE.render(newItem, 'itemBlock.tp');
			const typeSourceEntity = FORM.item().querySelector('div.uk-modal-body');
			typeSourceEntity.classList.add('uk-margin');
			typeSourceEntity.querySelector('button.uk-modal-close-default').remove();
			newItem.querySelector('button.item-block-close').addEventListener('click', () => newItem.remove());
			newItem.querySelector('div.insert-form-close').appendChild(typeSourceEntity);
			this.item(typeSourceEntity, item);
			LIST.appendChild(newItem);
		}
	}

	static location(form, json)
	{
		setValue(form.querySelector('#form-location-modal-biome'), json, 'biome', true);
		setValue(form.querySelector('#form-location-modal-dimension'), json, 'dimension');
		setValue(form.querySelector('#form-location-modal-feature'), json, 'feature', true);
		setValue(form.querySelector('#form-location-modal-check-smokey'), json, 'smokey');
		if (Object.prototype.hasOwnProperty.call(json, 'block'))
		{
			setValue(form.querySelector('#form-location-modal-block-block'), json.block, 'block', true);
			setValue(form.querySelector('#form-location-modal-block-nbt'), json.block, 'nbt');
			setValue(form.querySelector('#form-location-modal-block-tag'), json.block, 'tag');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'fluid'))
		{
			setValue(form.querySelector('#form-location-modal-fluid-id'), json.fluid, 'id');
			setValue(form.querySelector('#form-location-modal-fluid-tag'), json.fluid, 'tag');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'position'))
		{
			if (Object.prototype.hasOwnProperty.call(json.position, 'x'))
			{
				setValue(form.querySelector('#form-location-modal-x-min'), json.position.x, 'min');
				setValue(form.querySelector('#form-location-modal-x-max'), json.position.x, 'max');
			}
			if (Object.prototype.hasOwnProperty.call(json.position, 'y'))
			{
				setValue(form.querySelector('#form-location-modal-y-min'), json.position.y, 'min');
				setValue(form.querySelector('#form-location-modal-y-max'), json.position.y, 'max');
			}
			if (Object.prototype.hasOwnProperty.call(json.position, 'z'))
			{
				setValue(form.querySelector('#form-location-modal-z-min'), json.position.z, 'min');
				setValue(form.querySelector('#form-location-modal-z-max'), json.position.z, 'max');
			}
		}
		if (Object.prototype.hasOwnProperty.call(json, 'light') && Object.prototype.hasOwnProperty.call(json.light, 'light'))
		{
			setValue(form.querySelector('#form-location-modal-light-min'), json.light.light, 'min');
			setValue(form.querySelector('#form-location-modal-light-max'), json.light.light, 'max');
		}
	}

	static player(form, json)
	{
		setValue(form.querySelector('#form-player-modal-gamemode'), json, 'gamemode');
		if (Object.prototype.hasOwnProperty.call(json, 'level'))
		{
			setValue(form.querySelector('#form-player-modal-level-min'), json.level, 'min');
			setValue(form.querySelector('#form-player-modal-level-max'), json.level, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'stats'))
		{
			const LIST = form.querySelector('#form-player-modal-list');
			for (const stat of json.stats)
			{
				const newState = document.createElement('div');
				FORM_TEMPLATE.render(newState, 'playerBlock.tp');
				newState.querySelector('button.state-block-close').addEventListener('click', () => newState.remove());
				setValue(newState.querySelector('#player-form-type'), stat, 'type', false, true);
				setValue(newState.querySelector('#state-form-stat'), stat, 'stat');
				if (Object.prototype.hasOwnProperty.call(stat, 'value'))
				{
					setValue(newState.querySelector('#player-form-value-min'), stat.value, 'min');
					setValue(newState.querySelector('#player-form-value-max'), stat.value, 'max');
				}
				TEMPLATE.updateLang(newState, LANG.Data);
				LIST.appendChild(newState);
			}
		}
	}

	static slot(form, json)
	{
		if (Object.prototype.hasOwnProperty.call(json, 'empty'))
		{
			setValue(form.querySelector('#form-slot-modal-empty-min'), json.empty, 'min');
			setValue(form.querySelector('#form-slot-modal-empty-max'), json.empty, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'full'))
		{
			setValue(form.querySelector('#form-slot-modal-full-min'), json.full, 'min');
			setValue(form.querySelector('#form-slot-modal-full-max'), json.full, 'max');
		}
		if (Object.prototype.hasOwnProperty.call(json, 'occupied'))
		{
			setValue(form.querySelector('#form-slot-modal-occupied-min'), json.occupied, 'min');
			setValue(form.querySelector('#form-slot-modal-occupied-max'), json.occupied, 'max');
		}
	}

	static state(form, json)
	{
		const LIST = form.querySelector('#form-state-modal-list');
		for (const key in json)
			if (Object.prototype.hasOwnProperty.call(json, key))
			{
				const newState = document.createElement('div');
				FORM_TEMPLATE.render(newState, 'stateBlock.tp');
				newState.querySelector('button.state-block-close').addEventListener('click', () => newState.remove());
				newState.querySelector('#state-form-name').value = key;
				newState.querySelector('#state-form-value').value = json[key];
				FORM_TEMPLATE.updateLang(newState, LANG.Data);
				LIST.appendChild(newState);
			}
	}

	static type(form, json)
	{
		setValue(form.querySelector('#form-type-modal-type-isExplosion'), json, 'is_explosion');
		setValue(form.querySelector('#form-type-modal-type-isFire'), json, 'is_fire');
		setValue(form.querySelector('#form-type-modal-type-isLightning'), json, 'is_lightning');
		setValue(form.querySelector('#form-type-modal-type-isMagic'), json, 'is_magic');
		setValue(form.querySelector('#form-type-modal-type-isProjectile'), json, 'is_projectile');
		setValue(form.querySelector('#form-type-modal-type-isArmor'), json, 'bypasses_armor');
		setValue(form.querySelector('#form-type-modal-type-isInvulnerability'), json, 'bypasses_invulnerability');
		setValue(form.querySelector('#form-type-modal-type-isMagic'), json, 'bypasses_magic');
		if (Object.prototype.hasOwnProperty.call(json, 'source_entity'))
			this.entity(form.querySelector('#form-type-modal-type-source-entity > div'), json.source_entity);
		if (Object.prototype.hasOwnProperty.call(json, 'direct_entity'))
			this.entity(form.querySelector('#form-type-modal-type-direct-entity > div'), json.direct_entity);
	}

	static victim(form, json)
	{
		const LIST = form.querySelector('#form-victim-modal-list');
		for (const victim of json)
		{
			const newVictim = document.createElement('div');
			FORM_TEMPLATE.render(newVictim, 'victimBlock.tp');
			const entityForm = FORM.entity().querySelector('div.uk-modal-body');
			entityForm.querySelector('button.uk-modal-close-default').remove();
			newVictim.querySelector('button.victim-block-close').addEventListener('click', () => newVictim.remove());
			newVictim.querySelector('div.insert-form-close').appendChild(entityForm);
			this.entity(entityForm, victim);
			TEMPLATE.updateLang(newVictim, LANG.Data);
			LIST.appendChild(newVictim);
		}
	}
}

module.exports = Set;
