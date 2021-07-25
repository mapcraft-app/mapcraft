const fs = require('fs');
const path = require('path');
const { shell } = require('electron');
const Database = require('better-sqlite3');
const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const https = require('https');

const MC = require('../../../../js/Mapcraft');
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);
const IPC = require('../../../../js/MCipc');
const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();

var Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
var LANG; UpdateLang();
function UpdateLang()
{
	LANG = MCplugin.Lang('Option');
}

const WorkProgress = {
	open: () => {
		IPC.send('WorkProgress:signal-open-modal');
	},
	close: () => {
		IPC.send('WorkProgress:signal-close-modal');
	}
}

//#region General function
function CreateAlert(type, DOMelement, str)
{
	let alert = document.createElement('div');
	alert.classList.add('uk-alert-' + type);
	alert.setAttribute('uk-alert', '');
	let closeButton = document.createElement('a');
	closeButton.classList.add('uk-alert-close');
	closeButton.setAttribute('uk-close', '');
	let text = document.createElement('p').appendChild(document.createTextNode(str));
	alert.appendChild(closeButton);
	alert.appendChild(text);
	DOMelement.appendChild(alert);
}
//#endregion

//#region General tab
class OptionComponent
{
	static main()
	{
		UpdateLang();
		let str = 'option.tp';
		Template.render(document.getElementById('content'), str, { GeneralIcon: LANG.Data.Menu.GeneralIcon, UserIcon: LANG.Data.Menu.UserIcon, AboutIcon: LANG.Data.Menu.AboutIcon });
		this.UpdateLangComponent(str);
	}
	static general()
	{
		let str = 'general.tp';
		Template.render(document.getElementById('option-tab-general'), str, null);

		/* Generate Form */
		let HTML = '';
		let ComponentInput = Template.getRaw('general_input.tp');
		let ComponentResource = Template.getRaw('general_resource.tp');
		let ComponentData = Template.getRaw('general_data.tp');
		HTML += Template.parseRaw(ComponentInput, {for: 'TempPath', id:'option-TempPath', text:'TagTemp', path: MC.GetConfig().Env.TempPath});
		HTML += Template.parseRaw(ComponentInput, {for: 'GamePath', id:'option-GamePath', text:'TagGame', path: MC.GetConfig().Env.GamePath});
		HTML += Template.parseRaw(ComponentInput, {for: 'SavePath', id:'option-SavePath', text:'TagSave', path: MC.GetConfig().Env.SavePath});

		let SaveName = JSON.parse(localStorage.getItem('Mapcraft')).Name + '-';
		HTML += Template.parseRaw(ComponentResource, {Name: SaveName, for: 'ResourcePath', id:'option-ResourcePath', text:'TagResource', path: MC.GetConfig().Data.ResourcePack});
		HTML += Template.parseRaw(ComponentData, {Name: SaveName, for: 'DataPath', id:'option-DataPath', text:'TagData', path: MC.GetConfig().Data.DataPack});

		Template.renderRaw(document.getElementById('option-general-path'), HTML, 'general_input.tp', null);

		HTML = '';
		let ComponentLang = Template.getRaw('general_lang.tp');
		let JsonLangList = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../../lang.json'), 'utf-8'));
		for (let i in JsonLangList)
			HTML += Template.parseRaw(ComponentLang, {Code:i, Lang:JsonLangList[i]});
		Template.renderRaw(document.getElementById('option-Lang'), HTML, 'general_lang.tp', null);
		this.UpdateLangComponent(str);
		this.setSelectLang();
		DetectClick();
	}
	static setSelectLang()
	{
		let DOM = document.getElementById('option-Lang');
		for (let i = 0, length = DOM.length; i < length; i++) {
			if (DOM[i].value === MC.GetConfig().Env.Lang)
				DOM[i].setAttribute('selected', null);
			else if (DOM[i].hasAttribute('selected'))
				DOM[i].removeAttribute('selected');
		}
	}
	static draw()
	{
		this.main();
		this.general();
		AboutComponent.about();
		UserComponent.main();
	}
	static UpdateLangComponent(Component)
	{
		switch (Component)
		{
			case 'option.tp':
				Template.updateLang(document.getElementById('option-menu'), LANG.Data.Menu);
				break ;
			case 'general.tp':
				Template.updateLang(document.getElementById('option-tab-general'), LANG.Data.General);
				break ;
		}
	}
	static RedrawInterface()
	{
		UpdateLang();
		// Header
		Template.updateLang(document.getElementById('nav-header'), MCplugin.Lang('Main'));
		Template.updateLang(document.getElementById('offcanvas-content'), MCplugin.Lang('Main'));
		// Side Nav
		const SideNav = () => {
			let HTML = '';
			let Component = Template.getRaw('../main/nav.tp');
			let Plugins;
			try { Plugins = JSON.parse(fs.readFileSync(path.join(__dirname, '../../components.json')), 'utf-8') }
			catch (err) { throw err }
			for (let i in Plugins)
			{
				if (Plugins[i].Name !== '__DEFAULT' && Plugins[i].Name !== 'Main' && (typeof Plugins[i].Using === 'undefined' || Plugins[i].Using === true))
				{
					const LANG = MCplugin.Lang(Plugins[i].Name);
					HTML += Template.parseRaw(Component, {id: Plugins[i].Name, title: LANG.Title, icon: LANG.Icon});
				}
			}
			Template.renderRaw(document.getElementById('toogle-nav'), HTML, 'nav.tp', null);
			document.querySelectorAll('#toogle-nav li').forEach((element) => {
				if (element.id === localStorage.getItem('Mapcraft_Plugin'))
					element.childNodes[1].classList.add('nav-hover-element-selected');
			});
			document.querySelectorAll('#toogle-nav li').forEach((element) => {
				element.addEventListener('click', () => {
					document.querySelectorAll('#toogle-nav li').forEach((elem) => {
						elem.childNodes[1].classList.remove('nav-hover-element-selected');
					});
					element.childNodes[1].classList.add('nav-hover-element-selected');
					IPC.send('Plugin:is-changed', element.id, element.getAttribute('title'));
				});
			});
		}; SideNav();
		// Editor
		Template.updateLang(document.getElementById('ModalEditFile'), MCplugin.Lang('Main'));
		
		this.UpdateLangComponent('option.tp');
		this.general();
		UserComponent.UpdateLangComponent('user.tp');
		CreateAlert('success', document.getElementById('option-error'), LANG.Data.General.Success);
	}
	static RedrawUserTab()
	{
		UserComponent.table();
	}
}

