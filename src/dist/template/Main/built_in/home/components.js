const path = require('path');
const { MCipc, MCtemplate } = require('mapcraft-api');
const NavMenu = require(path.join(globalThis.src.js, 'createNavMenu'));

const Template = new MCtemplate(__dirname);

function DetectClickOnElement()
{
	document.querySelectorAll('#main-selection-list li').forEach((element) =>
	{
		element.addEventListener('click', () =>
		{
			MCipc.send('Plugin:is-changed', element.id, element.getAttribute('title'));
		});
	});
}

class HomeComponent
{
	static content()
	{
		Template.render(document.getElementById('content'), 'home.tp', null);
	}

	static list()
	{
		NavMenu.CreateNavMenu(document.getElementById('main-selection-list'), 'list.tp', true);
		DetectClickOnElement();
	}

	/*Interface for component */
	static main()
	{
		this.content();
		this.list();
	}

	static redrawElement()
	{
		document.querySelectorAll('#main-selection-list li').forEach((event) =>
		{
			event.removeEventListener();
		});
		this.list();
	}
}

module.exports = HomeComponent;
