const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');
const path = require('path');

const LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
const TEMPLATE = new MCtemplate(path.join(__dirname, 'template'));
// const MAPCRAFT_LOCAL = JSON.parse(localStorage.getItem('Mapcraft'));
const PLUGINS = [];
let CURRENT_PLUGIN;
let CURRENT_ID;

class Component
{
	static main()
	{
		TEMPLATE.render(document.getElementById('content'), 'resource_pack_manager.tp', LANG.Data);
		this.sidebar();
	}

	static sidebar()
	{
		const EL = document.querySelector('#res-sidebar > ul');
		const LIST = document.createElement('ul');
		for (const el in LANG.Data)
			if (Object.prototype.hasOwnProperty.call(LANG.Data, el))
			{
				TEMPLATE.render(
					LIST,
					'sidebar_li.tp',
					{
						id: el,
						title: LANG.Data[el].Title,
						icon: LANG.Data[el].Icon,
					},
				);
				PLUGINS.push({
					id: LANG.Data[el].Title,
					// eslint-disable-next-line
					Instance: require(path.join(__dirname, 'plugins', LANG.Data[el].Title)),
				});
			}
		TEMPLATE.renderRaw(EL, LIST.innerHTML, 'sidebar_li.tp', null);
		EL.addEventListener('click', (e) =>
		{
			e.preventDefault();
			let { target } = e;
			if (target.nodeName === 'UL')
				return;
			while (target.nodeName !== 'LI')
				target = target.parentNode;
			if (CURRENT_ID === target.getAttribute('id'))
				return;
			TEMPLATE.cleanNode(document.getElementById('res-content'));
			TEMPLATE.render(document.getElementById('res-content'), `${target.getAttribute('id')}.tp`, LANG.Data[target.getAttribute('id')]);
			if (CURRENT_PLUGIN)
				CURRENT_PLUGIN.destructor();
			for (const funct of PLUGINS)
				if (funct.id === target.getAttribute('id'))
				{
					CURRENT_ID = funct.id;
					CURRENT_PLUGIN = new funct.Instance();
					break;
				}
		});
	}
}

module.exports = Component;
