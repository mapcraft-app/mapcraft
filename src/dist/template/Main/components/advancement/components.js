const { shell } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { Mapcraft, MCutilities, MCtemplate, MCsearch } = require('mapcraft-api');

const Form = require('./form/form');
const GetForm = require('./form/get');
const SetForm = require('./form/set');

const randomString = () => crypto.randomBytes(8).toString('hex');
const LANG = MCutilities.GetLang(__dirname, Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(__dirname);
let ADVANCEMENT = {};

//Add directory to datapack if not exist
const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const RecipesDirectory = path.join(LocalMapcraft.Data.DataPack, 'data', 'mapcraft-data', 'advancements');
if (!fs.existsSync(RecipesDirectory))
	fs.mkdirSync(RecipesDirectory, { recursive: true });

const TRIGGERFORM = MCutilities.GetDataGameElement('triggers', Mapcraft.GetConfig().Minecraft.SelectedVersion);
const GetTriggerForm = (id) =>
{
	for (const trigger of TRIGGERFORM)
		if (trigger.id === id)
			return trigger.form;
	return undefined;
};

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

function searchInJson(key, value, json = ADVANCEMENT.data)
{
	let ret;
	if (json[key] === value)
		return json;
	if (Object.prototype.hasOwnProperty.call(json, 'childs'))
		for (const child of json.childs)
		{
			ret = searchInJson(key, value, child);
			if (ret)
				break;
		}
	return ret;
}

class SetJson
{
	static set(advancement)
	{
		console.log(advancement);
		TEMPLATE.cleanNode(document.querySelector('div[id="edit-criteria-list"]'));
		const LIST = document.querySelectorAll('ul[id="edition-zone-template"] > li');
		for (const ListItem of LIST)
			switch (ListItem.querySelector('div.uk-accordion-content').id)
			{
				default:
				case 'edit-root':
					this.setRoot(ListItem.querySelector('div.uk-accordion-content'), advancement.display);
					break;
				case 'edit-display':
					this.setDisplay(ListItem.querySelector('div.uk-accordion-content'), advancement.display);
					break;
				case 'edit-criteria':
					this.setCriteria(ListItem.querySelector('div.uk-accordion-content'), advancement.criteria);
					break;
				case 'edit-requirements':
					this.setRequirements(ListItem.querySelector('div.uk-accordion-content'), advancement);
					break;
				case 'edit-rewards':
					this.setRewards(ListItem.querySelector('div.uk-accordion-content'), advancement.rewards);
					break;
			}
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
				default:
				case 'text':
				case 'color':
					input.value = String(value); //eslint-disable-line
					break;
				case 'number':
					input.value = Number(value); //eslint-disable-line
					break;
				case 'checkbox':
					input.checked = Boolean(value); //eslint-disable-line
			}
	}

	static setRoot(ListItem, advancement)
	{
		this.input(ListItem.querySelector('#edit-root-namespace'), advancement.namespace.text);
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
			MCsearch.SetValue(ListItem.querySelector('#edit-display-icon'), advancement.icon.item);
		this.input(ListItem.querySelector('#edit-display-frame'), advancement.frame);
		this.input(ListItem.querySelector('#edit-display-nbt'), advancement.nbt);
		this.input(ListItem.querySelector('#edit-display-check-toast'), advancement.show_toast);
		this.input(ListItem.querySelector('#edit-display-check-chat'), advancement.announce_to_chat);
		this.input(ListItem.querySelector('#edit-display-check-hidden'), advancement.hidden);
	}

	static setCriteria(ListItem, advancement)
	{
		let GenerateID = 0;
		for (const x in advancement)
			if (Object.prototype.hasOwnProperty.call(advancement, x))
			{
				const ID = Component.newTrigger(GenerateID, x); //eslint-disable-line no-use-before-define
				MCsearch.SetValue(ListItem.querySelector(`div[id="${ID}"] div.search-dropdown-input`), advancement[x].trigger.slice(10));
				const CriteriaForm = ListItem.querySelector(`#edit-criteria-form-${GenerateID++}`);
				const FORM = Form.printTrigger(advancement[x].trigger.slice(10));
				if (FORM)
				{
					TEMPLATE.cleanNode(CriteriaForm);
					CriteriaForm.appendChild(FORM);
					OpenExternLink();
					const TRIGGER = MCutilities.GetDataGameElement('triggers').find((element) =>
					//eslint-disable-next-line arrow-body-style
					{
						return element.id === advancement[x].trigger.slice(10);
					});
					for (const form of TRIGGER.form)
						if (Object.prototype.hasOwnProperty.call(form, 'predefined'))
						{
							if (/^__SEARCH/.test(form.predefined))
							{
								const SearchInput = CriteriaForm.querySelector(`label[lang="${form.lang}"]`);
								MCsearch.SetValue(SearchInput.nextSibling, advancement[x].conditions[form.key].slice(10));
							}
							else if (/^__FORM/.test(form.predefined))
							{
								const MODAL = CriteriaForm.querySelector(`label.uk-form-label[lang="${form.lang}"]`).nextSibling.querySelector('div.uk-modal-body');
								switch (form.predefined)
								{
									default:
									case '__FORM_DAMAGE':
										SetForm.damage(MODAL, advancement[x].conditions[form.key]);
										break;
									/*case '__FORM_DISTANCE':
										SetForm.distance(MODAL, advancement[x].conditions[form.key]);
										break;
									case '__FORM_DURABILITY':
										SetForm.durability(MODAL, advancement[x].conditions[form.key]);
										break;*/
									case '__FORM_EFFECTS':
										SetForm.effect(MODAL, advancement[x].conditions[form.key]);
										break;
									case '__FORM_ENTITIES':
										SetForm.entity(MODAL, advancement[x].conditions[form.key]);
										break;
									case '__FORM_ITEMS':
										SetForm.item(MODAL, advancement[x].conditions[form.key]);
										break;
									/*case '__FORM_ITEMS_LIST':
										SetForm.itemList(MODAL, advancement[x].conditions[form.key]);
										break;*/
									case '__FORM_LOCATION':
										SetForm.location(MODAL, advancement[x].conditions[form.key]);
										break;
									/*case '__FORM_PLAYER':
										SetForm.player(MODAL, advancement[x].conditions[form.key]);
										break;
									case '__FORM_SLOT':
										SetForm.slot(MODAL, advancement[x].conditions[form.key]);
										break;*/
									case '__FORM_STATE':
										SetForm.state(MODAL, advancement[x].conditions[form.key]);
										break;
									case '__FORM_TYPE':
										SetForm.type(MODAL, advancement[x].conditions[form.key]);
										break;
									case '__FORM_VICTIMS':
										SetForm.victim(MODAL, advancement[x].conditions[form.key]);
										break;
								}
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
										search.setAttribute('value', criteriaData[child.id]);
									else if (Object.prototype.hasOwnProperty.call(child, 'childs'))
										searchChilds(search, criteriaData[child.id], child);
								}
							};
							const SearchInput = CriteriaForm.querySelector(`${form.element.tag}[id="${form.element.id}"]`);
							if (Object.prototype.hasOwnProperty.call(form.element, 'childs'))
								searchChilds(SearchInput, advancement[x].conditions[form.element.id], form.element.childs);
							else
								SearchInput.setAttribute('value', advancement[x].conditions[form.element.id]);
						}
				}
				else
				{
					TEMPLATE.cleanNode(CriteriaForm);
				}
			}
	}

	static setRequirements(ListItem, advancement)
	{
		TEMPLATE.cleanNode(ListItem.querySelector('#edit-requirements-list'));
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
				default:
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
			default:
			case 'text':
				if (!MCutilities.CheckIfStringIsLegalCharacter(String(input.value)))
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
				return String(input.value);
		}
	}

	//#region Generate JSON
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
				const value = MCsearch.GetValue(element);
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
						this.json.display.nbt = element.value.trim();
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
			const ID = MCsearch.GetValue(trigger.querySelector('div.search-dropdown-parent'));
			if (!ID)
				continue; //eslint-disable-line no-continue
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
						const searchJson = GetForm.search(element.predefined, MCsearch.GetValue(TriggerForm[x].querySelector('div.search-dropdown')));
						if (Object.values(searchJson)[0])
							if (key === '__ROOT')
								criteriaJson.conditions = Object.values(searchJson)[0]; //eslint-disable-line prefer-destructuring
							else
								criteriaJson.conditions[key] = Object.values(searchJson)[0]; //eslint-disable-line prefer-destructuring
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
			for (const trigger of triggerList)
				newRequirement.push(trigger.querySelector(`input[id="edit-criteria-name-${trigger.id}"]`).value);
			this.json.requirements.push(newRequirement);
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
	//#endregion
}

