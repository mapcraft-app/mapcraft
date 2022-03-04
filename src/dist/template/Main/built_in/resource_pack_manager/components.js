const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');
const path = require('path');

const LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
const TEMPLATE = new MCtemplate(path.join(__dirname, 'template'));

class Component
{
	static main()
	{
		TEMPLATE.render(document.getElementById('content'), 'resource_pack_manager.tp', LANG.Data);
	}
}

module.exports = Component;
