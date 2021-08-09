const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const process = require('process');
const child = require('child_process');
const path = require('path');
const OS = require('os');
const fs = require('fs');
const http = require('http');
const https = require('https');
const axios = require('axios');
const Database = require('better-sqlite3');
const MCwindow = require('./dist/js/MCwindow');
const MCshell = require('./dist/js/MCshell');
const MCeditor = require('./dist/js/MCeditor');

//#region Variables
var StartWindow = null, MainWindow = null, SelectUserChild = null, UpdateWindow = null;
var IsSelectedUser = false;
let PassFirstStep = false;

var SaveCurrentUser = {
	DBpath: String,
	Username: String,
	UUID: String
}
//#endregion

//#region Main system

//#region Update updateSystem
var UpdateExecutableIsPresent = false;
function download(url, destination, callback)
{
	const file = fs.createWriteStream(destination);
	let httpMethod;
	if (url.indexOf(('https://')) !== -1)
		httpMethod = https;
	else
		httpMethod = http;
	const request = httpMethod.get(url, (response) => {
		if (response.statusCode !== 200)
			return callback(response.statusCode + ' error to ' + url);
		response.pipe(file);
		file.on('finish', () => {
			file.close(callback);
		});
	});
	request.on('error', (err) => {
		fs.unlink(destination);
		callback(err.message);
	});
	file.on('error', (err) => {
		fs.unlink(destination);
		callback(err.message);
	});
}
async function Update_UpdateSystem()
{
	const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, './manifest'), {encoding: 'utf-8', flag: 'r'}));
	const plateform = OS.platform();
	const cwd = process.cwd();
	const json = await axios({
		method: 'get',
		url: 'https://api.mapcraft.app/update'
	});
	let _url;
	let executable;
	if (plateform === 'win32')
	{
		_url = json.data.windows.url;
		executable = "update.exe";
	}
	else if (plateform === 'darwin')
	{
		_url = json.data.darwin.url;
		executable = "update";
	}
	else
	{
		_url = json.data.linux.url;
		executable = "update";
	}
	const access = path.join(cwd, executable);
	if (manifest.version.update === json.data.version && fs.existsSync(access))
	{
		UpdateExecutableIsPresent = true;
		return ;
	}
	if (fs.existsSync(access)) fs.rmSync(access, {force: true});
	download(_url, access, (err) => {
		if (err)
		{
			console.error(err);
			return ;
		}
		UpdateExecutableIsPresent = true;
	});
}
Update_UpdateSystem();
//#endregion

function CreateWindow(preload)
{
	let window = MCwindow.CreateWindow(1280, 720, preload);
	MCwindow.OpenWindow(window, path.join(__dirname, 'index.html'));
	return (window);
};

function QuitServices()
{
	if (!MainWindow)
		return ;
	const MClink = require('./dist/js/MClink');
	MClink.cleanComponents();
	let db = Database(SaveCurrentUser.DBpath, { verbose: console.log });
	const sql = db.prepare('UPDATE User SET IsConnected = 0 WHERE Username = ?');
	sql.run(SaveCurrentUser.Username);
	db.close();
}

app.on('ready', () => {
	if (!PassFirstStep)
	{
		StartWindow = CreateWindow(path.join(__dirname, '/dist/template/Start/main.js'))
		StartWindow.once('ready-to-show', () => {
			StartWindow.show();
		});
	}
	else
		OpenMainWindow();
});

if (require('electron-squirrel-startup')) {
	QuitServices();
	app.quit();
}

app.on('window-all-closed', () => {
	QuitServices();
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0)
	{
		if (!PassFirstStep)
			StartWindow = CreateWindow(StartWindow, path.join(__dirname, '/dist/template/Start/main.js'));
		else
			OpenMainWindow();
	}
});
//#endregion

//#region Main Window system
let WindowUser = () => {
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
			preload: path.join(__dirname, '/dist/template/SelectUser/main.js')
		}
	});
	SelectUserChild.setMenuBarVisibility(false);
	MCwindow.OpenWindow(SelectUserChild, path.join(__dirname, 'index.html'));
};

function OpenMainWindow() {
	if (MainWindow)
		MainWindow.focus();
	else
		MainWindow = CreateWindow(path.join(__dirname, '/dist/template/Main/main.js'));
	WindowUser();
	SelectUserChild.once('ready-to-show', () => {
		SelectUserChild.show();
	});
	SelectUserChild.on('closed', () => {
		SelectUserChild = null;
		if (!IsSelectedUser)
			MainWindow.close();
	});
	MainWindow.once('ready-to-show', () => {
		MainWindow.show();
	});
	MainWindow.on('closed', () => {
		MainWindow = null;
	})
	if (!PassFirstStep)
		StartWindow.close();
}
//#endregion