class Component
{
	static main()
	{
		TEMPLATE.render(document.getElementById('content'), 'advancement.tp', null);
		TEMPLATE.render(document.getElementById('edition-zone-template'), 'edit.tp', null);
		TEMPLATE.updateLang(document.getElementById('content'), LANG.Data);
		this.drawList();

		MCsearch.blocksItems(document.getElementById('edit-display-icon'), Mapcraft.GetConfig().Minecraft.SelectedVersion);
		this.addTrigger();
		this.addRequirement();
		this.addRecipe();
		this.addLootTable();

		//Add new advancements
		document.getElementById('create-new-advancement').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const Dir = path.join(RecipesDirectory, 'data');
			const json = {
				id: `advancement_${randomString()}`,
				name: 'new advancement',
				data: {
					id: randomString(),
					title: 'Advancement',
					icon: 'dirt',
					json: {},
				},
			};
			if (!fs.existsSync(Dir))
				fs.mkdirSync(Dir);
			fs.writeFile(path.join(Dir, `${json.id}.json`), JSON.stringify(json, null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
			{
				if (err)
					MCutilities.CreateAlert('danger', document.getElementById('advancement-error'), err);
				ADVANCEMENT = JSON.parse(JSON.stringify(json)); //deepcopy of json, structuredClone() not work
				this.drawGraph(ADVANCEMENT.data);
				document.getElementById('name-advancement').value = ADVANCEMENT.name;
				const li = document.createElement('li');
				li.setAttribute('advancement-id', json.id);
				li.innerText = json.name;
				li.setAttribute('advancement-file', path.join(Dir, `${json.id}.json`));
				document.getElementById('advancement-list').appendChild(li);
			});
		});

