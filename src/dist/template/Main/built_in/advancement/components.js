const { shell } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { Mapcraft, MCutilities, MCtemplate, MCsearch, MCworkInProgress } = require('mapcraft-api');

const Form = require('./form/form');
const GetForm = require('./form/get');
const SetForm = require('./form/set');

const randomString = () => crypto.randomBytes(8).toString('hex');
let LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
function UpdateLang()
{
	LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
}
const TEMPLATE = new MCtemplate(__dirname);
let ADVANCEMENT = {};
let CurrentID;
localStorage.setItem('Advancement_Select', '');

// Add directory to datapack if not exist
const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const RecipesDirectory = path.join(LocalMapcraft.Data.DataPack, 'data', 'mapcraft-data', 'advancements');
const DataDirectory = path.join(RecipesDirectory, 'data');
if (!fs.existsSync(RecipesDirectory))
	fs.mkdirSync(RecipesDirectory, { recursive: true });
if (!fs.existsSync(DataDirectory))
	fs.mkdirSync(DataDirectory, { recursive: true });

const TRIGGERFORM = MCutilities.getDataGameElement('triggers', Mapcraft.config.Minecraft.SelectedVersion);
const GetTriggerForm = (id) =>
{
	for (const trigger of TRIGGERFORM)
		if (trigger.id === id)
			return trigger.form;
	return undefined;
};

const newChild = (ranID = randomString()) => ({
	id: ranID,
	json: {
		display: {
			icon: { item: 'minecraft:stone' },
			title: { text: 'Advancement' },
			description: { text: 'Description' },
		},
	},
	childs: [],
});

const BaseModel = (ranID = randomString()) => ({
	id: `advancement_${ranID}`,
	name: 'New advancement',
	namespace: 'mapcraft-data',
	background: 'minecraft:textures/gui/advancements/backgrounds/stone.png',
	data: newChild(ranID),
});

function OpenExternLink()
{
	document.querySelectorAll('a[web-link]').forEach((link) =>
	{
		const url = link.getAttribute('href');
		if (url.indexOf('http') === 0)
			link.addEventListener('click', (event) =>
			{
				event.preventDefault();
				event.stopImmediatePropagation();
				shell.openExternal(url);
			});
	});
}

function getSrcImage(item)
{
	const testBlockPath = path.join(__dirname, '../../../../img/assets/block', item);
	const testItemPath = path.join(__dirname, '../../../../img/assets/item', item);
	if (fs.existsSync(`${testBlockPath}.png`))
		return { src: `./dist/img/assets/block/${item}.png`, class: 'item-img' };
	if (fs.existsSync(`${testBlockPath}.webp`))
		return { src: `./dist/img/assets/block/${item}.webp`, class: 'item-img' };
	if (fs.existsSync(`${testItemPath}.png`))
		return { src: `./dist/img/assets/item/${item}.png`, class: 'item-img' };
	if (fs.existsSync(`${testItemPath}.webp`))
		return { src: `./dist/img/assets/item/${item}.webp`, class: 'item-img' };
	return { src: './dist/img/assets/no_data.png', class: 'item-img' };
}

class SetJson
{
	static cleanForm()
	{
		const FORM = document.getElementById('edition-zone');
		const FORMinput = FORM.getElementsByTagName('input');
		const FORMselect = FORM.getElementsByTagName('select');
		for (const input of FORMinput)
			switch (input.type.toLowerCase())
			{
				case 'number':
					input.value = Number(0);
					break;
				case 'checkbox':
					input.checked = Boolean(false);
					break;
				case 'text':
				case 'color':
				default:
					input.value = String('');
			}
		for (const select of FORMselect)
			select.selectedIndex = 0;
		TEMPLATE.cleanNode(document.getElementById('edit-criteria-list'));
		TEMPLATE.cleanNode(document.getElementById('edit-requirements-list'));
		TEMPLATE.cleanNode(document.getElementById('edit-rewards-recipes-list'));
		TEMPLATE.cleanNode(document.getElementById('edit-rewards-loottables-list'));
	}

	static set(advancement)
	{
		MCworkInProgress.open();
		SetJson.cleanForm();
		const LIST = document.querySelectorAll('ul[id="edition-zone-template"] > li');
		for (const ListItem of LIST)
			switch (ListItem.querySelector('div.uk-accordion-content').id)
			{
				case 'edit-root':
					if (advancement.display)
						this.setRoot(ListItem.querySelector('div.uk-accordion-content'), ADVANCEMENT);
					break;
				case 'edit-display':
					if (advancement.display)
						this.setDisplay(ListItem.querySelector('div.uk-accordion-content'), advancement.display);
					break;
				case 'edit-criteria':
					if (advancement.criteria)
						this.setCriteria(ListItem.querySelector('div.uk-accordion-content'), advancement.criteria);
					break;
				case 'edit-requirements':
					if (advancement.criteria && advancement.requirements)
						this.setRequirements(ListItem.querySelector('div.uk-accordion-content'), advancement);
					break;
				case 'edit-rewards':
				default:
					if (advancement.rewards)
						this.setRewards(ListItem.querySelector('div.uk-accordion-content'), advancement.rewards);
					break;
			}
		MCworkInProgress.close();
	}

	static input(input, value)
	{
		if (!input || !value)
			return;
		if (input.tagName === 'SELECT')
			input.querySelectorAll('option').forEach((el) =>
			{
				if (el.value === value)
					el.selected = true; //eslint-disable-line
				else
					el.selected = false; //eslint-disable-line
			});
		else
			switch (input.type.toLowerCase())
			{
				case 'number':
					input.value = Number(value); //eslint-disable-line
					break;
				case 'checkbox':
					input.checked = Boolean(value); //eslint-disable-line
					break;
				case 'text':
				case 'color':
				default:
					input.value = String(value); //eslint-disable-line
					break;
			}
	}

	static setRoot(ListItem, advancement)
	{
		this.input(ListItem.querySelector('#edit-root-namespace'), advancement.namespace);
		this.input(ListItem.querySelector('#edit-root-background'), advancement.background);
	}

