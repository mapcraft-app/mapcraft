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
require('./dist/js/importPlugins');

// In dev mode, activate hot reloading
if (process.argv[2] && process.argv[2] === 'dev')
	try
	{
		process.env.DEV = true;
		// eslint-disable-next-line global-require
		require('electron-reloader')(module);
	}
	catch (err)
	{
		throw new Error(err);
	}

//#region  Variables
MCutilities.generateENV();
let StartWindow = null;
let MainWindow = null;
let SelectUserChild = null;
let UpdateWindow = null;
let IsSelectedUser = false;
let PassFirstStep = !!(process.argv[2] && process.argv[2] === 'dev');
const SaveCurrentUser = {
	DBpath: String,
	Username: String,
	UUID: String,
};
// #endregion

// Copy manifest if not exist
try
{
	fs.copyFileSync(path.join(__dirname, 'manifest'), path.join(process.env.AppDataPath, 'manifest'), fs.constants.COPYFILE_EXCL);
}
catch (err)
{
	// err
}
const MainManifest = JSON.parse(fs.readFileSync(path.join(process.env.AppDataPath, 'manifest'), { encoding: 'utf-8', flag: 'r' }));

//#region  Main system
//#region  Update updateSystem
let UpdateExecutableIsPresent = false;
async function updateSystem()
{
	const plateform = OS.platform();
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
	if (MainManifest.version.update === json.data.version && fs.existsSync(access))
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
		MainManifest.version.update = json.data.version;
		fs.writeFile(path.join(process.env.AppDataPath, 'manifest'), JSON.stringify(MainManifest, null, 4), { encoding: 'utf-8', flag: 'w' }, (err2) =>
		{
			if (err2)
				console.error(`main/${err2}`);
		});
	});
}
updateSystem().catch((err) =>
{
	UpdateExecutableIsPresent = true;
	dialog.showMessageBoxSync({
		type: 'error',
		title: 'Error',
		message: err.message,
	});
});
// #endregion

function createWindow(preload)
{
	const window = MCwindow.createWindow(1280, 720, preload);
	MCwindow.openWindow(window, path.join(__dirname, 'index.html'));
	return (window);
}

function quitServices()
{
	if (!MainWindow)
		return;
	const db = Database(SaveCurrentUser.DBpath, { verbose: console.log });
	const sql = db.prepare('UPDATE User SET IsConnected = 0 WHERE Username = ?');
	sql.run(SaveCurrentUser.Username);
	db.close();
}

app.on('ready', () =>
{
	if (!PassFirstStep)
	{
		StartWindow = createWindow(path.join(__dirname, '/dist/template/Start/main.js'));
		StartWindow.once('ready-to-show', () =>
		{
			StartWindow.show();
		});
	}
	else
	{
		openMainWindow(); // eslint-disable-line
	}
});

if (require('electron-squirrel-startup')) // eslint-disable-line
{
	quitServices();
	app.quit();
}

app.on('window-all-closed', () =>
{
	quitServices();
	if (process.platform !== 'darwin')
		app.quit();
});

app.on('activate', () =>
{
	if (BrowserWindow.getAllWindows().length === 0)
		if (!PassFirstStep)
			StartWindow = createWindow(StartWindow, path.join(__dirname, '/dist/template/Start/main.js'));
		else
			openMainWindow(); // eslint-disable-line
});
// #endregion

//#region  Main Window system
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
	MCwindow.openWindow(SelectUserChild, path.join(__dirname, 'index.html'));
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

