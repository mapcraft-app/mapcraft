const { contextBridge } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const { MCipc, MClog, MCplugin } = require('mapcraft-api');
const _importPlugins = require('../../js/importPlugins');

const Plugins = new MCplugin();
const importPlugins = new _importPlugins();

//#region Set ContextBridge
contextBridge.exposeInMainWorld(
	'api', {
		send: (channel, ...args) =>
		{
			MCipc.send(channel, ...args);
		},
		receive: (channel, func) =>
		{
			MCipc.receive(channel, func);
		},
	},
);
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
	cleanSpecificRender(localStorage.getItem('Mapcraft_Plugin'));
	const navTitle = document.getElementById('nav-title');
	if (navTitle.childNodes[0])
		navTitle.childNodes[0].remove();
	navTitle.appendChild(document.createTextNode(name));
	const Component = Plugins.Component(plugin);
	const PluginsComponent = importPlugins.Component(plugin);
	if (!Component && !PluginsComponent)
	{
		console.error('No plugin exist with is name');
		return;
	}
	if (Component)
		Component.Instance.draw();
	else
		PluginsComponent.instance.main();
	localStorage.setItem('Mapcraft_Plugin', plugin);
	UpdateSelectedLi();
}

MCipc.receive('Plugin:update-interface', (plugin, name) =>
{
	UpdateInterface(plugin, name);
});
//#endregion

//#region Shell system
const capitalize = (s) =>
{
	if (typeof s !== 'string')
		return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

function PrintNotification(Title, Body)
{
	const options = {
		title: `Mapcraft - ${Title}`,
		body: Body,
		icon: path.join(__dirname, '../../img/icon/icon.png'),
	};
	const Notif = new Notification(options.title, options);
	Notif.onclick = () =>
	{
		MCipc.send('Notification:click-notification');
	};
}

MCipc.receive('Shell:new-command', (command) =>
{
	if (command.Player !== JSON.parse(localStorage.getItem('Mapcraft_User')).Username)
		return;
	const plugin = capitalize(command.Command);
	const Component = Plugins.Component(plugin);
	if (!Component)
	{
		console.error('No plugin exist with is name');
		return;
	}
	const LANG = Plugins.Lang(plugin);

	if (Component.IsNotification && (!Object.prototype.isPrototypeOf.call(command, 'NoNotification') || Object.prototype.isPrototypeOf.call(command, 'NoNotification')) && !command.NoNotification)
	{
		PrintNotification(LANG.Title, LANG.Notification);
		UpdateInterface(plugin, LANG.Title);
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
	Plugins.Instance('Main').draw();
	MCipc.send('Plugin:is-changed', localStorage.getItem('Mapcraft_Plugin'), Plugins.Default().Title);
	MCipc.receive('User:remove-blur', () =>
	{
		blurWindow();
		MCipc.send('Update:create-modal');
		Plugins.Instance('Main').header();
		/*If option plugin is open, reload user table for correct info */
		if (localStorage.getItem('Mapcraft_Plugin') && localStorage.getItem('Mapcraft_Plugin') === 'Option')
			Plugins.Instance('Option').RedrawUserTab();
		document.getElementById('nav-header-change-username').addEventListener('click', () =>
		{
			changeUsername();
		});
	});
	MCipc.receive('Log:send-change', (fullFile) =>
	{
		MClog.PrintToTextArea(fullFile);
	});
});
//#endregion
