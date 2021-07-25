const { contextBridge } = require('electron');
const path = require('path');
const IPC = require('../../js/MCipc');
const MClog = require('../../js/MClog');
const User = require('../../js/MCuser');
const MCP = require('../../js/MCplugin'), MCplugin = new MCP();

//#region Set ContextBridge
contextBridge.exposeInMainWorld(
	"api", {
		send: (channel, ...args) => {
			IPC.send(channel, ...args);
		},
		receive: (channel, func) => {
			IPC.receive(channel, func);
		}
	}
);
//#endregion

//#region Log file
MClog.watchLog();
//#endregion

//#region Shell system
const capitalize = (s) => {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function PrintNotification(Title, Body)
{
	const options = {
		title: 'Mapcraft - ' + Title,
		body: Body,
		icon: path.join(__dirname, '../../img/icon/icon.png')
	};
	const Notif = new Notification(options.title, options);
	Notif.onclick = () => {
		IPC.send('Notification:click-notification');
	};
}

IPC.receive('Shell:new-command', (command) => {
	if (command.Player !== JSON.parse(localStorage.getItem('Mapcraft_User')).Username)
		return ;
	let plugin = capitalize(command.Command);
	let Component = MCplugin.Component(plugin);
	if (!Component)
	{
		console.error('No plugin exist with is name');
		return ;
	}
	let LANG = MCplugin.Lang(plugin);
	if (Component.IsNotification && (!command.hasOwnProperty('NoNotification') || command.hasOwnProperty('NoNotification') && !command.NoNotification))
	{
		PrintNotification(LANG.Title, LANG.Notification);
		UpdateInterface(plugin, LANG.Title);
	}
	IPC.send('Shell:send-command', command);
});
//#endregion

//#region Interface
function UpdateInterface(plugin, name)
{
	cleanSpecificRender(localStorage.getItem('Mapcraft_Plugin'));
	let navTitle = document.getElementById('nav-title');
	if (navTitle.childNodes[0])
		navTitle.childNodes[0].remove();
	navTitle.appendChild(document.createTextNode(name));
	const Component = MCplugin.Component(plugin);
	if (!Component)
	{
		console.error('No plugin exist with is name');
		return ;
	}
	Component.Instance.draw();
	localStorage.setItem('Mapcraft_Plugin', plugin);
	UpdateSelectedLi();
}

function UpdateSelectedLi()
{
	document.querySelectorAll('#toogle-nav li').forEach((element) => {
		if (element.id === localStorage.getItem('Mapcraft_Plugin'))
			element.childNodes[1].classList.add('nav-hover-element-selected');
		else
			element.childNodes[1].classList.remove('nav-hover-element-selected');
		
	});
}

function cleanSpecificRender(oldTemplate)
{
	let templateElement = oldTemplate.toLowerCase() + '.tp';
	let DOMelement = document.querySelectorAll('[tp="'+ templateElement +'"]')[0];
	if (DOMelement && DOMelement.hasChildNodes())
	{
		while (DOMelement.firstChild) {
			DOMelement.removeChild(DOMelement.firstChild);
		}
	}
}

IPC.receive('Plugin:update-interface', (plugin, name) => {
	UpdateInterface(plugin, name);
});
//#endregion

//#region Username system
function changeUsername()
{
	localStorage.removeItem('Mapcraft_User');
	blurWindow();
	User.disconnected();
	IPC.send('User:change-username');
}
//#endregion

//#region Main
function blurWindow()
{
	document.documentElement.classList.toggle('html-blur');
	document.body.classList.toggle('body-blur');
}

window.addEventListener('DOMContentLoaded', () => {
	blurWindow();
	MCplugin.Instance('Main').draw();
	IPC.send('Plugin:is-changed', localStorage.getItem('Mapcraft_Plugin'), MCplugin.Default().Title);
	IPC.receive('User:remove-blur', () => {
		blurWindow();
		MCplugin.Instance('Main').header();
		/* If option plugin is open, reload user table for correct info */
		if (localStorage.getItem('Mapcraft_Plugin') && localStorage.getItem('Mapcraft_Plugin') === 'Option')
			MCplugin.Instance('Option').RedrawUserTab();
		document.getElementById('nav-header-change-username').addEventListener('click', () => {
			changeUsername();
		});
	});
	IPC.receive('Log:send-change', (fullFile, newData) => {
		MClog.PrintToTextArea(fullFile);
	});
});
//#endregion