	static setDisplay(ListItem, advancement)
	{
		this.input(ListItem.querySelector('#edit-display-title-text'), advancement.title.text);
		this.input(ListItem.querySelector('#edit-display-title-color'), advancement.title.color);
		this.input(ListItem.querySelector('#edit-display-title-bold'), advancement.title.bold);
		this.input(ListItem.querySelector('#edit-display-title-italic'), advancement.title.italic);
		this.input(ListItem.querySelector('#edit-display-title-underlined'), advancement.title.underlined);
		this.input(ListItem.querySelector('#edit-display-title-strikethrough'), advancement.title.strikethrough);
		this.input(ListItem.querySelector('#edit-display-title-obfuscated'), advancement.title.obfuscated);
		this.input(ListItem.querySelector('#edit-display-description-text'), advancement.description.text);
		this.input(ListItem.querySelector('#edit-display-description-color'), advancement.description.color);
		this.input(ListItem.querySelector('#edit-display-description-bold'), advancement.description.bold);
		this.input(ListItem.querySelector('#edit-display-description-italic'), advancement.description.italic);
		this.input(ListItem.querySelector('#edit-display-description-underlined'), advancement.description.underlined);
		this.input(ListItem.querySelector('#edit-display-description-strikethrough'), advancement.description.strikethrough);
		this.input(ListItem.querySelector('#edit-display-description-obfuscated'), advancement.description.obfuscated);
		if (advancement.icon.item)
		{
			MCsearch.setValue(ListItem.querySelector('#edit-display-icon'), advancement.icon.item.slice(10));
			ListItem.querySelector('#edit-display-icon input').dispatchEvent(new Event('input'));
		}
		this.input(ListItem.querySelector('#edit-display-frame'), advancement.frame);
		this.input(ListItem.querySelector('#edit-display-nbt'), advancement.icon.nbt);
		this.input(ListItem.querySelector('#edit-display-check-toast'), advancement.show_toast);
		this.input(ListItem.querySelector('#edit-display-check-chat'), advancement.announce_to_chat);
		this.input(ListItem.querySelector('#edit-display-check-hidden'), advancement.hidden);
	}

	static setCriteria(ListItem, advancement)
	{
		let GenerateID = 0;
		const DataTrigger = MCutilities.getDataGameElement('triggers');
		const newDOM = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
		const newDOMbody = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
		newDOM.documentElement.appendChild(newDOMbody);
		const newList = newDOMbody;
		for (const x in advancement)
			if (Object.prototype.hasOwnProperty.call(advancement, x))
				setTimeout(() =>
				{
					const ID = Component.newTrigger(GenerateID, x, newList, false); // eslint-disable-line no-use-before-define
					MCsearch.setValue(newList.querySelector(`div[id="${ID}"] div.search-dropdown-input`), advancement[x].trigger.slice(10));
					newList.querySelector(`div[id="${ID}"] div.search-dropdown-input input`).dispatchEvent(new Event('input'));
					const CriteriaForm = newList.querySelector(`#edit-criteria-form-${GenerateID++}`);
					const FORM = Form.printTrigger(advancement[x].trigger.slice(10));
					if (FORM)
					{
						TEMPLATE.cleanNode(CriteriaForm);
						CriteriaForm.appendChild(FORM);
						OpenExternLink();
						const TRIGGER = DataTrigger.find((element) =>
						// eslint-disable-next-line arrow-body-style
						{
							return element.id === advancement[x].trigger.slice(10);
						});
						for (const form of TRIGGER.form)
							if (Object.prototype.hasOwnProperty.call(form, 'predefined'))
							{
								if (/^__SEARCH/.test(form.predefined))
								{
									const SearchInput = CriteriaForm.querySelector(`label[lang="${form.lang}"]`);
									MCsearch.setValue(SearchInput.nextSibling, advancement[x].conditions[form.key].slice(10));
								}
								else if (/^__FORM/.test(form.predefined))
								{
									const MODAL = CriteriaForm.querySelector(`label.uk-form-label[lang="${form.lang}"]`).nextSibling.querySelector('div.uk-modal-body');
									let data;
									if (Array.isArray(form.key))
										for (let y = 0; y < form.key.length; y++)
											if (y === 0)
												data = advancement[x].conditions[form.key[y]];
											else
												data = data[form.key[y]];
									else
										data = advancement[x].conditions[form.key];
									SetForm.main(form.predefined, MODAL, data);
								}
							}
							else
							{
								const searchChilds = (searchInput, criteriaData, childs) =>
								{
									for (const child of childs)
									{
										const search = searchInput.querySelector(`${child.tag}[id="${child.id}"]`);
										if (criteriaData[child.id])
											this.input(search, criteriaData[child.id]);
										else if (Object.prototype.hasOwnProperty.call(child, 'childs'))
											searchChilds(search, criteriaData[child.id], child);
									}
								};
								const SearchInput = CriteriaForm.querySelector(`${form.element.tag}[id="${form.element.id}"]`);
								if (form.element.tag === 'select')
									this.input(SearchInput, advancement[x].conditions[form.element.id]);
								else if (Object.prototype.hasOwnProperty.call(form.element, 'childs'))
									searchChilds(SearchInput, advancement[x].conditions[form.element.id], form.element.childs);
								else
									this.input(SearchInput, advancement[x].conditions[form.element.id]);
							}
					}
					else
					{
						TEMPLATE.cleanNode(CriteriaForm);
					}
					ListItem.querySelector('#edit-criteria-list').appendChild(newList.querySelector(`div[id="${ID}"]`));
				}, 0);
	}

