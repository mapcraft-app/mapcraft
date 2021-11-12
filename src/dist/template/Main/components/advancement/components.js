const { shell } = require('electron');
const crypto = require('crypto');
const { Mapcraft, MCutilities, MCtemplate, MCsearch } = require('mapcraft-api');
const MODELS = require('./model');
const Form = require('./form/form');
const GetForm = require('./form/get');

const randomString = () => crypto.randomBytes(8).toString('hex');
const LANG = MCutilities.GetLang(__dirname, Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(__dirname);

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

class TreeJson
{
	constructor()
	{
		this.id = 0;
		this.iTab = 0;
		this.tree = [
			{
				id: this.id,
				parentId: null,
				advancement: MODELS.advancement,
			},
		];
	}

	add(parentId, advancement)
	{
		++this.id;
		++this.iTab;
		this.tree[this.iTab] = {
			id: this.id,
			parentId,
			advancement,
		};
		return (this.id);
	}

	remove(id)
	{
		this.tree.forEach((element) =>
		{
			if (element.id === id)
				console.log(element);
		});
	}
}

const Tree = new TreeJson(); // eslint-disable-line

class Json
{
	constructor()
	{
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
		const LIST = document.querySelectorAll('ul[id="edition-zone-template"] > li');
		for (const ListItem of LIST)
			switch (ListItem.querySelector('div.uk-accordion-content').id)
			{
				default:
				case 'edit-root':
					this.root(ListItem.querySelector('div.uk-accordion-content'));
					break;
				case 'edit-meta':
					this.meta(ListItem.querySelector('div.uk-accordion-content'));
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
		console.log(this.json);
	}

	input(input)
	{
		if (!input.value)
			return undefined;
		switch (input.type.toLowerCase())
		{
			default:
			case 'string':
				if (!MCutilities.CheckIfStringIsLegalCharacter(String(input.value)))
					throw new Error(LANG.Data.Error.ContainIllegalCharacter);
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

	meta(ListItem)
	{
		const advancement = this.input(ListItem.querySelector('#edit-advancement-name'));
		console.log(advancement);
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
				this.json.display[type] = TitleModel;
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
		this.json.rewards.function = this.input(ListItem.querySelector('#edit-rewards-function'));
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
		MCsearch.blocksItems(document.getElementById('edit-display-icon'), Mapcraft.GetConfig().Minecraft.SelectedVersion);
		this.addTrigger();
		this.addRequirement();
		this.addRecipe();
		this.addLootTable();
		document.getElementById('content').querySelector('#generate-json').addEventListener('click', () =>
		{
			const json = new Json();
			json.generate();
		});
	}

	static addTrigger()
	{
		const TriggerList = document.getElementById('edit-criteria-list');
		let GenerateID = 1;
		document.getElementById('edit-criteria-add-trigger').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			const DOMelement = document.createElement('div');
			TEMPLATE.render(DOMelement, 'criteria.tp', { ID: GenerateID, DefaultValue: `default_${randomString()}` });
			DOMelement.id = GenerateID;
			DOMelement.removeAttribute('tp');
			DOMelement.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			const SearchID = MCsearch.triggers(DOMelement.querySelector(`#edit-criteria-trigger-${GenerateID}`));
			const CriteriaForm = DOMelement.querySelector(`#edit-criteria-form-${GenerateID}`);
			DOMelement.querySelector(`#edit-criteria-name-${GenerateID}`).addEventListener('input', (eventName) =>
			{
				const defaultID = eventName.target.getAttribute('defaultId');
				console.log(defaultID, eventName.target.value);
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
			++GenerateID;
			this.regenerateRequirementList();
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