function DetectClick()
{
	/* Input */
	document.querySelector('#option-TempPath').addEventListener('click', () => {
		IPC.send('Dialog:open-directory', 'TempPath', document.getElementById('TempPath').value);
	});
	document.querySelector('#option-GamePath').addEventListener('click', () => {
		IPC.send('Dialog:open-directory', 'GamePath', document.getElementById('GamePath').value);
	});
	document.querySelector('#option-SavePath').addEventListener('click', () => {
		IPC.send('Dialog:open-directory', 'SavePath', document.getElementById('SavePath').value);
	});
	IPC.receive('Dialog:selected-directory', (data, element) => {
		if (data.canceled === false)
			document.getElementById(element).value = data.filePaths[0];
	});

	/* Lang */
	document.querySelector('#option-button-reset').addEventListener('click', () => {
		MC.ResetConfigFile();
		ChangeNameRessourcePack();
		OptionComponent.RedrawInterface();
	});
	document.querySelector('#option-button-save').addEventListener('click', () => {
		UpdateLang();
		if (!DirIsExist(document.getElementById('TempPath').value, LANG.Data.General.Error.DirectoryNotExist))
			return ;
		if (!DirIsExist(document.getElementById('GamePath').value, LANG.Data.General.Error.DirectoryNotExist))
			return ;
		if (!IsMinecraftDir(document.getElementById('GamePath').value))
			return ;
		if (!DirIsExist(document.getElementById('SavePath').value, LANG.Data.General.Error.DirectoryNotExist))
			return ;
		if (!IsSaveDir(document.getElementById('SavePath').value))
			return ;
		if (!IsCorrectString(document.getElementById('ResourcePath').value))
			return ;
		if (!IsCorrectString(document.getElementById('DataPath').value))
			return ;
		
		MC.UpdateConfig(document.getElementById('TempPath').value, document.getElementById('GamePath').value, document.getElementById('SavePath').value, document.getElementById('option-Lang').value, document.getElementById('ResourcePath').value, document.getElementById('DataPath').value);
		ChangeNameRessourcePack();
		OptionComponent.RedrawInterface();
	});
}

