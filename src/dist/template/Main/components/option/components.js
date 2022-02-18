const fs = require('fs');
const os = require('os');
const path = require('path');
const Database = require('better-sqlite3');
const https = require('https');
const { MCutilities, MCipc, MCworkInProgress, MCtemplate, MCplugin } = require('mapcraft-api');
const MC = require('mapcraft-api').Mapcraft;
const MarkdownIt = require('markdown-it');
const { shell } = require('electron');
const AddPlugins = require('./plugins');
const NavMenu = require('../../../../js/createNavMenu');
const importPlugins = require('../../../../js/importPlugins');

const md = new MarkdownIt();
const Template = new MCtemplate(__dirname);
const Plugins = new MCplugin();

const pluginsList = {
	builtin: JSON.parse(fs.readFileSync(path.join(__dirname, '../../', 'components.json'), { encoding: 'utf-8', flag: 'r' })),
	builtinActive: JSON.parse(fs.readFileSync(MC.config.Env.ActiveComponents, { encoding: 'utf-8', flag: 'r' })),
	addons: JSON.parse(fs.readFileSync(path.join(MC.config.Env.PluginsComponents, 'components.json'), { encoding: 'utf-8', flag: 'r' })),
};

const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const MinecraftVersion = MC.config.Minecraft;
let LANG = Plugins.lang('Option');
function UpdateLang()
{
	LANG = Plugins.lang('Option');
}

//#region General tab
class OptionComponent
{
	static _main()
	{
		UpdateLang();
		const str = 'option.tp';
		Template.render(document.getElementById('content'), str, { GeneralIcon: LANG.Data.Menu.GeneralIcon, UserIcon: LANG.Data.Menu.UserIcon, PluginIcon: LANG.Data.Menu.PluginIcon, AboutIcon: LANG.Data.Menu.AboutIcon });
		this.UpdateLangComponent(str);
	}

	static general()
	{
		const str = 'general.tp';
		Template.render(document.getElementById('option-tab-general'), str, null);

		/*Generate Form */
		let HTML = '';
		const ComponentInput = Template.getRaw('general_input.tp');
		const ComponentResource = Template.getRaw('general_resource.tp');
		const ComponentData = Template.getRaw('general_data.tp');
		HTML += Template.parseRaw(ComponentInput, { for: 'TempPath', id: 'option-TempPath', text: 'TagTemp', path: MC.config.Env.TempPath });
		HTML += Template.parseRaw(ComponentInput, { for: 'GamePath', id: 'option-GamePath', text: 'TagGame', path: MC.config.Env.GamePath });
		HTML += Template.parseRaw(ComponentInput, { for: 'SavePath', id: 'option-SavePath', text: 'TagSave', path: MC.config.Env.SavePath });

		let SaveName = JSON.parse(localStorage.getItem('Mapcraft')).Name; SaveName = `${SaveName}-`;
		HTML += Template.parseRaw(ComponentResource, { Name: SaveName, for: 'ResourcePath', id: 'option-ResourcePath', text: 'TagResource', path: MC.config.Data.ResourcePack });
		HTML += Template.parseRaw(ComponentData, { Name: SaveName, for: 'DataPath', id: 'option-DataPath', text: 'TagData', path: MC.config.Data.DataPack });

		Template.renderRaw(document.getElementById('option-general-path'), HTML, 'general_input.tp', null);

		HTML = '';
		const ComponentLang = Template.getRaw('general_lang.tp');
		const JsonLangList = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../../lang.json'), 'utf-8'));
		for (const i in JsonLangList)
			if (Object.prototype.hasOwnProperty.call(JsonLangList, i))
				HTML += Template.parseRaw(ComponentLang, { Code: i, Lang: JsonLangList[i] });
		Template.renderRaw(document.getElementById('option-Lang'), HTML, 'general_lang.tp', null);
		//Minecraft Version
		for (const object of MinecraftVersion.Versions)
		{
			const element = document.createElement('option');
			element.value = object;
			element.innerText = object;
			if (object === global.MinecraftSelectedVersion)
				element.selected = true;
			document.getElementById('option-Version').appendChild(element);
		}
		this.UpdateLangComponent(str);
		this.setSelectLang();
		new DetectClick(); // eslint-disable-line
	}

