const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');
const MCeditor = require('../../../../js/editor');
const MODELS = require('./model');

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

const Tree = new TreeJson();

class Component
{
	static main()
	{
		TEMPLATE.render(document.getElementById('content'), 'advancement.tp', null);
		TEMPLATE.render(document.getElementById('edition-zone'), 'edit.tp', null);
		TEMPLATE.updateLang(document.getElementById('edition-zone'), LANG.Data);
		const EditorDisplayTitle = new MCeditor(document.getElementById('edit-display-title'));
		const EditorDisplayDescription = new MCeditor(document.getElementById('edit-display-description'));
	}
}

module.exports = Component;
