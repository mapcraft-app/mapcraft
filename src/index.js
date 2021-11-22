const { app, BrowserWindow, ipcMain, dialog } = require('electron');
require('v8-compile-cache');
const process = require('process');
const child = require('child_process');
const path = require('path');
const OS = require('os');
const fs = require('fs');
const axios = require('axios');
const Database = require('better-sqlite3');
const { MCeditor, MCshell, MCwindow, MCutilities } = require('mapcraft-api');

//#region Variables
MCutilities.GetAppDataPath();
let StartWindow = null;
let MainWindow = null;
let SelectUserChild = null;
let UpdateWindow = null;
let IsSelectedUser = false;
let PassFirstStep = false;
const SaveCurrentUser = {
	DBpath: String,
	Username: String,
	UUID: String,
};
//#endregion

//#region Main system
//#region Update updateSystem
let UpdateExecutableIsPresent = false;
async function UpdateSystem()
{
	const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, './manifest'), { encoding: 'utf-8', flag: 'r' }));
	const plateform = OS.platform();
	//const cwd = process.cwd();
	const json = await axios({
		method: 'get',
		url: 'https://api.mapcraft.app/update',
	});
	let _url;
	let executable;
	if (plateform === 'win32')
	{
		_url = json.data.windows.url;
		executable = 'update.exe';
	}
	else if (plateform === 'darwin')
	{
		_url = json.data.darwin.url;
		executable = 'update';
	}
	else
	{
		_url = json.data.linux.url;
		executable = 'update';
	}
	const access = path.join(process.env.AppDataPath, executable);
	if (manifest.version.update === json.data.version && fs.existsSync(access))
	{
		UpdateExecutableIsPresent = true;
		return;
	}
	if (fs.existsSync(access))
		fs.rmSync(access, { force: true });
	MCutilities.download(_url, access, (err) =>
	{
		if (err)
		{
			console.error(err);
			return;
		}
		UpdateExecutableIsPresent = true;
	});
	setTimeout(() =>
	{
		UpdateExecutableIsPresent = true;
	}, 10 * 1000);
}
UpdateSystem();
//#endregion

function CreateWindow(preload)
{
	const window = MCwindow.CreateWindow(1280, 720, preload);
	MCwindow.OpenWindow(window, path.join(__dirname, 'index.html'));
	return (window);
}

function QuitServices()
{
	if (!MainWindow)
		return;
	const MClink = require('./dist/js/MClink'); // eslint-disable-line
	MClink.cleanComponents();
	const db = Database(SaveCurrentUser.DBpath, { verbose: console.log });
	const sql = db.prepare('UPDATE User SET IsConnected = 0 WHERE Username = ?');
	sql.run(SaveCurrentUser.Username);
	db.close();
}

app.on('ready', () =>
{
	if (!PassFirstStep)
	{
		StartWindow = CreateWindow(path.join(__dirname, '/dist/template/Start/main.js'));
		StartWindow.once('ready-to-show', () =>
		{
			StartWindow.show();
		});
	}
	else
	{
		OpenMainWindow(); // eslint-disable-line
	}
});

if (require('electron-squirrel-startup')) // eslint-disable-line
{
	QuitServices();
	app.quit();
}

app.on('window-all-closed', () =>
{
	QuitServices();
	if (process.platform !== 'darwin')
		app.quit();
});

app.on('activate', () =>
{
	if (BrowserWindow.getAllWindows().length === 0)
		if (!PassFirstStep)
			StartWindow = CreateWindow(StartWindow, path.join(__dirname, '/dist/template/Start/main.js'));
		else
			OpenMainWindow(); // eslint-disable-line
});
//#endregion

//#region Main Window system
const WindowUser = () =>
{
	SelectUserChild = new BrowserWindow({
		width: 800,
		height: 600,
		center: true,
		show: false,
		titleBarStyle: 'hidden',
		parent: MainWindow,
		modal: true,
		frame: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '/dist/template/SelectUser/main.js'),
		},
	});
	SelectUserChild.setMenuBarVisibility(false);
	SelectUserChild.setAlwaysOnTop(true);
	MCwindow.OpenWindow(SelectUserChild, path.join(__dirname, 'index.html'));
};

