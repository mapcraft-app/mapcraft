const { shell } = require('electron');
const { Mapcraft, MCplugin, MCtemplate, MCipc } = require('mapcraft-api');
const NavMenu = require('../../../../js/createNavMenu');

const Plugins = new MCplugin();
const Template = new MCtemplate(__dirname);

function UpdateSelectedLi(currentElement)
{
	document.querySelectorAll('#toogle-nav li').forEach((element) =>
	{
		element.childNodes[1].classList.remove('nav-hover-element-selected');
	});
	currentElement.childNodes[1].classList.add('nav-hover-element-selected');
}

function DetectClickOnElement()
{
	document.querySelectorAll('#toogle-nav li').forEach((element) =>
	{
		element.addEventListener('click', () =>
		{
			UpdateSelectedLi(element);
			MCipc.send('Plugin:is-changed', element.id, element.getAttribute('title'));
		});
	});
}

function OpenExternLink()
{
	const link = document.getElementById('documentation-link');
	const url = link.getAttribute('href');
	if (url.indexOf('http') === 0)
		link.addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			shell.openExternal(url);
		});
}

class MainComponent
{
	static _main()
	{
		Template.render(document.body, 'main.tp', null);
	}

	static header()
	{
		const User = JSON.parse(localStorage.getItem('Mapcraft_User'));
		Template.render(document.getElementById('nav-header'), 'header.tp', { Username: User.Username, Link: `https://crafatar.com/avatars/${User.UUID}?size=80` });
		Template.updateLang(document.getElementById('nav-header'), Plugins.lang('Main'));
		document.getElementById('documentation-link').href = `https://documentation.mapcraft.app/?${Mapcraft.config.Env.Lang}`;
		OpenExternLink();
	}

	static nav()
	{
		Template.render(document.getElementById('toogle-nav'), 'nav.tp', null);
	}

	static list()
	{
		NavMenu.CreateNavMenu(document.getElementById('toogle-nav'), 'nav.tp');
		DetectClickOnElement();
	}

	static Editor()
	{
		Template.updateLang(document.getElementById('ModalEditFile'), Plugins.lang('Main'));
	}

	/*Interface for component */
	static main()
	{
		this._main();
		this.nav();
		this.list();
		Template.updateLang(document.getElementsByTagName('*'), Plugins.lang('Main'));
	}

	static redrawElement()
	{
		document.querySelectorAll('#toogle-nav li').forEach((event) =>
		{
			event.removeEventListener();
		});
		this.list();
	}
}

module.exports = MainComponent;
