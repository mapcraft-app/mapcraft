import {
	app,
	BrowserWindow,
	dialog,
	globalShortcut,
	protocol,
	session
} from 'electron';

import type Log from 'api/log';
import errorDialog from 'electron/api/errorDialog';
import { createWindow, loaderWindows } from 'electron/api/createWindow';
import generateEnv from 'electron/api/generateEnv';
import { normalize } from 'path';

let loader: BrowserWindow | undefined = undefined;
let mainWindow: BrowserWindow | undefined = undefined;
let log: Log;

const SecurityPolicy: string[] = [
	'default-src',
	'mediastream:', 'blob:', 'filesystem:',
	'\'self\'', '\'unsafe-eval\'', '\'unsafe-inline\'',
	'file:///*', 'app:///*',
	'https://mapcraft.app', 'https://*.mapcraft.app',
	'https://crafatar.com', 'http://localhost:3000'
];

protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { bypassCSP: true }}
]);

app.whenReady().then(async () => {
	if (import.meta.env.DEV)
		import('electron-reload').then((obj) => obj.default(__dirname, {}));

	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': SecurityPolicy.join(' ')
			}
		});
	});

	protocol.interceptFileProtocol('app', (req, call) => {
		const url = decodeURIComponent(req.url.replace('app:///', '').replace('app://', ''));
		call({ path: normalize(url) });
	});

	generateEnv(app); // Generate process.env variables
	log = (await import('api/log')).log;
	console.log(log.filePath);
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

if (import.meta.env.DEV) {
	app.on('browser-window-focus', () => {
		globalShortcut.register('CommandOrControl+R', () => {
			// disabled
		});
		globalShortcut.register('F5', () => {
			// disabled
		});
	});
	app.on('browser-window-blur', () => {
		globalShortcut.unregister('CommandOrControl+R');
		globalShortcut.unregister('F5');
	});
}

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
