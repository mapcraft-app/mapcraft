import { app, BrowserWindow, dialog } from 'electron';

import Log from 'api/log';

import errorDialog from 'electron/api/errorDialog';
import { createWindow, loaderWindows } from 'electron/api/createWindow';
import generateEnv from 'electron/api/generateEnv';

let loader: BrowserWindow | undefined = undefined;
let mainWindow: BrowserWindow | undefined = undefined;
let log: Log;

app.whenReady().then(async () => {
	if (import.meta.env.DEV)
		import('electron-reload').then((obj) => obj.default(__dirname, {}));

	generateEnv(app); // Generate process.env variables
	log = new Log(); // Initialize logger
	log.info('Electron started');
	log.info('Initialize application');
	log.info('Initialize main and loader window');

	let isLoading = true;
	loader = loaderWindows();
	mainWindow = createWindow({
		width: 1280,
		height: 720
	});
	loader.focus();
	loader.once('close', () => {
		if (isLoading)
			app.exit(0);
	});
	
	import('src/electron/ipc/main'); // Set IpcMain listeners

	mainWindow.on('ready-to-show', () => {
		log.info('Main window ready to show');
		isLoading = false;
		mainWindow?.show();
		mainWindow?.focus();
		loader?.hide();
		loader?.destroy();
	});

	app.on('activate', () => {
		if (mainWindow === undefined)
			createWindow();
	});
}).catch((err) => {
	log.error(err.message);
	loader?.destroy();
	mainWindow?.destroy();
	errorDialog(err);
});

app.on('window-all-closed', async () => {
	if (process.platform !== 'darwin') {
		log.info('Electron application quit');
		app.quit();
	}
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
	log.error(err.toString());
	log.warn('Mapcraft exit with error code 1');
	dialog.showMessageBoxSync(messageBoxOptions);
	app.exit(1);
});
