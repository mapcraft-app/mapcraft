const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');
const MODELS = require('./model');

const __FORM = require('../../../../res/__FORM');
const __SEARCH = require('../../../../res/__SEARCH');

const LANG = MCutilities.GetLang(__dirname, Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(__dirname);

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
		//SEARCH.__SEARCH_BLOCKS(document.getElementById('ezfjkerizjfkerz'));
		//document.getElementById('de748efz147ezde').appendChild(FORM.__FORM_ITEM());
		this.addTrigger();
	}

	static addTrigger()
	{
		const TriggerList = document.getElementById('edit-criteria-list');
		let GenerateID = 1;
		document.getElementById('edit-criteria-add-trigger').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			const DOMelement = document.createElement('div');
			DOMelement.id = GenerateID;
			DOMelement.classList.add('edit-block');
			DOMelement.innerHTML = MODELS.criteria(GenerateID);
			const SearchID = __SEARCH.__SEARCH_TRIGGER(DOMelement.querySelector(`#edit-criteria-trigger-${GenerateID}`));
			const CriteriaForm = DOMelement.querySelector(`#edit-criteria-form-${GenerateID}`);
			DOMelement.querySelector(`#search-dropdown-${SearchID}`).addEventListener('input', (eventForm) =>
			{
				const FORM = __FORM.__FORM_TRIGGER(eventForm.target.value);
				if (FORM)
					CriteriaForm.innerHTML = FORM.outerHTML;
				else
					CriteriaForm.innerHTML = '';
			});
			TriggerList.appendChild(DOMelement);
			TEMPLATE.updateLang(TriggerList, LANG.Data);
			++GenerateID;
		});
	}
}

module.exports = Component;
