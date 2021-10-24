const fs = require('fs');
const path = require('path');
const { shell } = require('electron');
const IPC = require('mapcraft-api').MCipc;
const MC = require('mapcraft-api').Mapcraft;
const MCP = require('mapcraft-api').MCplugin;
const Temp = require('mapcraft-api').MCtemplate;

const MCplugin = new MCP();
const Template = new Temp(__dirname);

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
			IPC.send('Plugin:is-changed', element.id, element.getAttribute('title'));
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
	static main()
	{
		Template.render(document.body, 'main.tp', null);
	}

	static header()
	{
		const User = JSON.parse(localStorage.getItem('Mapcraft_User'));
		Template.render(document.getElementById('nav-header'), 'header.tp', { Username: User.Username, Link: `https://crafatar.com/avatars/${User.UUID}?size=80` });
		Template.updateLang(document.getElementById('nav-header'), MCplugin.Lang('Main'));
		document.getElementById('documentation-link').href = `https://documentation.mapcraft.app/?${MC.GetConfig().Env.Lang}`;
		OpenExternLink();
	}

	static nav()
	{
		Template.render(document.getElementById('toogle-nav'), 'nav.tp', null);
	}

	static list()
	{
		let HTML = '';
		const Component = Template.getRaw('nav.tp');
		const Plugins = JSON.parse(fs.readFileSync(path.join(__dirname, '../../components.json')), 'utf-8');
		for (const i in Plugins)
			if (Plugins[i].Name !== '__DEFAULT' && Plugins[i].Name !== 'Main' && (typeof Plugins[i].Using === 'undefined' || Plugins[i].Using === true))
			{
				const LANG = MCplugin.Lang(Plugins[i].Name);
				HTML += Template.parseRaw(Component, { id: Plugins[i].Name, title: LANG.Title, icon: LANG.Icon });
			}
		Template.renderRaw(document.getElementById('toogle-nav'), HTML, 'nav.tp', null);
		document.querySelectorAll('#toogle-nav li').forEach((element) =>
		{
			if (element.id === localStorage.getItem('Mapcraft_Plugin'))
				element.childNodes[1].classList.add('nav-hover-element-selected');
		});
		DetectClickOnElement();
	}

	static Editor()
	{
		Template.updateLang(document.getElementById('ModalEditFile'), MCplugin.Lang('Main'));
	}

	/*Interface for component */
	static draw()
	{
		this.main();
		this.nav();
		this.list();
		Template.updateLang(document.getElementsByTagName('*'), MCplugin.Lang('Main'));
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
