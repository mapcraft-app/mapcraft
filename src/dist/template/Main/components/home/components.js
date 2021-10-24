const fs = require('fs');
const path = require('path');
const IPC = require('mapcraft-api').MCipc;
const Temp = require('mapcraft-api').MCtemplate;
const MCP = require('mapcraft-api').MCplugin;

const Template = new Temp(__dirname);
const MCplugin = new MCP();

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
		let HTML = '';
		const Component = Template.getRaw('list.tp');
		let Plugins;
		try
		{
			Plugins = JSON.parse(fs.readFileSync(path.join(__dirname, '../../components.json')), 'utf-8');
		}
		catch (err)
		{
			throw new Error(err);
		}
		for (const i in Plugins)
			if (Plugins[i].Name !== '__DEFAULT' && Plugins[i].Name !== 'Main' && Plugins[i].Name !== 'Home' && (typeof Plugins[i].Using === 'undefined' || Plugins[i].Using === true))
			{
				const LANG = MCplugin.Lang(Plugins[i].Name);
				HTML += Template.parseRaw(Component, { id: Plugins[i].Name, title: LANG.Title, icon: LANG.Icon });
			}
		Template.renderRaw(document.getElementById('main-selection-list'), HTML, 'list.tp', null);
		DetectClickOnElement();
	}

	/*Interface for component */
	static draw()
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
