const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');

const LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
const TEMPLATE = new MCtemplate(__dirname);

class Component
{
	static main()
	{
		TEMPLATE.render(document.getElementById('content'), 'store.tp', LANG.Data);
	}
}

module.exports = Component;
