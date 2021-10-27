const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');

const LANG = MCutilities.GetLang(__dirname, Mapcraft.GetConfig().Env.Lang);
const TEMPLATE = new MCtemplate(__dirname);

class Component
{
	static main()
	{
		TEMPLATE.render(document.getElementById('content'), 'store.tp', LANG.Data);
	}
}

module.exports = Component;
