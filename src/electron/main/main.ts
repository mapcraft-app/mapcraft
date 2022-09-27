import { app, BrowserWindow, dialog } from 'electron';

import errorDialog from 'electron/api/errorDialog';
import { createWindow, loaderWindows } from 'electron/api/createWindow';
import generateEnv from 'electron/api/generateEnv';

let loader: BrowserWindow | undefined = undefined;
let mainWindow: BrowserWindow | undefined = undefined;

app.whenReady().then(async () => {
	if (import.meta.env.DEV)
		import('electron-reload').then((obj) => obj.default(__dirname, {}));

	let isLoading = true;
	loader = loaderWindows();
	mainWindow = createWindow({
		width: 1280,
		height: 720
	});

	loader.once('close', () => {
		if (isLoading)
			app.exit(0);
	});

	generateEnv(app); // Generate process.env variables
	import('src/electron/ipc/main'); // Set IpcMain listeners

	mainWindow.once('ready-to-show', () => {
		isLoading = false;
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

app.on('window-all-closed', async () => {
	if (process.platform !== 'darwin')
		app.quit();
});

process.on('uncaughtException', (err, origin) => {
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
