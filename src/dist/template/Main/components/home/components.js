const fs = require('fs');
const path = require('path');
const { Mapcraft } = require('mapcraft-api');
const IPC = require('mapcraft-api').MCipc;
const Temp = require('mapcraft-api').MCtemplate;
const MCP = require('mapcraft-api').MCplugin;
const ImPlugins = require('../../../../js/importPlugins');

const Template = new Temp(__dirname);
const MCplugin = new MCP();
const ImportPlugins = new ImPlugins();

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
		let ExternPlugins;
		try
		{
			Plugins = JSON.parse(fs.readFileSync(path.join(__dirname, '../../components.json')), 'utf-8');
			ExternPlugins = JSON.parse(fs.readFileSync(path.join(Mapcraft.GetConfig().Env.PluginsComponents, 'components.json')), 'utf-8');
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
		for (const i in ExternPlugins)
			if (typeof ExternPlugins[i].using === 'undefined' || ExternPlugins[i].using === true)
			{
				const LANG = ImportPlugins.Lang(ExternPlugins[i].name);
				HTML += Template.parseRaw(Component, { id: ExternPlugins[i].name, title: LANG.Title, icon: LANG.Icon });
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