	static setRequirements(ListItem, advancement)
	{
		const generate = (criteriaArray, selectedArray) =>
		{
			const newCheckbox = (value) =>
			{
				const labelCheck = document.createElement('label');
				const inputCheck = document.createElement('input');
				const spanCheck = document.createElement('span');
				inputCheck.classList.add('uk-checkbox', 'uk-margin-right');
				inputCheck.setAttribute('type', 'checkbox');
				inputCheck.setAttribute('value', String(value));
				inputCheck.setAttribute('defaultId', String(value));
				spanCheck.innerText = String(value);
				labelCheck.appendChild(inputCheck);
				labelCheck.appendChild(spanCheck);
				if (selectedArray.indexOf(value) !== -1)
					inputCheck.checked = true;
				return labelCheck;
			};
			const checkList = document.createElement('div');
			checkList.classList.add('uk-flex', 'uk-flex-around', 'uk-flex-middle', 'uk-flex-wrap');
			checkList.setAttribute('id', 'edit-requirement-list');
			for (const criteria of criteriaArray)
				checkList.appendChild(newCheckbox(criteria));
			return checkList;
		};

		const criteriaList = [];
		for (const criteria in advancement.criteria)
			if (Object.prototype.hasOwnProperty.call(advancement.criteria, criteria))
				criteriaList.push(String(criteria));

		for (const requirement of advancement.requirements)
		{
			const MODEL = document.createElement('div');
			TEMPLATE.render(MODEL, 'requirement.tp');
			MODEL.removeAttribute('tp');
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-requirement-checkbox').replaceWith(generate(criteriaList, requirement));
			MODEL.querySelector('#edit-requirement-close').addEventListener('click', () => MODEL.remove());
			TEMPLATE.updateLang(MODEL, LANG.Data);
			ListItem.querySelector('#edit-requirements-list').appendChild(MODEL);
		}
	}

	static setRewards(ListItem, advancement)
	{
		const List = {
			recipes: ListItem.querySelector('#edit-rewards-recipes-list'),
			loot: ListItem.querySelector('#edit-rewards-loottables-list'),
		};
		TEMPLATE.cleanNode(List.recipes);
		TEMPLATE.cleanNode(List.loot);
		for (const recipe of advancement.recipes)
		{
			const MODEL = document.createElement('div');
			TEMPLATE.render(MODEL, 'reward_loot.tp');
			MODEL.removeAttribute('tp');
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-reward-loot').value = recipe;
			MODEL.querySelector('#edit-reward-loot-close').addEventListener('click', () => MODEL.remove());
			TEMPLATE.updateLang(MODEL, LANG.Data);
			List.recipes.appendChild(MODEL);
		}
		for (const loot of advancement.loot)
		{
			const MODEL = document.createElement('div');
			TEMPLATE.render(MODEL, 'reward_loot.tp');
			MODEL.removeAttribute('tp');
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-reward-loot').value = loot;
			MODEL.querySelector('#edit-reward-loot-close').addEventListener('click', () => MODEL.remove());
			TEMPLATE.updateLang(MODEL, LANG.Data);
			List.loot.appendChild(MODEL);
		}
		this.input(ListItem.querySelector('#edit-rewards-experience'), advancement.experience);
		this.input(ListItem.querySelector('#edit-rewards-function'), advancement.function);
	}
}

class Json
{
	constructor()
	{
		this.isError = false;
		this.errors = [];
		this.json = {
			display: {
				icon: {
					item: String('minecraft:dirt'),
					nbt: String(''),
				},
				announce_to_chat: Boolean(false),
				frame: String('task'),
				hidden: Boolean(false),
				show_toast: Boolean(false),
			},
			criteria: {},
			requirements: [],
			rewards: {
				recipes: [],
				loot: [],
				experience: Number(0),
				function: String(''),
			},
		};
	}

	generate()
	{
		this.isError = false;
		this.errors = [];
		const LIST = document.querySelectorAll('ul[id="edition-zone-template"] > li');
		for (const ListItem of LIST)
		{
			const inputs = ListItem.querySelectorAll('input.uk-form-danger');
			for (const input of inputs)
			{
				input.classList.remove('uk-form-danger');
				input.nextSibling.remove();
			}
			switch (ListItem.querySelector('div.uk-accordion-content').id)
			{
				case 'edit-root':
					this.root(ListItem.querySelector('div.uk-accordion-content'));
					break;
				case 'edit-display':
					this.display(ListItem.querySelector('div.uk-accordion-content'));
					break;
				case 'edit-criteria':
					this.criteria(ListItem.querySelector('div.uk-accordion-content'));
					break;
				case 'edit-requirements':
					this.requirements(ListItem.querySelector('div.uk-accordion-content'));
					break;
				case 'edit-rewards':
				default:
					this.rewards(ListItem.querySelector('div.uk-accordion-content'));
					break;
			}
		}
		if (!this.isError)
			return this.json;
		for (const error of this.errors)
		{
			const span = document.createElement('span');
			span.innerText = String(error.message);
			error.element.parentNode.insertBefore(span, error.element.nextSibling);
			error.element.classList.add('uk-form-danger');
		}
		return undefined;
	}

	input(input)
	{
		if (!input.value)
			return undefined;
		switch (input.type.toLowerCase())
		{
			case 'text':
				if (!MCutilities.checkIsLegalString(String(input.value)))
				{
					this.isError = true;
					this.errors.push({ message: LANG.Data.Error.ContainIllegalCharacter, element: input });
					return undefined;
				}
				return String(input.value);
			case 'number':
				return Number(input.value);
			case 'checkbox':
				return Boolean(input.checked);
			case 'color':
			default:
				return String(input.value);
		}
	}

	//#region  Generate JSON
	root(ListItem)
	{
		const namespace = this.input(ListItem.querySelector('#edit-root-namespace'));
		const backgroundImage = ListItem.querySelector('#edit-root-background').value;
		this.json.display.namespace = { text: namespace };
		this.json.display.background = backgroundImage;
	}

