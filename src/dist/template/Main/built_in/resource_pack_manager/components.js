const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');
const path = require('path');

const LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
const TEMPLATE = new MCtemplate(path.join(__dirname, 'template'));
// const MAPCRAFT_LOCAL = JSON.parse(localStorage.getItem('Mapcraft'));
let CONTENT;

class Component
{
	static main()
	{
		CONTENT = document.getElementById('content');
		TEMPLATE.render(CONTENT, 'resource_pack_manager.tp', LANG.Data);
		this.sidebar();
	}

	static sidebar()
	{
		const EL = CONTENT.querySelector('.sidebar > ul');
		const LIST = document.createElement('ul');
		for (const el in LANG.Data)
			if (Object.prototype.hasOwnProperty.call(LANG.Data, el))
				TEMPLATE.render(
					LIST,
					'sidebar_li.tp',
					{
						id: el,
						title: LANG.Data[el].Title,
						icon: LANG.Data[el].Icon,
					},
				);
		TEMPLATE.renderRaw(EL, LIST.innerHTML, 'sidebar_li.tp', null);
		EL.addEventListener('click', (e) =>
		{
			e.preventDefault();
			let { target } = e;
			while (target.nodeName !== 'LI')
				target = target.parentNode;
			TEMPLATE.cleanNode(CONTENT.querySelector('.content'));
			TEMPLATE.render(CONTENT.querySelector('.content'), `${target.getAttribute('id')}.tp`, LANG.Data[target.getAttribute('id')]);
			console.log(LANG.Data[target.getAttribute('id')]);
		});
	}
}

module.exports = Component;