	static setSelectLang()
	{
		const DOM = document.getElementById('option-Lang');
		for (let i = 0, { length } = DOM; i < length; i++)
			if (DOM[i].value === MC.config.Env.Lang)
				DOM[i].setAttribute('selected', null);
			else if (DOM[i].hasAttribute('selected'))
				DOM[i].removeAttribute('selected');
	}

	static main()
	{
		this._main();
		this.general();
		if (pluginsList.builtinActive.length <= 0)
			pluginsList.builtinActive = JSON.parse(fs.readFileSync(MC.config.Env.ActiveComponents, { encoding: 'utf-8', flag: 'r' }));
		PluginComponent.main(); // eslint-disable-line
		AboutComponent.about(); // eslint-disable-line
		UserComponent.main(); // eslint-disable-line
	}

	static UpdateLangComponent(Component)
	{
		switch (Component)
		{
			case 'option.tp':
				Template.updateLang(document.getElementById('option-menu'), LANG.Data.Menu);
				break;
			case 'general.tp':
				Template.updateLang(document.getElementById('option-tab-general'), LANG.Data.General);
				break;
			default:
				break;
		}
	}

	static RedrawInterface()
	{
		document.getElementById('documentation-link').href = `https://documentation.mapcraft.app/?${MC.config.Env.Lang}`;
		UpdateLang();
		//Header
		Template.updateLang(document.getElementById('nav-header'), Plugins.lang('Main'));
		Template.updateLang(document.getElementById('offcanvas-content'), Plugins.lang('Main'));
		//Side Nav
		const SideNav = () =>
		{
			NavMenu.CreateNavMenu(document.getElementById('toogle-nav'), 'nav.tp');
			document.querySelectorAll('#toogle-nav li').forEach((element) =>
			{
				element.addEventListener('click', () =>
				{
					document.querySelectorAll('#toogle-nav li').forEach((elem) =>
					{
						elem.childNodes[1].classList.remove('nav-hover-element-selected');
					});
					element.childNodes[1].classList.add('nav-hover-element-selected');
					MCipc.send('Plugin:is-changed', element.id, element.getAttribute('title'));
				});
			});
		}; SideNav();
		//Editor
		Template.updateLang(document.getElementById('ModalEditFile'), Plugins.lang('Main'));
		this.UpdateLangComponent('option.tp');
		this.general();
		PluginComponent.updateLang(); // eslint-disable-line
		UserComponent.UpdateLangComponent('user.tp'); // eslint-disable-line
		MCutilities.createAlert('success', document.getElementById('option-error'), LANG.Data.General.Success);
	}

	static RedrawUserTab()
	{
		UserComponent.table(); // eslint-disable-line
	}
}

