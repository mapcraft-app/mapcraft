const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const { MCipc, MClog, MCplugin } = require('mapcraft-api');
const importPlugins = require('../../js/importPlugins');

const Plugins = new MCplugin();

//#region Set ContextBridge
contextBridge.exposeInMainWorld('api', {
	send: (channel, ...args) =>
	{
		MCipc.send(channel, ...args);
	},
	receive: (channel, func) =>
	{
		MCipc.receive(channel, func);
	},
});
//#endregion

//#region Log file
MClog.watchLog();
//#endregion

//#region Interface
function UpdateSelectedLi()
{
	document.querySelectorAll('#toogle-nav li').forEach((element) =>
	{
		if (element.id === localStorage.getItem('Mapcraft_Plugin'))
			element.childNodes[1].classList.add('nav-hover-element-selected');
		else
			element.childNodes[1].classList.remove('nav-hover-element-selected');
	});
}

function cleanSpecificRender(oldTemplate)
{
	const templateElement = `${oldTemplate.toLowerCase()}.tp`;
	const DOMelement = document.querySelectorAll(`[tp="${templateElement}"]`)[0];
	if (DOMelement && DOMelement.hasChildNodes())
		while (DOMelement.firstChild)
			DOMelement.removeChild(DOMelement.firstChild);
}

function UpdateInterface(plugin, name)
{
	/**
	 * This setImmediate is present for a simple reason, it allows when a
	 * plugin is very heavy to save very often some seconds of rendering
	 * on the DOM.
	 * It also allows when a plugin is badly optimized to avoid seeing it
	 * too much.
	 * So it should not be removed under any circumstances, unless a
	 * better solution is found in the meantime.
	 */
	setImmediate(() =>
	{
		const cleanNode = (node, removeParent = false) =>
		{
			if (node && node.hasChildNodes())
				while (node.firstChild)
					node.removeChild(node.firstChild);
			if (removeParent)
				node.remove();
		};
		cleanSpecificRender(localStorage.getItem('Mapcraft_Plugin'));
		cleanNode(document.querySelector('html > body > div[id="content"]'), false);
		const navTitle = document.getElementById('nav-title');
		if (navTitle.childNodes[0])
			navTitle.childNodes[0].remove();
		navTitle.appendChild(document.createTextNode(name));
		const Component = Plugins.component(plugin);
		const PluginsComponent = importPlugins.component(plugin);
		if (!Component && !PluginsComponent)
		{
			console.warn(`No plugin named ${plugin} exist with is name`);
			return;
		}
		if (Component)
			Component.instance.main();
		else
			PluginsComponent.instance.main();
		localStorage.setItem('Mapcraft_Plugin', plugin);
		UpdateSelectedLi();
	});
}

MCipc.receive('Plugin:update-interface', (plugin, name) => UpdateInterface(plugin, name));
//#endregion

//#region Shell system
const capitalize = (s) =>
{
	if (typeof s !== 'string')
		return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

function PrintNotification(Title, Body, Icon)
{
	const options = {
		title: `Mapcraft - ${Title}`,
		body: Body,
		icon: Icon,
	};
	const Notif = new Notification(options.title, options);
	Notif.addEventListener('click', () => MCipc.send('Notification:click-notification'));
}

MCipc.receive('Shell:new-command', (command) =>
{
	if (command.Player !== JSON.parse(localStorage.getItem('Mapcraft_User')).Username)
		return;
	const plugin = capitalize(command.Command);
	const Component = Plugins.component(plugin);
	const PluginsComponent = importPlugins.component(command.UUID);
	if (Component && Plugins.active(plugin) === true)
	{
		const LANG = Plugins.lang(plugin);
		if (Component.IsNotification)
			PrintNotification(LANG.Title, LANG.Notification, path.join(__dirname, '../../img/icon/icon.png'));
		UpdateInterface(plugin, LANG.Title);
	}
	else if (PluginsComponent && PluginsComponent.active)
	{
		const LANG = importPlugins.lang(command.UUID);
		if (PluginsComponent.isNotification)
		{
			//eslint-disable-next-line
			const manifest = require(path.join(PluginsComponent.directory, 'manifest.json'));
			const icon = path.join(PluginsComponent.directory, manifest.icon);
			fs.stat(icon, (err) =>
			{
				if (err)
					PrintNotification(LANG.Title, LANG.Notification, path.join(__dirname, '../../img/icon/icon.png'));
				else
					PrintNotification(LANG.Title, LANG.Notification, icon);
			});
		}
		UpdateInterface(command.UUID, LANG.Title);
	}
	else
	{
		console.error('No plugin exist with is name');
		return;
	}
	MCipc.send('Shell:send-command', command);
});
//#endregion

//#region Username system
function blurWindow()
{
	document.documentElement.classList.toggle('html-blur');
	document.body.classList.toggle('body-blur');
}

function changeUsername()
{
	blurWindow();
	const { Username } = JSON.parse(localStorage.getItem('Mapcraft_User'));
	const { DBPath } = JSON.parse(localStorage.getItem('Mapcraft'));
	localStorage.removeItem('Mapcraft_User');
	const db = Database(DBPath);
	const sql = db.prepare('UPDATE User SET IsConnected = 0 WHERE Username = ?');
	sql.run(Username);
	MCipc.send('User:change-username');
}
//#endregion

//#region Main
window.addEventListener('DOMContentLoaded', () =>
{
	blurWindow();
	Plugins.instance('Main').main();
	MCipc.send('Plugin:is-changed', localStorage.getItem('Mapcraft_Plugin'), Plugins.default().Title);
	MCipc.receive('User:remove-blur', () =>
	{
		blurWindow();
		MCipc.send('Update:create-modal');
		Plugins.instance('Main').header();
		/**
		 * If option plugin is open, reload user table for correct info
		 */
		if (localStorage.getItem('Mapcraft_Plugin') && localStorage.getItem('Mapcraft_Plugin') === 'Option')
			Plugins.instance('Option').RedrawUserTab();
		document.getElementById('nav-header-change-username').addEventListener('click', () => changeUsername());
	});
	MCipc.receive('Log:send-change', (fullFile) => MClog.printToTextArea(fullFile));
});
//#endregion