function CreateSelectUserWindow()
{
	WindowUser();
	SelectUserChild.once('ready-to-show', () =>
	{
		SelectUserChild.show();
		SelectUserChild.focus();
	});
	SelectUserChild.on('closed', () =>
	{
		SelectUserChild = null;
		if (!IsSelectedUser)
			MainWindow.close();
	});
}

function OpenMainWindow()
{
	if (MainWindow)
	{
		MainWindow.focus();
		CreateSelectUserWindow();
	}
	else
	{
		MainWindow = CreateWindow(path.join(__dirname, '/dist/template/Main/main.js'));
	}
	MainWindow.once('ready-to-show', () =>
	{
		MainWindow.show();
		CreateSelectUserWindow();
	});
	MainWindow.on('closed', () =>
	{
		MainWindow = null;
	});
	if (!PassFirstStep)
		StartWindow.close();
}
//#endregion

//#region Error handling
process.on('uncaughtException', (err) =>
{
	const messageBoxOptions = {
		type: 'error',
		title: 'Error in Main process',
		message: err.toString(),
	};
	dialog.showMessageBoxSync(messageBoxOptions);
	//app.exit(1);
});
//#endregion

//#region IPC signal (Alphabetic order)
//#region Dialog
ipcMain.on('Dialog:open-directory', (event, element, _path) =>
{
	dialog.showOpenDialog({
		defaultPath: _path,
		properties: ['openDirectory'],
	}).then((data) =>
	{
		event.reply('Dialog:selected-directory', data, element);
	}).catch((error) =>
	{
		console.error(error);
	});
});
ipcMain.on('Dialog:open-file', (event, element, _path) =>
{
	dialog.showOpenDialog({
		defaultPath: _path,
		properties: ['openFile'],
	}).then((data) =>
	{
		event.reply('Dialog:selected-file', data, element);
	}).catch((error) =>
	{
		console.error(error);
	});
});
ipcMain.on('Dialog:question', (event, options) =>
{
	dialog.showMessageBox(null, options, (response) =>
	{
		event.reply('Dialog:answer', response);
	});
});
ipcMain.on('Dialog:error', (event, title, content) =>
{
	dialog.showErrorBox(title, content);
});
//#endregion

//#region Editor
ipcMain.on('Editor:open', (event, link) =>
{
	event.reply('Editor:open-modal', MCeditor.OpenFile(link));
});
ipcMain.on('Editor:save-file', (event, data) =>
{
	MCeditor.SaveFile(data);
	event.reply('Editor:close-modal');
});
ipcMain.on('Editor:close', (event) =>
{
	MCeditor.CloseFile();
	event.reply('Editor:close-modal');
});
//#endregion

//#region Log
ipcMain.on('Log:is-change', (event, fullFile, newData) =>
{
	let array;
	let command;
	if (newData !== null)
	{
		array = newData.split(/\r?\n/);
		for (const id in array)
			if (Object.prototype.hasOwnProperty.call(array, id))
			{
				command = MCshell.parse(array[id]);
				if (command)
					event.reply('Shell:new-command', command);
			}
	}
	else
	{
		array = null;
	}
	event.reply('Log:send-change', fullFile, array);
});
//#endregion

//#region Notification
ipcMain.on('Notification:click-notification', () =>
{
	MainWindow.focus();
});
//#endregion

//#region Plugin
ipcMain.on('Plugin:is-changed', (event, plugin, name) =>
{
	event.reply('Plugin:update-interface', plugin, name);
});
//#endregion

//#region Shell
ipcMain.on('Shell:send-command', (event, command) =>
{
	event.reply('Shell:execute-command', command);
});
//#endregion

