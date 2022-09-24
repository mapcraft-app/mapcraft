import { app, BrowserWindow } from 'electron';

import errorDialog from 'src/electron/api/errorDialog';
import { createWindow, loaderWindows } from 'src/electron/api/createWindow';
import generateEnv from 'src/electron/api/generateEnv';

let loader: BrowserWindow | undefined = undefined;
let mainWindow: BrowserWindow | undefined = undefined;
app.whenReady().then(() => {
	loader = loaderWindows();
	mainWindow = createWindow({
		width: 1280,
		height: 720
	});

	generateEnv(app); // Generate process.env variables

	mainWindow?.once('ready-to-show', () => {
		mainWindow?.show();
		loader?.hide();
		loader?.destroy();
	});

	app.on('activate', () => {
		if (mainWindow === undefined)
			createWindow();
	});
}).catch((err) =>{
	loader?.destroy();
	mainWindow?.destroy();
	errorDialog(err);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit();
});

process.on('uncaughtException', () => {
	console.log('hello !');
});