	display(ListItem)
	{
		const TitleModel = {
			text: String(''),
			color: String(''),
			bold: Boolean(false),
			italic: Boolean(false),
			underlined: Boolean(false),
			strikethrough: Boolean(false),
			obfuscated: Boolean(false),
		};
		const displayTitle = (input, type, arg) =>
		{
			if (!this.json.display[type])
				this.json.display[type] = JSON.parse(JSON.stringify(TitleModel));
			this.json.display[type][arg] = (input.type === 'checkbox') ? input.checked : input.value.trim();
		};
		this.json.display.frame = String('task');
		const lengthString = 'edit-display-'.length;
		const displayForm = document.createElement('form');
		displayForm.appendChild(ListItem.cloneNode(true));
		const _form = displayForm.elements;
		for (const element of _form)
		{
			const ID = element.id.substr(lengthString);
			if (element.classList.contains('search-dropdown-input'))
			{
				const value = MCsearch.getValue(element);
				if (value)
					this.json.display.icon.item = `minecraft:${value}`;
			}
			else if (element.value.trim())
			{
				if (/^(title-)/.test(ID))
					displayTitle(element, 'title', /(?<=title-)(.*)/.exec(ID)[0]);
				else if (/^(description-)/.test(ID))
					displayTitle(element, 'description', /(?<=description-)(.*)/.exec(ID)[0]);
				switch (ID)
				{
					case 'nbt':
						this.json.display.icon.nbt = element.value.trim();
						break;
					case 'frame':
						this.json.display.frame = element.value.trim();
						break;
					case 'check-toast':
						this.json.display.show_toast = element.checked;
						break;
					case 'check-chat':
						this.json.display.announce_to_chat = element.checked;
						break;
					case 'check-hidden':
						this.json.display.hidden = element.checked;
						break;
					default:
				}
			}
		}
	}

	criteria(ListItem)
	{
		const triggerList = ListItem.querySelectorAll('div[id="edit-criteria-list"] > div');
		for (const trigger of triggerList)
		{
			const criteriaJson = {
				trigger: String(''),
				conditions: {},
			};
			const CriteriaName = trigger.querySelector(`input[id="edit-criteria-name-${trigger.id}"]`).value;
			const TriggerForm = trigger.querySelectorAll('div.padding-criteria-form > div > div.uk-margin');
			const ID = MCsearch.getValue(trigger.querySelector('div.search-dropdown-parent'));
			if (!ID)
				continue; // eslint-disable-line no-continue
			criteriaJson.trigger = `minecraft:${ID}`;
			const boilerplate = GetTriggerForm(ID);
			let x = 0;
			for (const element of boilerplate)
			{
				if (typeof element.predefined !== 'undefined')
				{
					if (typeof element.key === 'undefined')
						throw new Error('No key declare');
					const { key } = element;
					if (/^__SEARCH/.test(element.predefined))
					{
						const searchJson = GetForm.search(element.predefined, MCsearch.getValue(TriggerForm[x].querySelector('div.search-dropdown')));
						if (Object.values(searchJson)[0])
							if (key === '__ROOT')
								criteriaJson.conditions = Object.values(searchJson)[0]; // eslint-disable-line prefer-destructuring
							else
								criteriaJson.conditions[key] = Object.values(searchJson)[0]; // eslint-disable-line prefer-destructuring
					}
					else if (/^__FORM/.test(element.predefined))
					{
						const formJson = GetForm.form(element.predefined, TriggerForm[x].querySelector('div.uk-modal-body'));
						if (Object.keys(formJson).length)
							if (key === '__ROOT')
							{
								criteriaJson.conditions = formJson;
							}
							else if (Array.isArray(key))
							{
								const lastElement = key.length - 1;
								let bubbleNode = criteriaJson.conditions;
								key.forEach((item, i) =>
								{
									if (i === lastElement)
										bubbleNode[item] = formJson;
									else if (!criteriaJson.conditions[item])
										bubbleNode[item] = {};
									bubbleNode = bubbleNode[item];
								});
							}
							else
							{
								criteriaJson.conditions[key] = formJson;
							}
					}
				}
				else if (typeof element.element !== 'undefined' && element.element.tag === 'div' && typeof element.element.childs !== 'undefined')
				{
					criteriaJson.conditions[element.element.id] = {};
					for (const child of element.element.childs)
					{
						const input = TriggerForm[x].querySelector(`input[id="${child.id}"]`);
						if (input.nodeName === 'INPUT')
							if (input.type === 'number')
								criteriaJson.conditions[element.element.id][input.id] = Number(input.value);
							else
								criteriaJson.conditions[element.element.id][input.id] = String(input.value);
						else if (input.nodeName === 'SELECT')
							criteriaJson.conditions[element.element.id][input.id] = String(input.value);
					}
				}
				else
				{
					const displayForm = document.createElement('form');
					displayForm.appendChild(TriggerForm[x].cloneNode(true));
					const form = displayForm.elements;
					for (const input of form)
						if (input.value)
							if (input.type === 'number')
								criteriaJson.conditions[input.id] = Number(input.value);
							else
								criteriaJson.conditions[input.id] = String(input.value);
				}
				++x;
			}
			this.json.criteria[CriteriaName] = criteriaJson;
		}
	}

	requirements(ListItem)
	{
		const requirementsList = ListItem.querySelectorAll('div[id="edit-requirements-list"] > div');
		if (!requirementsList.length)
		{
			const newRequirement = [];
			const triggerList = document.querySelectorAll('div[id="edit-criteria-list"] > div');
			if (!triggerList.length)
			{
				this.json.requirements = [];
			}
			else
			{
				for (const trigger of triggerList)
					newRequirement.push(trigger.querySelector(`input[id="edit-criteria-name-${trigger.id}"]`).value);
				this.json.requirements.push(newRequirement);
			}
		}
		else
		{
			for (const requirement of requirementsList)
			{
				const inputs = requirement.querySelectorAll('input.uk-checkbox');
				let isEmpty = 0;
				const newRequirement = [];
				for (const input of inputs)
					if (!input.checked)
						++isEmpty;
					else
						newRequirement.push(String(input.value));
				if (isEmpty < inputs.length)
					this.json.requirements.push(newRequirement);
			}
		}
	}

	rewards(ListItem)
	{
		const recipesList = ListItem.querySelectorAll('#edit-rewards-recipes-list input[id="edit-reward-loot"]');
		for (const recipe of recipesList)
			this.json.rewards.recipes.push(this.input(recipe));
		const lootList = ListItem.querySelectorAll('#edit-rewards-loottables-list input[id="edit-reward-loot"]');
		for (const loot of lootList)
			this.json.rewards.loot.push(this.input(loot));
		this.json.rewards.experience = this.input(ListItem.querySelector('#edit-rewards-experience'));
		this.json.rewards.function = ListItem.querySelector('#edit-rewards-function').value;
	}
	// #endregion
}

