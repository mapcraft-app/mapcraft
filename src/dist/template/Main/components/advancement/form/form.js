const path = require('path');
const crypto = require('crypto');
const { Mapcraft, MCutilities, MCtemplate, MCsearch } = require('mapcraft-api');
const MODELS = require('./form_models');

const LANG = MCutilities.GetLang(path.join(__dirname, '../'), Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(path.join(__dirname, '../'));
const DefaultMinecraftVersion = '1.17';
const PreGenerateList = {
	blocks: MCutilities.GetDataGameElement('blocks'),
	enchantements: MCutilities.GetDataGameElement('enchantements'),
	items: MCutilities.GetDataGameElement('items'),
	potions: MCutilities.GetDataGameElement('potions'),
	tags: MCutilities.GetDataGameElement('tags'),
	triggers: MCutilities.GetDataGameElement('triggers'),
};
const hexaID = () => crypto
	.randomBytes(Math.ceil(24 / 2))
	.toString('hex')
	.slice(0, 24);
let GenerateID = 1;

class Form
{
	/**
	 * @private
	 */
	static baseEnchantementList(DOMelement, baseString, minecraftVersion)
	{
		const ListOfEnchantements = (minecraftVersion !== DefaultMinecraftVersion) ? MCutilities.GetDataGameElement('enchantements', minecraftVersion) : PreGenerateList.enchantements;
		const EnchantmentsList = DOMelement.querySelector(`#form-item-modal-${baseString}-list`);
		DOMelement.querySelector(`#form-item-modal-add-${baseString}`).addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			const newEnchantement = document.createElement('div');
			newEnchantement.id = `form-item-modal-${baseString}-list-${GenerateID}`;
			newEnchantement.classList.add('edit-block', 'edit-block-criteria', 'uk-margin');
			newEnchantement.innerHTML = MODELS.enchantementBlock(GenerateID, baseString);
			const SearchID = MCsearch.ENCHANTEMENTS(newEnchantement.querySelector(`#form-item-modal-${baseString}-list-${GenerateID}-search`));
			const MinMax = {
				min: newEnchantement.querySelector(`#form-item-modal-${baseString}-list-${GenerateID}-level-min`),
				max: newEnchantement.querySelector(`#form-item-modal-${baseString}-list-${GenerateID}-level-max`),
			};
			newEnchantement.querySelector(`#search-dropdown-${SearchID}`).addEventListener('input', (eventForm) =>
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
			newEnchantement.querySelector(`#form-item-modal-${baseString}-list-${GenerateID}-close`).addEventListener('click', () => newEnchantement.remove());
			EnchantmentsList.appendChild(newEnchantement);
			TEMPLATE.updateLang(newEnchantement, LANG.Data);
			++GenerateID;
		});
	}

	/**
	 * Get element form for trigger, return undefined if trigger not exist
	 * @param {String} triggerName Name of the trigger
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 */
	static trigger(triggerName, minecraftVersion = DefaultMinecraftVersion)
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
					DOMlabel.setAttribute('lang', `Edit.Criteria.Form.${input.lang}`);
					DOMmain.appendChild(DOMlabel);
					if (typeof input.predefined !== 'undefined')
					{
						switch (input.predefined)
						{
							case '__SEARCH_BLOCKS':
								MCsearch.BLOCKS(DOMmain);
								break;
							case '__SEARCH_ITEMS':
								MCsearch.ITEMS(DOMmain);
								break;
							case '__SEARCH_POTIONS':
								MCsearch.POTIONS(DOMmain);
								break;
							case '__SEARCH_TRIGGERS':
								MCsearch.TRIGGER(DOMmain);
								break;
							case '__FORM_ITEMS':
								DOMmain.appendChild(this.item());
								break;
							case '__FORM_ENTITIES':
								DOMmain.appendChild(this.entity());
								break;
							default:
								throw new Error('No predefined form');
						}
						DOMmain.lastChild.classList.add('uk-form-controls');
					}
					else
					{
						const formControl = document.createElement('div');
						formControl.classList.add('uk-form-controls');
						const formInput = document.createElement(input.tag);
						formInput.classList.add('uk-input');
						formInput.type = input.type;
						formControl.appendChild(formInput);
						DOMmain.appendChild(formControl);
					}
					newForm.appendChild(DOMmain);
				}
				TEMPLATE.updateLang(newForm, LANG.Data);
				return (newForm);
			}
		return undefined;
	}

	/**
	 * Get Element form for item
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 * @returns {Element} HTMLDivElement form for modal item
	 */
	static item(minecraftVersion = DefaultMinecraftVersion)
	{
		const DOMelement = document.createElement('div');
		const ID = hexaID();
		DOMelement.id = ID;
		DOMelement.innerHTML = MODELS.itemModal(ID);
		MCsearch.ITEMS(DOMelement.querySelector('#form-item-modal-item'), minecraftVersion);
		MCsearch.POTIONS(DOMelement.querySelector('#form-item-modal-potion'), minecraftVersion);
		this.baseEnchantementList(DOMelement, 'enchantements', minecraftVersion);
		this.baseEnchantementList(DOMelement, 'stored-enchantements', minecraftVersion);
		TEMPLATE.updateLang(DOMelement, LANG.Data);
		return DOMelement;
	}

	/**
	 * Get Element form for entity
	 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
	 * @returns {Element} HTMLDivElement form for modal item
	 */
	static entity(minecraftVersion = DefaultMinecraftVersion)
	{
		const DOMelement = document.createElement('div');
		const ID = hexaID();
		DOMelement.id = ID;
		DOMelement.innerHTML = MODELS.entityModal(ID);
		MCsearch.ENTITIES(DOMelement.querySelector('#form-entity-modal-entity'), minecraftVersion);
		DOMelement.querySelector('#form-entity-modal-switcher-body').addEventListener('click', (event) =>
		{
			const List = DOMelement.querySelectorAll('div#form-entity-modal-switcher > div.body-tab');
			if (event.target.tagName === 'IMG')
			{
				const name = (event.target.classList[1]) ? event.target.classList[1] : event.target.classList[0];
				for (const node of List)
					if (node.id !== `form-entity-modal-switcher-${name}`)
						node.style.display = 'none';
					else
						node.style.display = 'block';
			}
		});
		TEMPLATE.updateLang(DOMelement, LANG.Data);
		return DOMelement;
	}
}

module.exports = Form;