function ChangeNameRessourcePack()
{
	let Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
	let Name = Mapcraft.Name + '-' + MC.GetConfig().Data.ResourcePack;
	try {
		fs.renameSync(Mapcraft.Data.ResourcePack, path.join(MC.GetConfig().Env.SavePath, '../resourcepacks', Name));
		Mapcraft.Data.ResourcePack = path.join(MC.GetConfig().Env.SavePath, '../resourcepacks', Name);
		localStorage.setItem('Mapcraft', JSON.stringify(Mapcraft));
	} catch(err) {
		throw (err);
	}
}

function DirIsExist(link, Error)
{
	if (!fs.existsSync(link))
	{
		CreateAlert('warning', document.getElementById('option-error'), link.toString() + ': ' + Error);
		return (false);
	}
	return (true);
}

function IsMinecraftDir(link)
{
	if (!fs.existsSync(path.join(link, '/', 'versions')))
	{
		UpdateLang();
		CreateAlert('warning', document.getElementById('option-error'), LANG.Data.General.Error.NotMinecraftDirectory);
		return (false);
	}
	return (true);
}

function IsSaveDir(link)
{
	let TempSaveList = fs.readdirSync(link);
	let SavePath = document.getElementById('SavePath').value;
	for (let Save of TempSaveList)
	{
		let testIfDir = path.join(SavePath, '/', Save);
		if (fs.existsSync(testIfDir) && fs.lstatSync(testIfDir).isDirectory())
		{
			if (!fs.existsSync(path.join(testIfDir, '/icon.png')))
			{
				UpdateLang();
				CreateAlert('warning', document.getElementById('option-error'), LANG.Data.General.Error.NotMinecraftSaveDirectory);
				return (false);
			}
			else
				return (true);
		}
	}
}

function IsCorrectString(string)
{
	if (!string)
	{
		UpdateLang();
		CreateAlert('warning', document.getElementById('option-error'), string.toString() + ': ' + LANG.Data.General.Error.IncorrectString);
		return (false);
	}
	return (true);
}
//#endregion

//#region User tab
class UserComponent
{
	static main()
	{
		let str = 'user.tp';
		Template.render(document.getElementById('option-tab-user'), str, null);
		this.UpdateLangComponent(str);
		this.table();
		CreateUser();
	}
	static table()
	{
		UpdateLang();
		let HTML = '';
		let ComponentTable = Template.getRaw('user-table.tp');
		let Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		let sql = db.prepare('SELECT Username, UUID, IsConnected FROM User');
		for (let user of sql.iterate())
		{
			let Connect;
			let ClassConnect;
			let Disabled = '';
			if (user.IsConnected)
			{
				Connect = LANG.Data.User.Connected;
				ClassConnect = 'is-connected';
				Disabled = 'disabled';
			}
			else
			{
				Connect = LANG.Data.User.Disconnected;
				ClassConnect = 'is-not-connected';
			}
			HTML += Template.parseRaw(ComponentTable, {link: 'https://crafatar.com/avatars/'+ user.UUID +'?size=40', username: user.Username, Disabled:Disabled, ClassConnect: ClassConnect, Connect: Connect});
		}
		Template.renderRaw(document.getElementById('generateTab'), HTML, 'user-table.tp', null);
		db.close();
		DeleteOneUser();
		DeleteMultiUser();
	}
	static UpdateLangComponent(Component)
	{
		UpdateLang();
		switch (Component)
		{
			case 'user.tp':
				Template.updateLang(document.getElementById('option-tab-user'), LANG.Data.User);
				break ;
		}
	}
}

function DeleteOneUser()
{
	for (let input of document.querySelectorAll('button[name="user-button-delete"]'))
	{
		input.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			UpdateLang();
			WorkProgress.open();
			let username = input.parentNode.parentNode.childNodes[7].innerText;
			let db = Database(Mapcraft.DBPath, {verbose: console.log });
			/* Check if user is disconnected */
			const sqlUser = db.prepare('SELECT IsConnected FROM User WHERE Username = ?');
			let ret = sqlUser.get(username);
			if (ret.IsConnected)
			{
				CreateAlert('warning', document.getElementById('option-error'), LANG.Data.User.Error.UserIsConnected);
				WorkProgress.close();
				return ;
			}
			const sql = db.prepare('DELETE FROM User WHERE Username = ?');
			sql.run(username);
			db.close();
			UserComponent.table();
			WorkProgress.close();
		});
	}
}

