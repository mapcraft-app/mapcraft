const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');

const Template = new MCtemplate(__dirname);
let LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);

class Component
{
	/*Component*/
	static getLang()
	{
		LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
		return LANG;
	}

	static main()
	{
		Template.render(document.body, 'main.tp', null);
	}

	static draw()
	{
		LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
		this.main();
		Template.updateLang(document.body, LANG);
	}

	static cleanNode(node, RemoveParent)
	{
		Template.cleanNode(node, RemoveParent);
	}
}

module.exports = Component;