class GenerateAdvancements
{
	constructor()
	{
		this.MapcraftLocalStorage = JSON.parse(localStorage.getItem('Mapcraft'));
		this.NAMESPACE = (!ADVANCEMENT.namespace.length) ? 'mapcraft-data' : ADVANCEMENT.namespace;
		this.pathOfDirectory = path.join(this.MapcraftLocalStorage.Data.DataPack, 'data/', this.NAMESPACE, 'advancements');
		this.createdFile = [];
		fs.mkdirSync(this.pathOfDirectory, { recursive: true });
	}

	generate()
	{
		if (Object.prototype.hasOwnProperty.call(ADVANCEMENT, 'data'))
			if (Object.prototype.hasOwnProperty.call(ADVANCEMENT.data, 'json'))
			{
				const FILE = path.join(this.pathOfDirectory, `${ADVANCEMENT.data.id}.json`);
				this.createdFile.push(FILE);
				const data = ADVANCEMENT.data.json;
				if (data.display.icon.nbt.length)
					data.display.icon.nbt = `{${data.display.icon.nbt}}`;
				else
					data.display.icon.nbt = '{}';
				data.display.background = ADVANCEMENT.background;
				fs.writeFile(FILE, JSON.stringify(data, null, 4), { encoding: 'utf-8', mode: 0o666, flag: 'w' }, (err) =>
				{
					if (err)
						throw new Error(err);
				});
				if (Object.prototype.hasOwnProperty.call(ADVANCEMENT.data, 'childs'))
					for (const child of ADVANCEMENT.data.childs)
						this.iterate(child, ADVANCEMENT.data.id);
			}
	}

	iterate(child, parent)
	{
		if (Object.prototype.hasOwnProperty.call(child, 'json'))
		{
			const FILE = path.join(this.pathOfDirectory, `${child.id}.json`);
			this.createdFile.push(FILE);
			const data = child.json;
			if (data.display.icon.nbt.length)
				data.display.icon.nbt = `{${data.display.icon.nbt}}`;
			else
				data.display.icon.nbt = '{}';
			data.parent = `${this.NAMESPACE}:${parent}`;
			fs.writeFile(FILE, JSON.stringify(data, null, 4), { encoding: 'utf-8', mode: 0o666, flag: 'w' }, (err) =>
			{
				if (err)
					throw new Error(err);
			});
			if (Object.prototype.hasOwnProperty.call(child, 'childs'))
				for (const children of child.childs)
					this.iterate(children, child.id);
		}
	}
}

class EditAdvancement
{
	static search(key, value, json = ADVANCEMENT.data, parent = ADVANCEMENT.data)
	{
		let ret;
		if (json[key] === value)
			return { child: json, parent };
		if (Object.prototype.hasOwnProperty.call(json, 'childs'))
			for (const child of json.childs)
			{
				ret = this.search(key, value, child, json);
				if (ret)
					break;
			}
		return ret;
	}

	static addChild(id)
	{
		if (!document.getElementsByClassName('line-node-selected').length)
			return;
		const element = this.search('id', id);
		element.child.childs.push(newChild());
		Component.saveFile();	// eslint-disable-line no-use-before-define
	}

	static addParent(id)
	{
		if (!document.getElementsByClassName('line-node-selected').length)
			return;
		const element = this.search('id', id);
		element.parent.childs.push(newChild());
		Component.saveFile();	// eslint-disable-line no-use-before-define
	}

	static remove(id)
	{
		const _remove = (data, sliceID = undefined, parent = undefined) =>
		{
			if (data.id === id)
			{
				parent.childs.splice(sliceID, 1);
				return;
			}
			if (Object.prototype.hasOwnProperty.call(data, 'childs'))
				for (const children of data.childs)
					_remove(children, data.childs.indexOf(children), data);
		};
		_remove(ADVANCEMENT.data);
		Component.saveFile();	// eslint-disable-line no-use-before-define
	}

	static edit(key, value, data)
	{
		const element = this.search(key, value);
		element.child.json = JSON.parse(JSON.stringify(data));
		Component.saveFile();	// eslint-disable-line no-use-before-define
	}
}

class Component
{
	static main()
	{
		UpdateLang();
		TEMPLATE.render(document.getElementById('content'), 'advancement.tp', null);
		TEMPLATE.render(document.getElementById('edition-zone-template'), 'edit.tp', null);
		TEMPLATE.updateLang(document.getElementById('content'), LANG.Data);
		this.drawList();

		MCsearch.blocksItems(document.getElementById('edit-display-icon'), Mapcraft.config.Minecraft.SelectedVersion);
		this.addParentChild();
		this.addTrigger();
		this.addRequirement();
		this.addRecipe();
		this.addLootTable();

		// Add new advancements
		document.getElementById('create-new-advancement').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const Dir = path.join(RecipesDirectory, 'data');
			const json = BaseModel();
			if (!fs.existsSync(Dir))
				fs.mkdirSync(Dir);
			fs.writeFile(path.join(Dir, `${json.id}.json`), JSON.stringify(json, null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
			{
				if (err)
					MCutilities.createAlert('danger', document.getElementById('advancement-error'), err);

				localStorage.setItem('Advancement_Select', json.id);
				ADVANCEMENT = JSON.parse(JSON.stringify(json)); // deepcopy of json, structuredClone() not work
				//#region  Rewrite list and select new advancement
				TEMPLATE.cleanNode(document.getElementById('advancement-list'));
				this.drawList(true);
				const ICONS = document.querySelectorAll('#advancement-list span[uk-icon="chevron-right"]');
				for (const icon of ICONS)
					icon.style.display = 'none';
				// #endregion
				//#region  Graph
				TEMPLATE.cleanNode(document.querySelector('div.graph'));
				SetJson.cleanForm();
				this.drawGraph(ADVANCEMENT.data);
				// #endregion
				document.getElementById('input-zone-name-advancement').value = ADVANCEMENT.name;
				document.getElementById('input-zone').style.removeProperty('display');
			});
		});