//#region Start
ipcMain.on('Start:is-selected-world', () =>
{
	const interval = setInterval(wait, 2000); // eslint-disable-line
	function wait()
	{
		if (UpdateExecutableIsPresent === true)
		{
			clearInterval(interval);
			OpenMainWindow();
		}
		else
		{
			console.log('Update executable not finish to download, retry in 2s');
		}
	}
});
//#endregion

//#region Trigger
ipcMain.on('Trigger:signal-open-modal', (event, command) =>
{
	event.reply('Trigger:open-modal', command);
});
//#endregion

//#region Cutscene
ipcMain.on('Cutscene:signal-create-cutscene', (event, command) =>
{
	event.reply('Cutscene:create-cutscene', command);
});
//#endregion

//#region Recipes
ipcMain.on('Recipes:signal-is-exist', (event) =>
{
	event.reply('Recipes:is-exist');
});
ipcMain.on('Recipes:signal-open-switcher', (event, id) =>
{
	event.reply('Recipes:open-switcher', id);
});
//#endregion

//#region User
ipcMain.on('User:change-username', () =>
{
	IsSelectedUser = true;
	PassFirstStep = true;
	OpenMainWindow();
});
ipcMain.on('User:close-window', (event, DBPath, JSON) =>
{
	IsSelectedUser = true;
	SaveCurrentUser.Username = JSON.Username;
	SaveCurrentUser.UUID = JSON.UUID;
	SaveCurrentUser.DBpath = DBPath;
	SelectUserChild.close();
	MainWindow.webContents.send('User:remove-blur');
});
//#endregion

//#region Work in progress
ipcMain.on('WorkProgress:signal-open-modal', (event) =>
{
	event.reply('WorkProgress:open-modal');
});
ipcMain.on('WorkProgress:signal-close-modal', (event) =>
{
	event.reply('WorkProgress:close-modal');
});
//#endregion

//#region Update system
ipcMain.on('Update:create-modal', () =>
{
	UpdateWindow = new BrowserWindow({
		width: 640,
		height: 480,
		center: true,
		show: false,
		resizable: false,
		titleBarStyle: 'hidden',
		parent: MainWindow,
		modal: true,
		frame: false,
		icon: path.join(__dirname, '/dist/img/icon/icon.ico'),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '/dist/template/Update/main.js'),
		},
	});
	UpdateWindow.setMenuBarVisibility(false);
	UpdateWindow.setAlwaysOnTop(true);
	MCwindow.OpenWindow(UpdateWindow, path.join(__dirname, './index.html'));
});
ipcMain.on('Update:open-window', () =>
{
	if (!SelectUserChild)
		UpdateWindow.show();
});
ipcMain.on('Update:close-modal', () =>
{
	UpdateWindow.close();
});
ipcMain.on('Update:make-update', (event, executePath, tempPath, zipPath, unzipPath) =>
{
	let executable;
	const interval = setInterval(wait, 2000); // eslint-disable-line
	function wait()
	{
		if (UpdateExecutableIsPresent === true)
			clearInterval(interval);
		else
			console.log('Update executable not finish to download, retry in 2s');
	}

	if (SelectUserChild)
		SelectUserChild.close();
	if (UpdateWindow)
		UpdateWindow.close();
	if (MainWindow)
		MainWindow.close();
	if (OS.platform() === 'win32')
		executable = 'update.exe';
	else
		executable = 'update';

	const EXECUTABLE = path.join(process.env.AppDataPath, executable);
	if (fs.existsSync(EXECUTABLE))
	{
		const update = child.spawn(EXECUTABLE, {
			detached: true,
			stdio: ['ignore', 'ignore', 'ignore'],
			env: {
				EXECUTE_PATH: executePath,
				TEMP_PATH: tempPath,
				ZIP_PATH: zipPath,
				UNZIP_PATH: unzipPath,
			},
		});
		update.unref();
		app.exit();
	}
});
//#endregion
//#endregion