function DeleteMultiUser()
{
	document.querySelector('#full-delete-tab').addEventListener('click', (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		WorkProgress.open();
		document.querySelector('#checkbox-user').checked = false;
		let db = Database(Mapcraft.DBPath, {verbose: console.log });
		let isDelete = false;
		const sql_Name = db.prepare('DELETE FROM User WHERE Username = ?');
		for (let input of document.querySelectorAll('input[name="select-user"]'))
		{
			if (input.checked && !input.disabled)
			{
				isDelete = true;
				sql_Name.run(input.value);
			}
		}
		if (isDelete)
			UserComponent.table();
		db.close();
		WorkProgress.close();
	});
}

function CreateUser()
{
	document.getElementById('form-createUser').addEventListener('submit', (event) => {
		event.preventDefault();
		WorkProgress.open();
		UpdateLang();
		let addUserToDB = (name, uuid) => {
			let db = Database(Mapcraft.DBPath, { verbose: console.log });
			const sql_User = db.prepare('SELECT Username FROM User WHERE Username = ?');
			if (sql_User.get(name) !== undefined && sql_User.get(name).Username)
				CreateAlert('danger', document.getElementById('alert-createUser-modal'), LANG.Data.User.Error.IsExist);
			else
			{
				const sql = db.prepare('INSERT INTO User (Username, UUID) VALUES (?, ?)');
				sql.run(name, uuid);
				event.target[1].value = '';
				UserComponent.table();
			}
			db.close();
		};
		//#region Check online if player exist
		const req = https.request({
			hostname: 'api.mojang.com',
			path: '/users/profiles/minecraft/' + event.target[1].value,
			method: 'GET'},
			res => {
				if (res.statusCode !== 200)
				{
					CreateAlert('warning', document.getElementById('alert-createUser-modal'), LANG.Data.User.Error.UserNotExist);
					WorkProgress.close();
					return ;
				}
				else
				{
					res.on('data', data => {
						let JsonData = JSON.parse(data);
						addUserToDB(JsonData.name, JsonData.id);
					});
				}
			}
		);
		req.end();
		//#endregion
		WorkProgress.close();
	});
}
//#endregion

//#region About
class AboutComponent
{
	static RawLicence(ID, host, path)
	{
		const https = require('https');
		let options = {
			host: host,
			path: path
		}
		let request = https.request(options, function (res) {
			let data = '';
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function () {
				document.getElementById(ID + '-licence').innerHTML = md.render(data);
			});
		});
		request.on('error', function (e) {
			console.log(e.message);
		});
		request.end();
	}
	
	static about()
	{
		Template.render(document.getElementById('option-tab-about'), 'about.tp', null);
		//#region Generate Li
		let HTML_nav = '';
		let HTML_tab = '';
		let Logo = '';
		let NavComponent = Template.getRaw('about-nav.tp');
		let TabComponent = Template.getRaw('about-table.tp');
		let Framework = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../img/framework/list.json')));
		for (let i in Framework)
		{
			if (Framework[i][1] === 'img')
				Logo = '<img class="icon-about" src="./dist/img/framework/' + Framework[i][2] + '"/>';
			else
				Logo = '<span class="icon-about" ' + Framework[i][2] + '></span>';
			HTML_nav += Template.parseRaw(NavComponent, {Name:i});
			HTML_tab += Template.parseRaw(TabComponent, {Logo:Logo, Link:Framework[i][0], Name:i});
		}
		Template.renderRaw(document.getElementById('component-tab-rigth-about'), HTML_nav, 'about-nav.tp', null);
		Template.renderRaw(document.getElementById('component-tab-left-about'), HTML_tab, 'about-table.tp', null);
		for (let i in Framework)
			this.RawLicence(i, Framework[i][3], Framework[i][4]);
		//#endregion
		OpenExternLink();
	}
}

function OpenExternLink()
{
	const links = document.querySelectorAll('a[href]');
	Array.prototype.forEach.call(links, (link) => {
		const url = link.getAttribute('href');
		if (url.indexOf('http') === 0)
		{
			link.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				shell.openExternal(url);
			});
		}
	});
}
//#endregion

module.exports = OptionComponent;