class DetectClick
{
	constructor()
	{
		document.querySelector('#option-TempPath').addEventListener('click', () =>
		{
			MCipc.send('Dialog:open-directory', 'TempPath', document.getElementById('TempPath').value);
		});
		document.querySelector('#option-GamePath').addEventListener('click', () =>
		{
			MCipc.send('Dialog:open-directory', 'GamePath', document.getElementById('GamePath').value);
		});
		document.querySelector('#option-SavePath').addEventListener('click', () =>
		{
			MCipc.send('Dialog:open-directory', 'SavePath', document.getElementById('SavePath').value);
		});
		MCipc.receive('Dialog:selected-directory', (data, element) =>
		{
			if (data.canceled === false)
			{
				const _data = data.filePaths[0];
				document.getElementById(element).value = _data;
			}
		});

		//Lang
		document.querySelector('#option-button-reset').addEventListener('click', () =>
		{
			MC.resetConfigFile();
			this.#ChangeNameRessourcePack();
			OptionComponent.RedrawInterface();
		});
		document.querySelector('#option-button-save').addEventListener('click', () =>
		{
			UpdateLang();
			if (!this.#DirIsExist(document.getElementById('TempPath').value, LANG.Data.General.Error.DirectoryNotExist))
				return;
			if (!this.#DirIsExist(document.getElementById('GamePath').value, LANG.Data.General.Error.DirectoryNotExist))
				return;
			if (!this.#IsMinecraftDir(document.getElementById('GamePath').value))
				return;
			if (!this.#DirIsExist(document.getElementById('SavePath').value, LANG.Data.General.Error.DirectoryNotExist))
				return;
			if (!this.#IsSaveDir(document.getElementById('SavePath').value))
				return;
			if (!this.#IsCorrectString(document.getElementById('ResourcePath').value))
				return;
			if (!this.#IsCorrectString(document.getElementById('DataPath').value))
				return;

			MC.updateConfig(
				document.getElementById('GamePath').value,
				document.getElementById('SavePath').value,
				document.getElementById('TempPath').value,
				document.getElementById('option-Lang').value,
				document.getElementById('ResourcePath').value,
				document.getElementById('DataPath').value,
			);
			MC.setSelectedVersion(document.getElementById('option-Version').value);
			//#region Update mcmeta
			const mcmeta = {
				datapack: JSON.parse(fs.readFileSync(path.join(Mapcraft.Data.DataPack, 'pack.mcmeta'), { encoding: 'utf-8', flag: 'r' })),
				resourcePack: JSON.parse(fs.readFileSync(path.join(Mapcraft.Data.ResourcePack, 'pack.mcmeta'), { encoding: 'utf-8', flag: 'r' })),
				officialData: JSON.parse(fs.readFileSync(path.join(Mapcraft.Mapcraft, 'pack.mcmeta'), { encoding: 'utf-8', flag: 'r' })),
				officialResource: JSON.parse(fs.readFileSync(path.join(Mapcraft.Data.ResourcePack, '..', 'mapcraft', 'pack.mcmeta'), { encoding: 'utf-8', flag: 'r' })),
			};
			let num = Number();
			for (const object of MinecraftVersion.Versions)
				if (object.Release === global.MinecraftSelectedVersion)
				{
					num = Number(object.Number);
					break;
				}
			mcmeta.datapack.pack.pack_format = num;
			mcmeta.resourcePack.pack.pack_format = num;
			mcmeta.officialData.pack.pack_format = num;
			mcmeta.officialResource.pack.pack_format = num;
			const _writeFile = (_path, data) =>
			{
				fs.writeFile(_path, data, { encoding: 'utf-8' }, (err) =>
				{
					if (err)
						console.error(err);
				});
			};
			_writeFile(path.join(Mapcraft.Data.DataPack, 'pack.mcmeta'), JSON.stringify(mcmeta.datapack, null, 4));
			_writeFile(path.join(Mapcraft.Mapcraft, 'pack.mcmeta'), JSON.stringify(mcmeta.officialData, null, 4));
			_writeFile(path.join(Mapcraft.Data.ResourcePack, '..', 'mapcraft', 'pack.mcmeta'), JSON.stringify(mcmeta.officialResource, null, 4));
			fs.writeFile(path.join(Mapcraft.Data.ResourcePack, 'pack.mcmeta'), JSON.stringify(mcmeta.resourcePack, null, 4), { encoding: 'utf-8' }, (err) =>
			{
				if (err)
					console.error(err);
				this.#ChangeNameRessourcePack();
				OptionComponent.RedrawInterface();
			});
			//#endregion
		});
	}

	#ChangeNameRessourcePack()
	{
		const _Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const Name = `${_Mapcraft.Name}-${MC.config.Data.ResourcePack}`;
		fs.renameSync(_Mapcraft.Data.ResourcePack, path.join(MC.config.Env.SavePath, '../resourcepacks', Name));
		_Mapcraft.Data.ResourcePack = path.join(MC.config.Env.SavePath, '../resourcepacks', Name);
		localStorage.setItem('Mapcraft', JSON.stringify(_Mapcraft));
	}

	#DirIsExist(link, Error)
	{
		if (!fs.existsSync(link))
		{
			MCutilities.createAlert('warning', document.getElementById('option-error'), `${link.toString()}: ${Error}`);
			return (false);
		}
		return (true);
	}

	#IsMinecraftDir(link)
	{
		if (!fs.existsSync(path.join(link, '/', 'versions')))
		{
			UpdateLang();
			MCutilities.createAlert('warning', document.getElementById('option-error'), LANG.Data.General.Error.NotMinecraftDirectory);
			return (false);
		}
		return (true);
	}

	#IsSaveDir(link)
	{
		const TempSaveList = fs.readdirSync(link);
		const SavePath = document.getElementById('SavePath').value;
		for (const Save of TempSaveList)
		{
			const testIfDir = path.join(SavePath, '/', Save);
			if (fs.existsSync(testIfDir) && fs.lstatSync(testIfDir).isDirectory())
				if (!fs.existsSync(path.join(testIfDir, '/icon.png')))
				{
					UpdateLang();
					MCutilities.createAlert('warning', document.getElementById('option-error'), LANG.Data.General.Error.NotMinecraftSaveDirectory);
					return (false);
				}
		}
		return (true);
	}

	#IsCorrectString(string)
	{
		if (!string)
		{
			UpdateLang();
			MCutilities.createAlert('warning', document.getElementById('option-error'), `${string.toString()}: ${LANG.Data.General.Error.IncorrectString}`);
			return (false);
		}
		return (true);
	}
}

class UserComponent
{
	static main()
	{
		const str = 'user.tp';
		Template.render(document.getElementById('option-tab-user'), str, null);
		this.UpdateLangComponent(str);
		this.table();
		this.#CreateUser(); //eslint-disable-line
	}

	static table()
	{
		UpdateLang();
		let HTML = '';
		const ComponentTable = Template.getRaw('user-table.tp');
		const _Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const db = Database(_Mapcraft.DBPath, { verbose: console.log });
		const sql = db.prepare('SELECT Username, UUID, IsConnected FROM User');
		for (const user of sql.iterate())
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
			HTML += Template.parseRaw(ComponentTable, { link: `https://crafatar.com/avatars/${user.UUID}?size=40`, username: user.Username, Disabled, ClassConnect, Connect });
		}
		Template.renderRaw(document.getElementById('generateTab'), HTML, 'user-table.tp', null);
		db.close();
		this.#DeleteOneUser(); // eslint-disable-line
		this.#DeleteMultiUser(); // eslint-disable-line
	}

	static UpdateLangComponent(Component)
	{
		UpdateLang();
		switch (Component)
		{
			case 'user.tp':
				Template.updateLang(document.getElementById('option-tab-user'), LANG.Data.User);
				break;
			default:
				Template.updateLang(document.getElementById('option-tab-user'), LANG.Data.User);
				break;
		}
	}

	static #DeleteOneUser()
	{
		for (const input of document.querySelectorAll('button[name="user-button-delete"]'))
			input.addEventListener('click', (event) =>
			{
				event.preventDefault();
				event.stopImmediatePropagation();
				UpdateLang();
				MCworkInProgress.open();
				const username = input.parentNode.parentNode.childNodes[7].innerText;
				const db = Database(Mapcraft.DBPath, { verbose: console.log });
				/*Check if user is disconnected */
				const sqlUser = db.prepare('SELECT IsConnected FROM User WHERE Username = ?');
				const ret = sqlUser.get(username);
				if (ret.IsConnected)
				{
					MCutilities.createAlert('warning', document.getElementById('option-error'), LANG.Data.User.Error.UserIsConnected);
					MCworkInProgress.close();
					return;
				}
				const sql = db.prepare('DELETE FROM User WHERE Username = ?');
				sql.run(username);
				db.close();
				UserComponent.table();
				MCworkInProgress.close();
			});
	}

	static #DeleteMultiUser()
	{
		document.querySelector('#full-delete-tab').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			MCworkInProgress.open();
			document.querySelector('#checkbox-user').checked = false;
			const db = Database(Mapcraft.DBPath, { verbose: console.log });
			let isDelete = false;
			const sqlName = db.prepare('DELETE FROM User WHERE Username = ?');
			for (const input of document.querySelectorAll('input[name="select-user"]'))
				if (input.checked && !input.disabled)
				{
					isDelete = true;
					sqlName.run(input.value);
				}
			if (isDelete)
				UserComponent.table();
			db.close();
			MCworkInProgress.close();
		});
	}

	static #CreateUser()
	{
		document.getElementById('form-createUser').addEventListener('submit', (event) =>
		{
			event.preventDefault();
			MCworkInProgress.open();
			UpdateLang();
			const addUserToDB = (name, uuid) =>
			{
				const db = Database(Mapcraft.DBPath, { verbose: console.log });
				const sqlUser = db.prepare('SELECT Username FROM User WHERE Username = ?');
				if (sqlUser.get(name) !== undefined && sqlUser.get(name).Username)
				{
					MCutilities.createAlert('danger', document.getElementById('alert-createUser-modal'), LANG.Data.User.Error.IsExist);
				}
				else
				{
					const sql = db.prepare('INSERT INTO User (Username, UUID) VALUES (?, ?)');
					sql.run(name, uuid);
					event.target[1].value = ''; // eslint-disable-line
					UserComponent.table();
				}
				db.close();
			};
			//#region Check online if player exist
			const req = https.request(
				{
					hostname: 'api.mojang.com',
					path: `/users/profiles/minecraft/${event.target[1].value}`,
					method: 'GET',
				},
				(res) =>
				{
					if (res.statusCode !== 200)
					{
						MCutilities.createAlert('warning', document.getElementById('alert-createUser-modal'), LANG.Data.User.Error.UserNotExist);
						MCworkInProgress.close();
						return;
					}
					res.on('data', (data) =>
					{
						const JsonData = JSON.parse(data);
						addUserToDB(JsonData.name, JsonData.id);
					});
				},
			);
			req.end();
			//#endregion
			MCworkInProgress.close();
		});
	}
}

class PluginComponent
{
	static main()
	{
		Template.render(document.getElementById('option-tab-plugin'), 'plugin.tp', null);
		this.updateLang();
		this.generateList();

		document.getElementById('InstallPluginArchive').addEventListener('click', () =>
		{
			MCipc.send('Dialog:open-global', 'archive', {
				defaultPath: os.homedir(),
				filters: [
					{ name: 'Mapcraft', extensions: ['mapcraft'] },
				],
				properties: ['openFile'],
			});
		});
		MCipc.receive('Dialog:selected-global', (data) =>
		{
			if (data.canceled === true)
				return;
			AddPlugins(data.filePaths[0]).finally(() =>
			{
				document.getElementById('loader').setAttribute('hidden', '');
			}).catch((err) =>
			{
				document.getElementById('loader').setAttribute('hidden', '');
				throw new Error(err);
			});
		});
	}

	static updateLang()
	{
		Template.updateLang(document.getElementById('option-tab-plugin'), LANG.Data);
	}

	static updateNav()
	{
		NavMenu.CreateNavMenu(document.getElementById('toogle-nav'), 'nav.tp');
		document.querySelectorAll('#toogle-nav li').forEach((element) =>
		{
			element.addEventListener('click', () =>
			{
				document.querySelectorAll('#toogle-nav li').forEach((elem) =>
				{
					elem.childNodes[1].classList.remove('nav-hover-element-selected');
				});
				element.childNodes[1].classList.add('nav-hover-element-selected');
				MCipc.send('Plugin:is-changed', element.id, element.getAttribute('title'));
			});
		});
	}

	static generateList()
	{
		let ID = Number(0);
		const LIST_BUILT = document.querySelector('#table-builtin tbody');
		const LIST_ADDON = document.querySelector('#table-plugin tbody');

		const builtin = () =>
		{
			const newDOM = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
			const newDOMbody = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
			newDOM.documentElement.appendChild(newDOMbody);
			for (const object of pluginsList.builtin)
			{
				if (object.name === '__DEFAULT')
					continue; //eslint-disable-line
				const div = document.createElement('div');
				Template.render(div, 'plugin-table.tp', { id: ID++, uuid: object.name, icon: './dist/img/icon/default_logo.png', name: object.name, version: 'latest', author: 'Vex345', description: object.description });
				if (object.desactivable === false)
				{
					div.getElementsByClassName('uk-switch-span')[0].classList.add('uk-switch-span-disabled');
					div.getElementsByTagName('input')[0].disabled = true;
				}
				if (Plugins.active(object.name) === true)
					div.getElementsByTagName('input')[0].setAttribute('checked', 'checked');
				div.getElementsByTagName('button')[0].disabled = true;
				newDOMbody.appendChild(div.getElementsByTagName('tr')[0]);
			}
			LIST_BUILT.innerHTML = newDOMbody.innerHTML;
		};

		const addons = () =>
		{
			const newDOM = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
			const newDOMbody = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
			newDOM.documentElement.appendChild(newDOMbody);
			const _path = MC.config.Env.PluginsComponents;
			for (const object of pluginsList.addons)
			{
				const testManifest = () =>
				{
					const testOne = path.join(object.directory, 'package.json');
					const testTwo = path.join(_path, object.name, 'package.json');
					if (fs.existsSync(testOne))
						return testOne;
					return testTwo;
				};
				const manifest = JSON.parse(fs.readFileSync(testManifest(), { encoding: 'utf-8', flag: 'r' }));
				const div = document.createElement('div');
				const data = {
					id: ID++,
					uuid: object.uuid,
					icon: (fs.existsSync(path.join(object.directory, manifest.icon))) ? path.join(object.directory, manifest.icon) : './dist/img/icon/default_logo.png',
					name: manifest.name,
					version: manifest.version,
					author: manifest.author,
					description: manifest.description,
				};
				Template.render(div, 'plugin-table.tp', data);
				if (object.active === true)
					div.getElementsByTagName('input')[0].setAttribute('checked', 'checked');
				newDOMbody.appendChild(div.getElementsByTagName('tr')[0]);
			}
			LIST_ADDON.innerHTML = newDOMbody.innerHTML;
		};

		const updateJSON = (data, key, value, newValue, isBuiltin = true) =>
		{
			for (const object of data)
				if (Object.prototype.hasOwnProperty.call(object, key) && object[key] === value)
				{
					object.active = newValue;
					const _path = (isBuiltin) ? MC.config.Env.ActiveComponents : path.join(MC.config.Env.PluginsComponents, 'components.json');
					fs.writeFile(_path, JSON.stringify(data, null, 4), { encoding: 'utf-8' }, (err) =>
					{
						if (err)
							MCutilities.createAlert('warning', document.getElementById('option-error'), err.message);
						if (isBuiltin)
							Plugins.toogle(value);
						else
							importPlugins.toogle(value);
						this.updateNav();
					});
					return;
				}
		};

		const removeJson = (key, value) =>
		{
			for (const object of pluginsList.addons)
				if (Object.prototype.hasOwnProperty.call(object, key) && object[key] === value)
				{
					pluginsList.addons.splice(pluginsList.addons.indexOf(object), 1);
					fs.writeFile(path.join(MC.config.Env.PluginsComponents, 'components.json'), JSON.stringify(pluginsList.addons, null, 4), { encoding: 'utf-8' }, (err) =>
					{
						if (err)
							MCutilities.createAlert('warning', document.getElementById('option-error'), err.message);
						importPlugins.toogle(value, false);
						this.updateNav();
					});
					return;
				}
		};

		setImmediate(() =>
		{
			builtin();
			addons();
			//#region Switcher
			const inputs = document.getElementById('option-tab-plugin').getElementsByTagName('input');
			for (const input of inputs)
				input.addEventListener('click', (event) =>
				{
					event.stopImmediatePropagation();
					const TR = event.target.closest('tr');
					if (event.target.checked)
						if (event.target.closest('.table-builtin'))
							updateJSON(pluginsList.builtinActive, 'name', TR.getAttribute('uuid'), true);
						else
							updateJSON(pluginsList.addons, 'uuid', TR.getAttribute('uuid'), true, false);
					else if (!event.target.checked)
						if (event.target.closest('.table-builtin'))
							updateJSON(pluginsList.builtinActive, 'name', TR.getAttribute('uuid'), false);
						else
							updateJSON(pluginsList.addons, 'uuid', TR.getAttribute('uuid'), false, false);
				});
			//#endregion

			//#region Delete
			const buttons = document.getElementById('table-plugin').getElementsByTagName('button');
			for (const button of buttons)
				button.addEventListener('click', (event) =>
				{
					event.preventDefault();
					event.stopImmediatePropagation();
					const TR = event.target.closest('tr');
					fs.rm(path.join(MC.config.Env.PluginsComponents, TR.getAttribute('uuid')), { recursive: true, force: true }, (err) =>
					{
						if (err)
						{
							MCutilities.createAlert('warning', document.getElementById('option-error'), err.message);
						}
						else
						{
							removeJson('uuid', TR.getAttribute('uuid'));
							Template.cleanNode(TR, true);
							MCutilities.createAlert('success', document.getElementById('option-error'), LANG.Data.Plugin.DeleteSuccess);
						}
					});
				});
			//#endregion
		});
	}
}

class AboutComponent
{
	static RawLicence(ID, host, _path)
	{
		const options = {
			host,
			path: _path,
		};
		const request = https.request(options, (res) =>
		{
			let data = '';
			res.on('data', (chunk) =>
			{
				data += chunk;
			});
			res.on('end', () =>
			{
				document.getElementById(`${ID}-licence`).innerHTML = md.render(data);
			});
		});
		request.on('error', (e) =>
		{
			console.log(e.message);
		});
		request.end();
	}

	static #openExternalLink()
	{
		const links = document.querySelectorAll('a[href]');
		Array.prototype.forEach.call(links, (link) =>
		{
			const url = link.getAttribute('href');
			if (url.indexOf('http') === 0)
				link.addEventListener('click', (event) =>
				{
					event.preventDefault();
					event.stopImmediatePropagation();
					shell.openExternal(url);
				});
		});
	}

	static about()
	{
		Template.render(document.getElementById('option-tab-about'), 'about.tp', null);
		//#region Generate Li
		let HTMLnav = '';
		let HTMLtab = '';
		let Logo = '';
		const NavComponent = Template.getRaw('about-nav.tp');
		const TabComponent = Template.getRaw('about-table.tp');
		const Framework = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../img/framework/list.json')));
		for (const i in Framework)
			if (Object.prototype.hasOwnProperty.call(Framework, i))
			{
				if (Framework[i][1] === 'img')
					Logo = `<img class="icon-about" src="./dist/img/framework/${Framework[i][2]}"/>`;
				else
					Logo = `<span class="icon-about" ${Framework[i][2]}></span>`;
				HTMLnav += Template.parseRaw(NavComponent, { Name: i });
				HTMLtab += Template.parseRaw(TabComponent, { Logo, Link: Framework[i][0], Name: i });
			}
		Template.renderRaw(document.getElementById('component-tab-rigth-about'), HTMLnav, 'about-nav.tp', null);
		Template.renderRaw(document.getElementById('component-tab-left-about'), HTMLtab, 'about-table.tp', null);
		for (const i in Framework)
			if (Object.prototype.hasOwnProperty.call(Framework, i))
				this.RawLicence(i, Framework[i][3], Framework[i][4]);
		//#endregion
		this.#openExternalLink();
	}
}

module.exports = OptionComponent;
