const MC = require('../../js/Mapcraft');
const MCutilities = require('../../js/MCutilities');
const Temp = require('../../js/MCtemplate');

const Template = new Temp(__dirname);

let LANG = MCutilities.GetLang(__dirname, MC.GetConfig().Env.Lang);

class Component
{
	/*Component*/
	static getLang()
	{
		LANG = MCutilities.GetLang(__dirname, MC.GetConfig().Env.Lang);
		return LANG;
	}

	static main()
	{
		Template.render(document.body, 'main.tp', null);
	}

	static draw()
	{
		LANG = MCutilities.GetLang(__dirname, MC.GetConfig().Env.Lang);
		this.main();
		Template.updateLang(document.body, LANG);
	}

	static cleanNode(node, RemoveParent)
	{
		Template.cleanNode(node, RemoveParent);
	}
}

module.exports = Component;
