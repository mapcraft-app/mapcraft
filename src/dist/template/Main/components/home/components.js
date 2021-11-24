const IPC = require('mapcraft-api').MCipc;
const Temp = require('mapcraft-api').MCtemplate;
const NavMenu = require('../../../../js/createNavMenu');

const Template = new Temp(__dirname);

function DetectClickOnElement()
{
	document.querySelectorAll('#main-selection-list li').forEach((element) =>
	{
		element.addEventListener('click', () =>
		{
			IPC.send('Plugin:is-changed', element.id, element.getAttribute('title'));
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
