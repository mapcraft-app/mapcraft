const { shell } = require('electron');
const { Mapcraft, MCutilities, MCtemplate, MCsearch } = require('mapcraft-api');
const MODELS = require('./model');
const Form = require('./form/form');

const LANG = MCutilities.GetLang(__dirname, Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(__dirname);

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

class Component
{
	static main()
	{
		TEMPLATE.render(document.getElementById('content'), 'advancement.tp', null);
		TEMPLATE.render(document.getElementById('edition-zone-template'), 'edit.tp', null);
		TEMPLATE.updateLang(document.getElementById('edition-zone'), LANG.Data);
		this.addTrigger();
		this.addRecipe();
		this.addLootTable();
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
			TEMPLATE.render(DOMelement, 'criteria.tp', { ID: GenerateID });
			DOMelement.id = GenerateID;
			DOMelement.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			const SearchID = MCsearch.triggers(DOMelement.querySelector(`#edit-criteria-trigger-${GenerateID}`));
			const CriteriaForm = DOMelement.querySelector(`#edit-criteria-form-${GenerateID}`);
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
			DOMelement.querySelector(`#edit-criteria-close-${GenerateID}`).addEventListener('click', () => DOMelement.remove());
			TriggerList.appendChild(DOMelement);
			TEMPLATE.updateLang(TriggerList, LANG.Data);
			++GenerateID;
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
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-reward-loot-close').addEventListener('click', () => MODEL.remove());
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
			MODEL.classList.add('edit-block', 'margin-criteria-list-element', 'edit-block-criteria');
			MODEL.querySelector('#edit-reward-loot-close').addEventListener('click', () => MODEL.remove());
			document.getElementById('edit-rewards-loottables-list').appendChild(MODEL);
		});
	}
}

module.exports = Component;