//#region IPC signal (Alphabetic order)
//#region Dialog
ipcMain.on('Dialog:open-directory', (event, element, path) => {
	dialog.showOpenDialog({
		defaultPath: path,
		properties: ['openDirectory']
	}).then(data => {
		event.reply('Dialog:selected-directory', data, element);
	}).catch(error => {
		console.error(error);
	});
});
ipcMain.on('Dialog:open-file', (event, element, path) => {
	dialog.showOpenDialog({
		defaultPath: path,
		properties: ['openFile']
	}).then(data => {
		event.reply('Dialog:selected-file', data, element);
	}).catch(error => {
		console.error(error);
	});
});
//#endregion

//#region Editor
ipcMain.on('Editor:open', (event, link) => {
	event.reply('Editor:open-modal', MCeditor.OpenFile(link));
});
ipcMain.on('Editor:save-file', (event, data) => {
	MCeditor.SaveFile(data);
	event.reply('Editor:close-modal');
});
ipcMain.on('Editor:close', (event) => {
	MCeditor.CloseFile();
	event.reply('Editor:close-modal');
});
//#endregion

//#region Log
ipcMain.on('Log:is-change', (event, fullFile, newData) => {
	let array;
	let command;
	if (newData !== null)
	{
		array = newData.split(/\r?\n/);
		for (let id in array)
		{
			command = MCshell.parse(array[id]);
			if (command)
				event.reply('Shell:new-command', command);
		}
	}
	else
		array = null;
	event.reply('Log:send-change', fullFile, array)
});
//#endregion

//#region Notification
ipcMain.on('Notification:click-notification', () => {
	MainWindow.focus();
});
//#endregion

//#region Plugin
ipcMain.on('Plugin:is-changed', (event, plugin, name) => {
	event.reply('Plugin:update-interface', plugin, name);
});
//#endregion

//#region Shell
ipcMain.on('Shell:send-command', (event, command) => {
	event.reply('Shell:execute-command', command);
});
//#endregion

//#region Start
ipcMain.on('Start:is-selected-world', () => {
	OpenMainWindow();
});
//#endregion

//#region Trigger
ipcMain.on('Trigger:signal-open-modal', (event, command) => {
	event.reply('Trigger:open-modal', command);
});
//#endregion

//#region Cutscene
ipcMain.on('Cutscene:signal-create-cutscene', (event, command) => {
	event.reply('Cutscene:create-cutscene', command);
});
//#endregion

//#region User
ipcMain.on('User:change-username', () => {
	IsSelectedUser = true;
	PassFirstStep = true;
	OpenMainWindow();
});
ipcMain.on('User:close-window', (event, DBPath, JSON) => {
	IsSelectedUser = true;
	MainWindow.webContents.send('User:remove-blur');
	SaveCurrentUser.Username = JSON.Username;
	SaveCurrentUser.UUID = JSON.UUID;
	SaveCurrentUser.DBpath = DBPath;
	SelectUserChild.close();
});
//#endregion

//#region Work in progress
ipcMain.on('WorkProgress:signal-open-modal', (event) => {
	event.reply('WorkProgress:open-modal');
});
ipcMain.on('WorkProgress:signal-close-modal', (event) => {
	event.reply('WorkProgress:close-modal');
});
//#endregion

//#region Update system
ipcMain.on('Update:create-modal', (event) => {
	UpdateWindow = new BrowserWindow({
		width: 640,
		height: 480,
		center: true,
		show: false,
		titleBarStyle: 'hidden',
		parent: MainWindow,
		modal: true,
		frame: true,
		icon: path.join(__dirname, '/dist/img/icon/icon.ico'),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '/dist/template/Update/main.js')
		}
	});
	UpdateWindow.setMenuBarVisibility(false);
	MCwindow.OpenWindow(UpdateWindow, path.join(__dirname, './index.html'));
	UpdateWindow.once('ready-to-show', () => {
		UpdateWindow.show();
	});
});
ipcMain.on('Update:close-modal', (event) => {
	UpdateWindow.close();
});
ipcMain.on('Update:make-update', (event, _temp_path, _zip_path, _unzip_path) => {
	let executable;
	
	let interval = setInterval(wait, 2000);
	function wait() {
		if (UpdateExecutableIsPresent === true)
			clearInterval(interval);
		else
			console.log('Update executable not finish to download, retry in 2s');
	}
	
	if (SelectUserChild) SelectUserChild.close();
	if (UpdateWindow) UpdateWindow.close();
	if (MainWindow) MainWindow.close();
	if (OS.platform() === 'win32') executable = "update.exe";
	else executable = "update";

	const EXECUTABLE = path.join(process.cwd(), executable);
	var update = child.spawn(EXECUTABLE, {detached: true, stdio: ['ignore' /* stdin */, 'ignore' /* stdout */, 'ignore' /* stderr */]});
	update.unref();
	app.exit();
});
//#endregion
//#endregion