		// Update name and icon of advancement if input change
		document.getElementById('input-zone-name-advancement').addEventListener('input', (event) =>
		{
			ADVANCEMENT.name = (Object.keys(ADVANCEMENT).length) ? event.target.value : 'undefined';
			const LIST = document.querySelector(`li[advancement-id="${localStorage.getItem('Advancement_Select')}"] > span`);
			LIST.nextSibling.innerText = ADVANCEMENT.name;
		});
		document.getElementById('input-zone-name-advancement').addEventListener('focusout', () =>
		{
			this.saveFile();
		});
		document.querySelector('#edit-display-icon input.search-dropdown-input').addEventListener('input', (event) =>
		{
			if (!document.getElementById('zone').style.display)
				document.querySelector('div.line-node-selected img').src = getSrcImage(event.target.value).src;
		});

		// Select advancement in list and display
		document.getElementById('advancement-list').addEventListener('click', (event) =>
		{
			CurrentID = undefined;
			const ICONS = document.querySelectorAll('#advancement-list span[uk-icon="chevron-right"]');
			for (const icon of ICONS)
				icon.style.display = 'none';
			const BASE = (event.target.tagName === 'SPAN') ? (event.target.parentNode) : event.target;
			BASE.childNodes[0].style.display = '';
			localStorage.setItem('Advancement_Select', BASE.getAttribute('advancement-id'));
			fs.readFile(BASE.getAttribute('advancement-file'), { encoding: 'utf-8', flag: 'r' }, (err, data) =>
			{
				if (err)
					MCutilities.createAlert('warning', document.getElementById('advancement-error'), err);
				ADVANCEMENT = JSON.parse(data);
				TEMPLATE.cleanNode(document.querySelector('div.graph'));
				SetJson.cleanForm();
				this.drawGraph(ADVANCEMENT.data);
				document.getElementById('input-zone-name-advancement').value = ADVANCEMENT.name;
				document.getElementById('input-zone').style.removeProperty('display');
			});
		});

		// Generate complete advancement
		document.getElementById('input-zone-generate-advancement').addEventListener('click', () =>
		{
			MCworkInProgress.open();
			this.generateAdvancement();
			const Generate = new GenerateAdvancements();
			try
			{
				Generate.generate();
			}
			catch (err)
			{
				MCutilities.createAlert('warning', document.getElementById('advancement-error'), err.message);
				Generate.createdFile.forEach((_file) =>
				{
					fs.rm(_file, (err2) =>
					{
						if (err2)
							MCutilities.createAlert('warning', document.getElementById('advancement-error'), err2.message);
					});
				});
			}
			MCutilities.createAlert('success', document.getElementById('advancement-error'), LANG.Data.Graph.SuccessGeneration);
			MCworkInProgress.close();
		});

