const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const __SEARCH = require('./__SEARCH');
const models = require('./__FORM_models');

const DefaultMinecraftVersion = '1.17';
const LANG = JSON.parse(fs.readFileSync(path.join(__dirname, '/lang/en_US.json')));

class Lang
{
	static update(DOMelement, args)
	{
		/*
		**	1. NodeList
		**	2. HTMLcollection
		*/
		if (this._ifDOMelementIsLive(DOMelement) !== true)
			throw new Error('DOMelement is static');
		if (typeof args !== 'object')
			throw new Error('args is not JSON object');
		if (HTMLCollection.prototype.isPrototypeOf(DOMelement)) // eslint-disable-line
		{
			for (let i = 0; i < DOMelement.length; i++)
				if (DOMelement[i].hasAttribute('lang'))
				{
					let value;
					try
					{
						value = DOMelement[i].getAttribute('lang').split('.').reduce((_args, _i) => _args[_i], args);
					}
					catch (err)
					{
						console.error(`${DOMelement[i].getAttribute('lang')} is not defined in lang file`);
						value = 'undefined';
					}
					if (DOMelement[i].lastChild && DOMelement[i].lastChild.nodeType === 3)
						DOMelement[i].lastChild.remove();
					DOMelement[i].appendChild(document.createTextNode(value));
				}
		}
		else
		{
			let list;
			if (!DOMelement.childNodes)
				list = DOMelement;
			else
				list = DOMelement.childNodes;
			this._iterateNodeList(list, args);
		}
	}

	static _ifDOMelementIsLive(DOMelement)
	{
		let list;
		if (HTMLCollection.prototype.isPrototypeOf(DOMelement)) // eslint-disable-line
			return (true);
		if (!DOMelement.childNodes)
			list = DOMelement;
		else
			list = DOMelement.childNodes;
		const { length } = list;
		if (!length)
			return (undefined);
		const element = list.item(0);
		const parent = element.parentNode;
		const clone = parent.cloneNode();
		clone.style.setProperty('display', 'none', 'important');
		parent.appendChild(clone);
		const live = list.length !== length;
		parent.removeChild(clone);
		return (live);
	}

	static _iterateNodeList(list, args)
	{
		for (const element of list)
		{
			if (element.nodeName !== '#text' && element.nodeType === 8)
				continue; // eslint-disable-line
			if (element.nodeName !== '#text' && element.hasAttribute('lang'))
			{
				let value;
				try
				{
					value = element.getAttribute('lang').split('.').reduce((_args, _i) => _args[_i], args);
				}
				catch (err)
				{
					console.error(`${element.getAttribute('lang')} is not defined in lang file`);
					value = 'undefined';
				}
				if (element.lastChild && element.lastChild.nodeType === 3)
					element.lastChild.remove();
				element.appendChild(document.createTextNode(value));
			}
			if (element.childNodes)
				this._iterateNodeList(element.childNodes, args);
		}
	}
}

const hexaID = () => crypto
	.randomBytes(Math.ceil(24 / 2))
	.toString('hex')
	.slice(0, 24);

/**
 * Get DOMelement form for trigger, return undefined if trigger not exist
 * @param {String} triggerName Name of the trigger
 * @param {String} MinecraftVersion The version of minecraft desired, by default at the highest version supported by Mapcraft
 */
exports.__FORM_TRIGGER = (triggerName, MinecraftVersion = DefaultMinecraftVersion) =>
{
	const formID = hexaID();
	let ListOfTriggers;
	try
	{
		ListOfTriggers = JSON.parse(fs.readFileSync(path.join(__dirname, `${MinecraftVersion}/triggers.json`), { encoding: 'utf-8', flag: 'r' }));
	}
	catch (err)
	{
		throw new Error('mapcraft-api/__FORM_TRIGGER', err);
	}
	for (const trigger of ListOfTriggers)
		if (trigger.id === triggerName)
		{
			const DOMelementForm = document.createElement('div');
			DOMelementForm.classList.add('uk-margin');
			DOMelementForm.id = `form-trigger-${formID}`;

			const DOMelementCard = document.createElement('div');
			DOMelementCard.classList.add('uk-card', 'uk-card-primary', 'uk-card-body', 'fieldset-card');
			DOMelementCard.innerText = trigger.description;
			DOMelementForm.appendChild(DOMelementCard);

			for (const input of trigger.form)
				if (typeof input.predefined !== 'undefined')
				{
					const newElement = document.createElement('div');
					const newElementLabel = document.createElement('label');
					newElementLabel.setAttribute('lang', input.lang);
					newElement.appendChild(newElementLabel);
					const newElementForm = document.createElement('div');
					switch (input.predefined)
					{
						case '__SEARCH_BLOCKS':
							__SEARCH.__SEARCH_BLOCKS(newElementForm);
							break;
						case '__SEARCH_ITEMS':
							__SEARCH.__SEARCH_ITEMS(newElementForm);
							break;
						case '__SEARCH_POTIONS':
							__SEARCH.__SEARCH_POTIONS(newElementForm);
							break;
						case '__SEARCH_TRIGGER':
							__SEARCH.__SEARCH_TRIGGER(newElementForm);
							break;
						default:
							console.log('err');
							//throw new Error('No predefined form');
					}
					newElement.appendChild(newElementForm);
					DOMelementForm.appendChild(newElement);
				}
				else
				{
					const newElement = document.createElement('div');
					newElement.classList.add('uk-margin');
					const label = document.createElement('label');
					label.classList.add('uk-form-label');
					label.setAttribute('lang', input.lang);
					newElement.appendChild(label);
					const formControl = document.createElement('div');
					formControl.classList.add('uk-form-controls');

					const formInput = document.createElement(input.tag);
					formInput.classList.add('uk-input');
					formInput.type = input.type;
					formControl.appendChild(formInput);

					newElement.appendChild(formControl);
					DOMelementForm.appendChild(newElement);
				}
			Lang.update(DOMelementForm, LANG);
			return (DOMelementForm);
		}
	return undefined;
};

exports.__FORM_ITEM = (ID = hexaID()) =>
{
	const DOMelement = document.createElement('div');
	DOMelement.innerHTML = models.itemModal(ID);
	__SEARCH.__SEARCH_ITEMS(DOMelement.querySelector('#form-item-modal-item'));
	__SEARCH.__SEARCH_POTIONS(DOMelement.querySelector('#form-item-modal-potion'));
	Lang.update(DOMelement, LANG);
	return DOMelement;
};