		//Update name of advancement if input change
		document.getElementById('name-advancement').addEventListener('input', (event) =>
		{
			if (Object.keys(ADVANCEMENT).length)
				ADVANCEMENT.name = event.target.value;
			console.log(ADVANCEMENT);
		});

		//Select advancement in list and display
		document.getElementById('advancement-list').addEventListener('click', (event) =>
		{
			fs.readFile(event.target.getAttribute('advancement-file'), { encoding: 'utf-8', flag: 'r' }, (err, data) =>
			{
				if (err)
					MCutilities.CreateAlert('warning', document.getElementById('advancement-error'), err);
				ADVANCEMENT = JSON.parse(data);
				TEMPLATE.cleanNode(document.querySelector('div.graph'));
				this.drawGraph(ADVANCEMENT.data);
				document.getElementById('name-advancement').value = ADVANCEMENT.name;
			});
		});

		//Generate advancement
		document.getElementById('content').querySelector('#generate-advancement').addEventListener('click', () =>
		{
			const newJson = new Json();
			const json = newJson.generate();
			if (json)
				console.log(json);
		});
	}

	static drawList()
	{
		const Dir = path.join(RecipesDirectory, 'data');
		const List = document.getElementById('advancement-list');
		fs.readdir(Dir, { encoding: 'utf-8' }, (err, files) =>
		{
			if (err)
				MCutilities.CreateAlert('danger', document.getElementById('advancement-error'), err);
			for (const file of files)
			{
				const json = JSON.parse(fs.readFileSync(path.join(Dir, file), { encoding: 'utf-8', flag: 'r' }));
				const li = document.createElement('li');
				li.setAttribute('advancement-id', json.id);
				li.innerText = json.name;
				li.setAttribute('advancement-file', path.join(Dir, file));
				List.appendChild(li);
			}
		});
	}

	static drawGraph(json)
	{
		const graph = document.querySelector('div.graph');
		const getSrcImage = (item) =>
		{
			const testBlockPath = path.join(__dirname, '../../../../img/assets/block', item);
			const testItemPath = path.join(__dirname, '../../../../img/assets/item', item);
			if (fs.existsSync(`${testBlockPath}.png`))
				return `./dist/img/assets/block/${item}.png`;
			if (fs.existsSync(`${testBlockPath}.webp`))
				return `./dist/img/assets/block/${item}.webp`;
			if (fs.existsSync(`${testItemPath}.png`))
				return `./dist/img/assets/item/${item}.png`;
			return `./dist/img/assets/item/${item}.webp`;
		};
		const getAdvancementData = (BLOCK) =>
		{
			BLOCK.querySelector('div.block').addEventListener('click', (event) =>
			{
				event.preventDefault();
				event.stopImmediatePropagation();
				const element = searchInJson('id', BLOCK.querySelector('div.block').getAttribute('node'));
				if (Object.prototype.hasOwnProperty.call(element, 'json') && Object.keys(element.json).length)
					SetJson.set(element.json);
			});
		};

		const collapse = (BLOCK, isRoot = false) =>
		{
			BLOCK.querySelector('button.uk-icon-button').addEventListener('click', (event) =>
			{
				event.preventDefault();
				event.stopImmediatePropagation();
				const LINES = graph.querySelectorAll('div.line-node');
				const blockNode = BLOCK.querySelector('div.block').getAttribute('node');
				const blockParent = BLOCK.querySelector('div.block').getAttribute('parent');
				let isFound = false;
				for (const line of LINES)
				{
					const parent = line.querySelector('div.block').getAttribute('parent');
					if (isFound && parent === blockParent && !isRoot)
						break;
					if (isFound)
						if (parent !== blockNode)
							line.classList.add('line-node-hide');
						else
							line.classList.toggle('line-node-hide');
					if (line === BLOCK)
						isFound = true;
				}
			});
		};

		const childs = (childJson, parentId, deepNode, emptyNode) =>
		{
			for (const key in childJson)
				if (Object.prototype.hasOwnProperty.call(childJson, key))
				{
					const lastChild = (childJson[key] === childJson[childJson.length - 1]);
					let isChilds = false;
					const BLOCK = document.createElement('div');
					BLOCK.classList.add('line-node');
					for (let empty = emptyNode; empty > 0; empty--)
						TEMPLATE.render(BLOCK, 'line/empty.tp');
					for (let deep = emptyNode; deep < deepNode; deep++)
						TEMPLATE.render(BLOCK, 'line/line.tp');
					if (Object.prototype.hasOwnProperty.call(childJson[key], 'childs'))
					{
						if (lastChild)
						{
							TEMPLATE.render(BLOCK, 'line/lastCollapse.tp');
							emptyNode++; //eslint-disable-line no-param-reassign
						}
						else
						{
							TEMPLATE.render(BLOCK, 'line/collapse.tp');
						}
						isChilds = true;
					}
					else if (lastChild)
					{
						TEMPLATE.render(BLOCK, 'line/angle.tp');
					}
					else
					{
						TEMPLATE.render(BLOCK, 'line/children.tp');
					}
					TEMPLATE.render(BLOCK, 'line/node.tp', { node: childJson[key].id, parent: parentId, title: childJson[key].title, icon: getSrcImage(childJson[key].icon) });
					BLOCK.removeAttribute('tp');
					getAdvancementData(BLOCK);
					graph.appendChild(BLOCK);
					if (isChilds)
					{
						collapse(BLOCK);
						childs(childJson[key].childs, childJson[key].id, deepNode + 1, emptyNode);
					}
				}
		};

		if (Object.keys(json).length)
		{
			const BLOCK = document.createElement('div');
			BLOCK.classList.add('line-node');
			TEMPLATE.render(BLOCK, 'line/root.tp');
			TEMPLATE.render(BLOCK, 'line/node.tp', { node: json.id, parent: json.id, title: json.title, icon: getSrcImage(json.icon) });
			BLOCK.removeAttribute('tp');
			getAdvancementData(BLOCK);
			graph.appendChild(BLOCK);
			if (Object.prototype.hasOwnProperty.call(json, 'childs'))
			{
				collapse(BLOCK, true);
				childs(json.childs, json.id, Number(1), Number(1));
			}
		}
	}

	static newTrigger(GenerateID, defaultValue)
	{
		const TriggerList = document.getElementById('edit-criteria-list');
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
				MCutilities.CreateAlert('warning', document.getElementById('edit-requirements-error'), LANG.Data.Error.NoCriteria);
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