function openMainWindow()
{
	if (MainWindow)
	{
		MainWindow.focus();
		CreateSelectUserWindow();
	}
	else
	{
		MainWindow = createWindow(path.join(__dirname, '/dist/template/Main/main.js'));
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
// #endregion

//#region  Error handling
process.on('uncaughtException', (err, origin) =>
{
	const message = (process.env.DEV)
		? `${err.toString()}\nOrigin: ${origin}`
		: `${err.toString()}`;
	const messageBoxOptions = {
		type: 'error',
		title: 'Error in Main process',
		message,
	};
	dialog.showMessageBoxSync(messageBoxOptions);
	app.exit(1);
});
// #endregion

//#region  IPC signal (Alphabetic order)
//#region  Dialog
ipcMain.on('Dialog:open-global', (event, options = {}) =>
{
	dialog.showOpenDialog(options).then((data) =>
	{
		event.reply('Dialog:selected-global', data);
	}).catch((error) =>
	{
		console.error(error);
	});
});
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
// #endregion

//#region  Editor
ipcMain.on('Editor:open', (event, link) =>
{
	event.reply('Editor:open-modal', MCeditor.openFile(link));
});
ipcMain.on('Editor:save-file', (event, data) =>
{
	MCeditor.saveFile(data);
	event.reply('Editor:close-modal');
});
ipcMain.on('Editor:close', (event) =>
{
	MCeditor.closeFile();
	event.reply('Editor:close-modal');
});
// #endregion

//#region  Log
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
// #endregion

//#region  Notification
ipcMain.on('Notification:click-notification', () =>
{
	MainWindow.focus();
});
// #endregion

//#region  Plugin
ipcMain.on('Plugin:is-changed', (event, plugin, name) =>
{
	event.reply('Plugin:update-interface', plugin, name);
});
// #endregion

//#region  Shell
ipcMain.on('Shell:send-command', (event, command) =>
{
	event.reply('Shell:execute-command', command);
});
// #endregion

//#region  Start
ipcMain.on('Start:is-selected-world', () =>
{
	const interval = setInterval(wait, 1000); // eslint-disable-line
	function wait()
	{
		if (UpdateExecutableIsPresent === true)
		{
			clearInterval(interval);
			openMainWindow();
		}
		else
		{
			console.log('Update executable not finish to download, retry in 1s');
		}
	}
});
// #endregion

//#region  Trigger
ipcMain.on('Trigger:signal-open-modal', (event, command) =>
{
	event.reply('Trigger:open-modal', command);
});
// #endregion

//#region  Cutscene
ipcMain.on('Cutscene:signal-create-cutscene', (event, command) =>
{
	event.reply('Cutscene:create-cutscene', command);
});
// #endregion

//#region  Recipes
ipcMain.on('Recipes:signal-is-exist', (event) =>
{
	event.reply('Recipes:is-exist');
});
ipcMain.on('Recipes:signal-open-switcher', (event, id) =>
{
	event.reply('Recipes:open-switcher', id);
});
// #endregion

//#region  User
ipcMain.on('User:change-username', () =>
{
	IsSelectedUser = true;
	PassFirstStep = true;
	openMainWindow();
});
ipcMain.on('User:close-window', (event, DBPath, JSON) =>
{
	IsSelectedUser = true;
	SaveCurrentUser.Username = JSON.Username;
	SaveCurrentUser.UUID = JSON.UUID;
	SaveCurrentUser.DBpath = DBPath;
	if ((process.env.DEV && SelectUserChild) || !process.env.DEV)
		SelectUserChild.close();
	MainWindow.webContents.send('User:remove-blur');
});
// #endregion

//#region  Work in progress
ipcMain.on('WorkProgress:signal-open-modal', (event) =>
{
	event.reply('WorkProgress:open-modal');
});
ipcMain.on('WorkProgress:signal-close-modal', (event) =>
{
	event.reply('WorkProgress:close-modal');
});
// #endregion

//#region  Update system
ipcMain.on('Update:create-modal', () =>
{
	UpdateWindow = new BrowserWindow({
		width: 640,
		height: 480,
		center: true,
		show: false,
		resizable: true,
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
	MCwindow.openWindow(UpdateWindow, path.join(__dirname, './index.html'));
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
// #endregion
// #endregion

//#region  Dev Tools
ipcMain.on('DevTools:restart', () =>
{
	app.relaunch();
	app.exit(0);
});
// #endregion