		// Modify name of advancement
		document.getElementById('edit-display-title-text').addEventListener('input', (event) =>
		{
			if (!document.getElementById('zone').style.display)
			{
				document.querySelector('div.line-node-selected h5').innerText = event.target.value;
				ADVANCEMENT.name = event.target.value;
			}
		});
		// Save selected advancement
		document.getElementById('save-advancement').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			this.generateAdvancement();
		});
		// Delete selected advancement
		document.getElementById('modal-confirm-yes').addEventListener('click', () =>
		{
			CurrentID = undefined;
			const ICONS = document.querySelector(`#advancement-list li[advancement-id=${localStorage.getItem('Advancement_Select')}]`);
			fs.rm(ICONS.getAttribute('advancement-file'), (err) =>
			{
				if (err)
					MCutilities.createAlert('warning', document.getElementById('advancement-error'), err.message);
				TEMPLATE.cleanNode(ICONS, true);
				TEMPLATE.cleanNode(document.querySelector('div.graph'));
				SetJson.cleanForm();
				document.getElementById('input-zone').style.setProperty('display', 'none');
				document.getElementById('zone').style.setProperty('display', 'none');
				document.getElementById('input-zone-name-advancement').value = '';
				localStorage.setItem('Advancement_Select', '');
			});
		});
	}

	static saveFile()
	{
		fs.writeFileSync(path.join(RecipesDirectory, 'data', `${ADVANCEMENT.id}.json`), JSON.stringify(ADVANCEMENT, null, 4), { encoding: 'utf-8', flag: 'w' });
	}

	static generateAdvancement()
	{
		if (!Object.keys(ADVANCEMENT).length)
		{
			MCutilities.createAlert('warning', document.getElementById('advancement-error'), LANG.Data.Error.NoAdvancement);
			return;
		}
		if (CurrentID)
		{
			const newJson = new Json();
			const json = newJson.generate();
			if (json)
				EditAdvancement.edit('id', CurrentID, json);
		}
	}

	static drawList(addAdvancement = false)
	{
		const Dir = path.join(RecipesDirectory, 'data');
		const List = document.getElementById('advancement-list');
		fs.readdir(Dir, { encoding: 'utf-8' }, (err, files) =>
		{
			if (err)
				MCutilities.createAlert('danger', document.getElementById('advancement-error'), err);
			for (const file of files)
			{
				const json = JSON.parse(fs.readFileSync(path.join(Dir, file), { encoding: 'utf-8', flag: 'r' }));
				const li = document.createElement('li');
				li.setAttribute('advancement-id', json.id);
				const spanOne = document.createElement('span');
				spanOne.setAttribute('uk-icon', 'chevron-right');
				spanOne.style.display = 'none';
				const spanTwo = document.createElement('span');
				spanTwo.innerText = json.name;
				li.setAttribute('advancement-file', path.join(Dir, file));
				li.appendChild(spanOne);
				li.appendChild(spanTwo);
				List.appendChild(li);
			}
			if (addAdvancement)
			{
				const ICONS = List.querySelectorAll('span[uk-icon="chevron-right"]');
				for (const icon of ICONS)
					icon.style.display = 'none';
				List.querySelector(`li[advancement-id="${localStorage.getItem('Advancement_Select')}"] span[uk-icon="chevron-right"]`).style.display = '';
			}
		});
	}

	static addParentChild()
	{
		document.getElementById('add-parent').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();

			CurrentID = document.querySelector('div.graph div.line-node-selected div.block').getAttribute('node');
			EditAdvancement.addParent(CurrentID);
			this.drawGraph(ADVANCEMENT.data, true);
			SetJson.set(EditAdvancement.search('id', CurrentID).child.json);
		});

		document.getElementById('add-child').addEventListener('click', (event) =>
		{
			// child
			event.preventDefault();
			event.stopImmediatePropagation();

			CurrentID = document.querySelector('div.graph div.line-node-selected div.block').getAttribute('node');
			EditAdvancement.addChild(CurrentID);
			this.drawGraph(ADVANCEMENT.data, true);
			SetJson.set(EditAdvancement.search('id', CurrentID).child.json);
		});
	}

	static drawGraph(json, ifAdding = false)
	{
		const graph = document.querySelector('div.graph');

		const getAdvancementData = (BLOCK) =>
		{
			BLOCK.querySelector('div.block').addEventListener('click', (event) =>
			{
				event.preventDefault();
				event.stopImmediatePropagation();

				console.log(event.target);

				if (CurrentID)
				{
					const newJson = new Json();
					EditAdvancement.edit('id', CurrentID, newJson.generate());
					this.saveFile();
				}
				CurrentID = BLOCK.querySelector('div.block').getAttribute('node');
				//#region  Display child button if selected node is not main
				if (ADVANCEMENT.data.id === CurrentID)
					document.getElementById('add-child').style.setProperty('display', 'none');
				else
					document.getElementById('add-child').style.removeProperty('display');
				// #endregion

				//#region  Set selected line
				const GRAPH = document.querySelectorAll('div.graph div.line-node');
				for (const line of GRAPH)
					line.classList.remove('line-node-selected');
				BLOCK.classList.add('line-node-selected');
				// #endregion

				//#region  Fill form with data of current selected block
				console.log(EditAdvancement.search('id', CurrentID).child.json);
				SetJson.set(EditAdvancement.search('id', CurrentID).child.json);
				if (document.getElementById('zone').style.display)
					document.getElementById('zone').style.removeProperty('display');
				// #endregion
			});
		};

		const collapse = (BLOCK) =>
		{
			BLOCK.querySelector('button.uk-icon-button').addEventListener('click', (event) =>
			{
				event.preventDefault();
				event.stopImmediatePropagation();
				const accordionID = BLOCK.getAttribute('graph-accordion');
				const LINES = document.getElementsByClassName('line-node');
				BLOCK.toggleAttribute('isReplied');
				for (let x = 0; x < LINES.length; x++)
					if (LINES[x].getAttribute('graph-accordion') > accordionID)
					{
						LINES[x].classList.toggle('line-node-hide');
						if (LINES[x].hasAttribute('isReplied'))
						{
							const repliedID = LINES[x].getAttribute('graph-accordion');
							x++;
							while (LINES[x].getAttribute('graph-accordion') > repliedID)
								x++;
							x--;
						}
					}
			});
		};

		const addBlock = (BLOCK, child, ParentID) =>
		{
			const srcImage = getSrcImage(child.json.display.icon.item.slice(10));
			TEMPLATE.render(BLOCK, 'line/node.tp', { node: child.id, parent: ParentID, title: child.json.display.title.text, icon: srcImage.src, class: srcImage.class });
			TEMPLATE.render(BLOCK, 'line/remove_advancement.tp', { node: child.id });
			const BUTTON = BLOCK.querySelector('button.uk-button-danger');
			BUTTON.addEventListener('click', (event) =>
			{
				event.preventDefault();
				event.stopImmediatePropagation();
				document.getElementById('zone').style.display = 'none';
				const nodeID = BUTTON.parentNode.getAttribute('node');
				EditAdvancement.remove(nodeID);
				TEMPLATE.cleanNode(document.querySelector('div.graph'));
				this.drawGraph(ADVANCEMENT.data);
			});
		};

		const childs = (Childs, ParentID, arrayLine, accordionID) =>
		{
			const isLastChild = (child) => (child === Childs[Childs.length - 1]);
			for (const child of Childs)
			{
				let saveSVG;
				const BLOCK = document.createElement('div');
				BLOCK.classList.add('line-node');
				if (ifAdding && CurrentID === child.id)
					BLOCK.classList.add('line-node-selected');
				for (const line of arrayLine)
					TEMPLATE.render(BLOCK, `line/${line}.tp`);
				if (child.childs.length)
				{
					if (!isLastChild(child))
					{
						TEMPLATE.render(BLOCK, 'line/collapse.tp');
						saveSVG = 'line';
					}
					else
					{
						TEMPLATE.render(BLOCK, 'line/lastCollapse.tp');
						saveSVG = 'empty';
					}
					addBlock(BLOCK, child, ParentID, arrayLine);
					collapse(BLOCK);
				}
				else
				{
					if (!isLastChild(child))
						TEMPLATE.render(BLOCK, 'line/children.tp');
					else
						TEMPLATE.render(BLOCK, 'line/angle.tp');
					addBlock(BLOCK, child, ParentID, arrayLine);
				}
				BLOCK.setAttribute('graph-accordion', accordionID);
				BLOCK.removeAttribute('tp');
				getAdvancementData(BLOCK);
				graph.appendChild(BLOCK);
				if (Object.prototype.hasOwnProperty.call(child, 'childs'))
				{
					const newArray = [...arrayLine];
					newArray.push(saveSVG);
					childs(child.childs, child.id, newArray, (Number(accordionID) + 1)); //eslint-disable-line
				}
			}
		};

		if (Object.keys(json).length)
		{
			TEMPLATE.cleanNode(graph);
			const BLOCK = document.createElement('div');
			BLOCK.classList.add('line-node');
			TEMPLATE.render(BLOCK, 'line/root.tp');
			const srcImage = getSrcImage(json.json.display.icon.item.slice(10));
			TEMPLATE.render(BLOCK, 'line/node.tp', { node: json.id, parent: json.id, title: String(json.json.display.title.text), icon: srcImage.src, class: srcImage.class });
			if (ifAdding && json.id === CurrentID)
				BLOCK.classList.add('line-node-selected');
			BLOCK.setAttribute('graph-accordion', Number(0));
			BLOCK.removeAttribute('tp');
			getAdvancementData(BLOCK);
			graph.appendChild(BLOCK);
			if (json.childs.length)
			{
				collapse(BLOCK, true);
				childs(json.childs, json.id, ['empty'], 1);
			}
		}
	}

	static newTrigger(GenerateID, defaultValue, TriggerList = document.getElementById('edit-criteria-list'), RegenerateRequirement = true)
	{
		const DOMelement = document.createElement('div');
		TEMPLATE.render(DOMelement, 'criteria.tp', { ID: GenerateID, DefaultValue: defaultValue });
		DOMelement.id = GenerateID;
		DOMelement.removeAttribute('tp');
		DOMelement.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
		const SearchID = MCsearch.triggers(DOMelement.querySelector(`#edit-criteria-trigger-${GenerateID}`));
		const CriteriaForm = DOMelement.querySelector(`#edit-criteria-form-${GenerateID}`);
		DOMelement.querySelector(`#edit-criteria-name-${GenerateID}`).addEventListener('input', (eventName) =>
		{
			const defaultID = eventName.target.getAttribute('defaultId');
			const requirementList = document.querySelectorAll(`#edit-requirements-list input[defaultId="${defaultID}"]`);
			if (requirementList.length)
				for (const input of requirementList)
				{
					input.setAttribute('value', eventName.target.value);
					input.nextSibling.innerText = String(eventName.target.value);
				}
		});
		DOMelement.querySelector(`#search-dropdown-${SearchID}`).addEventListener('input', (eventForm) =>
		{
			const FORM = Form.printTrigger(eventForm.target.value);
			TEMPLATE.cleanNode(CriteriaForm);
			if (FORM)
			{
				TEMPLATE.cleanNode(CriteriaForm);
				CriteriaForm.appendChild(FORM);
				OpenExternLink();
			}
			else
			{
				TEMPLATE.cleanNode(CriteriaForm);
			}
		});
		DOMelement.querySelector(`#edit-criteria-close-${GenerateID}`).addEventListener('click', () =>
		{
			DOMelement.remove();
			const criteriaList = document.querySelectorAll('div[id="edit-criteria-list"] > div');
			if (!criteriaList.length)
			{
				const oldRequirements = document.querySelectorAll('div[id="edit-requirements-list"] > div');
				for (const requirement of oldRequirements)
					requirement.remove();
			}
			else
			{
				this.regenerateRequirementList();
			}
		});
		TriggerList.appendChild(DOMelement);
		TEMPLATE.updateLang(TriggerList, LANG.Data);
		if (RegenerateRequirement)
			this.regenerateRequirementList();
		return GenerateID;
	}

	static addTrigger()
	{
		let GenerateID = 1;
		document.getElementById('edit-criteria-add-trigger').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			this.newTrigger(GenerateID++, `default_${randomString()}`);
		});
	}

	static generateRequirementList()
	{
		const newCheckbox = (value, defaultId) =>
		{
			const labelCheck = document.createElement('label');
			const inputCheck = document.createElement('input');
			const spanCheck = document.createElement('span');
			inputCheck.classList.add('uk-checkbox', 'uk-margin-right');
			inputCheck.setAttribute('type', 'checkbox');
			inputCheck.setAttribute('value', String(value));
			inputCheck.setAttribute('defaultId', String(defaultId));
			spanCheck.innerText = String(value);
			labelCheck.appendChild(inputCheck);
			labelCheck.appendChild(spanCheck);
			return labelCheck;
		};

		const triggerList = document.querySelectorAll('div[id="edit-criteria-list"] > div');
		const checkList = document.createElement('div');
		checkList.classList.add('uk-flex', 'uk-flex-around', 'uk-flex-middle', 'uk-flex-wrap');
		checkList.setAttribute('id', 'edit-requirement-list');
		for (const trigger of triggerList)
		{
			const input = trigger.querySelector(`input[id="edit-criteria-name-${trigger.id}"]`);
			checkList.appendChild(newCheckbox(input.value, input.getAttribute('defaultId')));
		}
		return checkList;
	}

	static regenerateRequirementList()
	{
		const checkList = this.generateRequirementList();
		const oldRequirement = document.querySelectorAll('#edit-requirements-list div.uk-margin > div');
		for (const requirementList of oldRequirement)
		{
			const newList = checkList.cloneNode(true);
			const inputs = requirementList.querySelectorAll('input[type="checkbox"]');
			for (const input of inputs)
			{
				const selectInput = newList.querySelector(`input[value="${input.value}"]`);
				if (selectInput && input.checked)
					selectInput.checked = true;
				else if (selectInput)
					selectInput.checked = false;
			}
			requirementList.replaceWith(newList);
		}
	}

	static addRequirement()
	{
		document.getElementById('edit-requirements-add').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (!document.querySelectorAll('div[id="edit-criteria-list"] > div').length)
			{
				MCutilities.createAlert('warning', document.getElementById('edit-requirements-error'), LANG.Data.Error.NoCriteria);
				return;
			}
			const MODEL = document.createElement('div');
			TEMPLATE.render(MODEL, 'requirement.tp');
			MODEL.removeAttribute('tp');
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-requirement-checkbox').replaceWith(this.generateRequirementList());
			this.regenerateRequirementList();
			MODEL.querySelector('#edit-requirement-close').addEventListener('click', () => MODEL.remove());
			TEMPLATE.updateLang(MODEL, LANG.Data);
			document.getElementById('edit-requirements-list').appendChild(MODEL);
		});
	}

	static addRecipe()
	{
		document.getElementById('edit-rewards-recipes-add').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const MODEL = document.createElement('div');
			TEMPLATE.render(MODEL, 'reward_loot.tp');
			MODEL.removeAttribute('tp');
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-reward-loot-close').addEventListener('click', () => MODEL.remove());
			TEMPLATE.updateLang(MODEL, LANG.Data);
			document.getElementById('edit-rewards-recipes-list').appendChild(MODEL);
		});
	}

	static addLootTable()
	{
		document.getElementById('edit-rewards-loottables-add').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const MODEL = document.createElement('div');
			TEMPLATE.render(MODEL, 'reward_loot.tp');
			MODEL.removeAttribute('tp');
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-reward-loot-close').addEventListener('click', () => MODEL.remove());
			TEMPLATE.updateLang(MODEL, LANG.Data);
			document.getElementById('edit-rewards-loottables-list').appendChild(MODEL);
		});
	}
}

module.exports = Component;
