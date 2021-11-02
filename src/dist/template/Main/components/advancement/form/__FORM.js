const path = require('path');
const crypto = require('crypto');
const { Mapcraft, MCutilities, MCtemplate, MCsearch } = require('mapcraft-api');
const models = require('./__FORM_models');

const LANG = MCutilities.GetLang(path.join(__dirname, '../'), Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(path.join(__dirname, '../'));
const DefaultMinecraftVersion = '1.17';
const PreGenerateList = {
	blocks: MCutilities.GetDataGameElement('blocks'),
	items: MCutilities.GetDataGameElement('items'),
	potions: MCutilities.GetDataGameElement('potions'),
	tags: MCutilities.GetDataGameElement('tags'),
	triggers: MCutilities.GetDataGameElement('triggers'),
};
const hexaID = () => crypto
	.randomBytes(Math.ceil(24 / 2))
	.toString('hex')
	.slice(0, 24);

/**
 * Get DOMelement form for trigger, return undefined if trigger not exist
 * @param {String} triggerName Name of the trigger
 * @param {String} minecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
 */
exports.__FORM_TRIGGER = (triggerName, minecraftVersion = DefaultMinecraftVersion) =>
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
							DOMmain.appendChild(this.__FORM_ITEM());
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
};

exports.__FORM_ITEM = () =>
{
	const DOMelement = document.createElement('div');
	const ID = hexaID();
	DOMelement.id = ID;
	DOMelement.innerHTML = models.itemModal(ID);
	MCsearch.ITEMS(DOMelement.querySelector('#form-item-modal-item'));
	MCsearch.POTIONS(DOMelement.querySelector('#form-item-modal-potion'));
	TEMPLATE.updateLang(DOMelement, LANG.Data);
	return DOMelement;
};
