const path = require('path');
const crypto = require('crypto');
const { Mapcraft, MCutilities, MCtemplate, MCsearch } = require('mapcraft-api');

const LANG = MCutilities.GetLang(path.join(__dirname, '../'), Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(path.join(__dirname, '../'));
const FORM_TEMPLATE = new MCtemplate(__dirname);
const DefaultMinecraftVersion = '1.17';
const PreGenerateList = {
	blocks: MCutilities.GetDataGameElement('blocks'),
	effects: MCutilities.GetDataGameElement('effects'),
	enchantements: MCutilities.GetDataGameElement('enchantements'),
	entities: MCutilities.GetDataGameElement('entities'),
	items: MCutilities.GetDataGameElement('items'),
	potions: MCutilities.GetDataGameElement('potions'),
	tags: MCutilities.GetDataGameElement('tags'),
	triggers: MCutilities.GetDataGameElement('triggers'),
};
const hexaID = () => crypto
	.randomBytes(Math.ceil(24 / 2))
	.toString('hex')
	.slice(0, 24);

class Form
{
	/**
	 * Get element form for trigger, return undefined if trigger not exist
	 * @param {String} triggerName Name of the trigger
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 */
	static printTrigger(triggerName, minecraftVersion = DefaultMinecraftVersion)
	{
		const formID = hexaID();
		const ListOfTriggers = (minecraftVersion !== DefaultMinecraftVersion) ? MCutilities.GetDataGameElement('triggers', minecraftVersion) : PreGenerateList.triggers;
		for (const trigger of ListOfTriggers)
			if (trigger.id === triggerName)
			{
				const newForm = document.createElement('div');
				newForm.classList.add('uk-margin');
				newForm.id = `form-trigger-${formID}`;
				const DOMelementCard = document.createElement('div');
				DOMelementCard.classList.add('uk-card', 'uk-card-primary', 'uk-card-body', 'fieldset-card');
				DOMelementCard.innerText = trigger.description;
				newForm.appendChild(DOMelementCard);
				if (typeof trigger.form === 'undefined')
					throw new Error('Form key is not defined');
				for (const input of trigger.form)
				{
					const DOMmain = document.createElement('div');
					DOMmain.classList.add('uk-margin');
					const DOMlabel = document.createElement('label');
					DOMlabel.classList.add('uk-form-label');
					DOMlabel.setAttribute('lang', input.lang);
					DOMmain.appendChild(DOMlabel);
					if (typeof input.predefined !== 'undefined')
					{
						switch (input.predefined)
						{
							case '__SEARCH_BIOMES':
								MCsearch.biomes(DOMmain);
								break;
							case '__SEARCH_BLOCKS':
								MCsearch.blocks(DOMmain);
								break;
							case '__SEARCH_EFFECTS':
								MCsearch.effects(DOMmain);
								break;
							case '__SEARCH_ENCHANTEMENTS':
								MCsearch.enchantements(DOMmain);
								break;
							case '__SEARCH_ENTITIES':
								MCsearch.entities(DOMmain);
								break;
							case '__SEARCH_ITEMS':
								MCsearch.items(DOMmain);
								break;
							case '__SEARCH_POTIONS':
								MCsearch.potions(DOMmain);
								break;
							case '__SEARCH_STRUCTURES':
								MCsearch.structures(DOMmain);
								break;
							case '__SEARCH_TRIGGERS':
								MCsearch.triggers(DOMmain);
								break;

							case '__FORM_DAMAGE':
								DOMmain.appendChild(this.damage(minecraftVersion));
								break;
							case '__FORM_DISTANCE':
								DOMmain.appendChild(this.distance());
								break;
							case '__FORM_EFFECTS':
								DOMmain.appendChild(this.effect(minecraftVersion));
								break;
							case '__FORM_ENTITIES':
								DOMmain.appendChild(this.entity(minecraftVersion));
								break;
							case '__FORM_ITEMS':
								DOMmain.appendChild(this.item(minecraftVersion));
								break;
							case '__FORM_LOCATION':
								DOMmain.appendChild(this.location(minecraftVersion));
								break;
							case '__FORM_STATE':
								DOMmain.appendChild(this.state(minecraftVersion));
								break;
							case '__FORM_TYPE':
								DOMmain.appendChild(this.type(minecraftVersion));
								break;
							case '__FORM_VICTIMS':
								DOMmain.appendChild(this.victim(minecraftVersion));
								break;
							default:
								throw new Error('No predefined form');
						}
						DOMmain.lastChild.classList.add('uk-form-controls');
					}
					else if (typeof input.element !== 'undefined')
					{
						const formControl = document.createElement('div');
						formControl.classList.add('uk-form-controls');
						const formInput = document.createElement(input.element.tag);
						const addChild = (childs) =>
						{
							for (const child of childs)
							{
								if (child.lang)
								{
									const newChildLabel = document.createElement('label');
									newChildLabel.classList.add('uk-form-label');
									newChildLabel.setAttribute('lang', child.lang);
									formInput.appendChild(newChildLabel);
								}
								const newChild = document.createElement(child.tag);
								for (const key in child)
									if (Object.prototype.hasOwnProperty.call(child, key))
										if (key === 'childs')
											addChild(child[key]);
										else
											newChild.setAttribute(key, child[key]);
								formInput.appendChild(newChild);
							}
						};
						for (const el in input.element)
							if (Object.prototype.hasOwnProperty.call(input.element, el))
								if (el === 'childs')
									addChild(input.element[el]);
								else
									formInput.setAttribute(el, input.element[el]);
						formControl.appendChild(formInput);
						DOMmain.appendChild(formControl);
					}
					else
					{
						throw new Error('nothing is defined');
					}
					newForm.appendChild(DOMmain);
				}
				TEMPLATE.updateLang(newForm, LANG.Data);
				return (newForm);
			}
		return undefined;
	}

	/**
	 * Get Element form for damage
	 * @returns {Element} HTMLDivElement form for modal damage
	 */
	static damage(minecraftVersion = DefaultMinecraftVersion)
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'damageModal.tp', { ID: hexaID() });
		//Main entity
		const mainEntity = this.entity(minecraftVersion).querySelector('div.uk-modal-body');
		mainEntity.removeAttribute('class');
		mainEntity.querySelector('button.uk-modal-close-default').remove();
		MODAL.querySelector('#form-damage-modal-entity').appendChild(mainEntity);
		//Type
		const typeEntity = this.type(minecraftVersion).querySelector('div.uk-modal-body');
		typeEntity.removeAttribute('class');
		typeEntity.querySelector('button.uk-modal-close-default').remove();
		MODAL.querySelector('#form-damage-modal-type').appendChild(typeEntity);
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * Get Element form for distance
	 * @returns {Element} HTMLDivElement form for modal distance
	 */
	static distance()
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'distanceModal.tp', { ID: hexaID() });
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * Get Element form for effect
	 * @returns {Element} HTMLDivElement form for modal effect
	 */
	static effect(minecraftVersion = DefaultMinecraftVersion)
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'effectModal.tp', { ID: hexaID() });
		const Node = {
			Button: MODAL.querySelector('#form-effects-modal-add-effect'),
			List: MODAL.querySelector('#form-effects-modal-effect-list'),
		};
		Node.Button.addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const newEffect = document.createElement('div');
			FORM_TEMPLATE.render(newEffect, 'effectBlock.tp');
			newEffect.classList.add('edit-block', 'edit-block-criteria', 'uk-margin');
			newEffect.querySelector('#form-effects-block-close').addEventListener('click', () => newEffect.remove());
			MCsearch.blocks(newEffect.querySelector('#form-effects-block-search'), minecraftVersion);
			TEMPLATE.updateLang(newEffect, LANG.Data);
			Node.List.appendChild(newEffect);
		});
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * Get Element form for entity
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 * @returns {Element} HTMLDivElement form for modal entity
	 */
	static entity(minecraftVersion = DefaultMinecraftVersion)
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'entityModal.tp', { ID: hexaID() });
		MCsearch.entities(MODAL.querySelector('#form-entity-modal-entity'), minecraftVersion);
		const LIST = MODAL.querySelectorAll('div#form-entity-modal-switcher > div.body-tab');
		for (const node of LIST)
		{
			const itemForm = this.item(minecraftVersion).querySelector('div.uk-modal-body');
			itemForm.removeAttribute('class');
			node.appendChild(itemForm);
		}
		MODAL.querySelector('#form-entity-modal-switcher-body').addEventListener('click', (event) =>
		{
			if (event.target.tagName === 'IMG')
			{
				const name = (event.target.classList[1]) ? event.target.classList[1] : event.target.classList[0];
				for (const node of LIST)
					if (node.id !== `form-entity-modal-switcher-${name}`)
						node.style.display = 'none';
					else
						node.style.display = 'block';
			}
		});
		//Effects
		const EffectList = MODAL.querySelector('#form-entity-modal-effect-list');
		MODAL.querySelector('#form-entity-modal-effect-add').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const newEffect = document.createElement('div');
			FORM_TEMPLATE.render(newEffect, 'effectBlock.tp');
			newEffect.classList.add('edit-block', 'edit-block-criteria', 'uk-margin');
			newEffect.querySelector('#form-effects-block-close').addEventListener('click', () => newEffect.remove());
			MCsearch.effects(newEffect.querySelector('#form-effects-block-search'), minecraftVersion);
			TEMPLATE.updateLang(newEffect, LANG.Data);
			EffectList.appendChild(newEffect);
		});
		//Distance
		const distanceForm = this.distance().querySelector('div.uk-modal-body');
		distanceForm.removeAttribute('class');
		distanceForm.querySelector('button.uk-modal-close-default').remove();
		MODAL.querySelector('#form-entity-modal-distance').appendChild(distanceForm);
		//Location
		const locationForm = this.location().querySelector('div.uk-modal-body');
		locationForm.removeAttribute('class');
		locationForm.querySelector('button.uk-modal-close-default').remove();
		locationForm.querySelector('ul').removeAttribute('class');
		MODAL.querySelector('#form-entity-modal-location').appendChild(locationForm);
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * @private
	 */
	static baseEnchantementList(DOMelement, baseString, minecraftVersion)
	{
		const ListOfEnchantements = (minecraftVersion !== DefaultMinecraftVersion) ? MCutilities.GetDataGameElement('enchantements', minecraftVersion) : PreGenerateList.enchantements;
		DOMelement.querySelector(`#form-item-modal-add-${baseString}`).addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
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
			BLOCK.querySelector(`#form-item-modal-${baseString}-list-close`).addEventListener('click', () => BLOCK.remove());
			TEMPLATE.updateLang(BLOCK, LANG.Data);
			DOMelement.querySelector(`#form-item-modal-${baseString}-list`).appendChild(BLOCK);
		});
	}

	/**
	 * Get Element form for item
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 * @returns {Element} HTMLDivElement form for modal item
	 */
	static item(minecraftVersion = DefaultMinecraftVersion)
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'itemModal.tp', { ID: hexaID() });
		MCsearch.items(MODAL.querySelector('#form-item-modal-item'), minecraftVersion);
		MCsearch.potions(MODAL.querySelector('#form-item-modal-potion'), minecraftVersion);
		this.baseEnchantementList(MODAL, 'enchantements', minecraftVersion);
		this.baseEnchantementList(MODAL, 'stored-enchantements', minecraftVersion);
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * Get Element form for location
	 * @returns {Element} HTMLDivElement form for modal location
	 */
	static location(minecraftVersion = DefaultMinecraftVersion)
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'locationModal.tp', { ID: hexaID() });
		MCsearch.biomes(MODAL.querySelector('#form-location-modal-biome'), minecraftVersion);
		MCsearch.structures(MODAL.querySelector('#form-location-modal-feature'), minecraftVersion);
		MCsearch.blocks(MODAL.querySelector('#form-location-modal-block-block'), minecraftVersion);
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * Get Element form for block state
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 * @returns {Element} HTMLDivElement form for modal block state
	 */
	static state()
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'stateModal.tp', { ID: hexaID() });
		MODAL.querySelector('#form-state-modal-add').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const newState = document.createElement('div');
			FORM_TEMPLATE.render(newState, 'stateBlock.tp');
			newState.querySelector('button.state-block-close').addEventListener('click', () => newState.remove());
			TEMPLATE.updateLang(newState, LANG.Data);
			MODAL.querySelector('#form-state-modal-list').appendChild(newState);
		});
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * Get Element form for type
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 * @returns {Element} HTMLDivElement form for modal type
	 */
	static type(minecraftVersion = DefaultMinecraftVersion)
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'damageModal.tp', { ID: hexaID() });
		//Type source entity
		const typeSourceEntity = this.entity(minecraftVersion).querySelector('div.uk-modal-body');
		typeSourceEntity.removeAttribute('class');
		typeSourceEntity.querySelector('button.uk-modal-close-default').remove();
		MODAL.querySelector('#form-type-modal-type-source-entity').appendChild(typeSourceEntity);
		//Type direct entity
		const typeDirectEntity = this.entity(minecraftVersion).querySelector('div.uk-modal-body');
		typeDirectEntity.removeAttribute('class');
		typeDirectEntity.querySelector('button.uk-modal-close-default').remove();
		MODAL.querySelector('#form-type-modal-type-source-entity').appendChild(typeDirectEntity);
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}

	/**
	 * Get Element form for victims
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 * @returns {Element} HTMLDivElement form for modal victim
	 */
	static victim(minecraftVersion = DefaultMinecraftVersion)
	{
		const MODAL = document.createElement('div');
		FORM_TEMPLATE.render(MODAL, 'victimModal.tp', { ID: hexaID() });
		MODAL.querySelector('#form-victim-modal-add').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const newVictim = document.createElement('div');
			FORM_TEMPLATE.render(newVictim, 'victimBlock.tp');
			const entityForm = this.entity(minecraftVersion).querySelector('div.uk-modal-body');
			entityForm.querySelector('button.uk-modal-close-default').remove();
			newVictim.querySelector('button.victim-block-close').addEventListener('click', () => newVictim.remove());
			newVictim.querySelector('div.insert-form-close').appendChild(entityForm);
			TEMPLATE.updateLang(newVictim, LANG.Data);
			MODAL.querySelector('#form-victim-modal-list').appendChild(newVictim);
		});
		TEMPLATE.updateLang(MODAL, LANG.Data);
		return MODAL;
	}
}

module.exports = Form;
