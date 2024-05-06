import {
	app,
	BrowserWindow,
	globalShortcut,
	protocol,
	net,
	session,
} from 'electron';
import { normalize } from 'path';
import errorDialog from '@/electron/api/errorDialog';
import { createWindow, loaderWindows } from '@/electron/api/createWindow';
import generateEnv from '@/electron/api/generateEnv';
import updateSystem from '@/electron/main/updateSystem';
import type Log from '@/api/log';

let loader: BrowserWindow | undefined = undefined;
let mainWindow: BrowserWindow | undefined = undefined;
let log: Log;

const SecurityPolicy: string = [
	'default-src',
	'mediastream:', 'blob:', 'filesystem:',
	'\'self\'', '\'unsafe-eval\'', '\'unsafe-inline\'',
	'file://*', 'app://*',
	'https://mapcraft.app', 'https://*.mapcraft.app',
	'https://raw.githubusercontent.com', 'https://github.com',
	'https://gitlab.com',
	'http://cravatar.eu', 'http://localhost:3000'
].join(' ');

protocol.registerSchemesAsPrivileged([
	{
		scheme: 'app',
		privileges: {
			bypassCSP: true,
			secure: true,
			supportFetchAPI: true,
			stream: true
		}
	}
]);

app.whenReady().then(async () => {
	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': SecurityPolicy
			}
		});
	});

	protocol.handle('app', (req) => net.fetch(
		normalize(
			decodeURIComponent(req.url.replace(/app:\/{2,3}/gi, ''))
		)
	));

	generateEnv(app); // Generate process.env variables
	log = (await import('@/api/log')).log;
	if (import.meta.env.DEV)
		console.log('log file:', log.filePath);
	log.info('Electron started');
	log.info('Initialize application');
	log.info('Initialize main and loader window');

	log.info('Check update system');
	updateSystem();

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

	import('@/electron/ipc/main'); // Set IpcMain listeners
	
	mainWindow.on('ready-to-show', () => {
		log.info('Main window ready to show');
		isLoading = false;
		if (mainWindow) {
			mainWindow.show();
			mainWindow.focus();
		}
		if (loader)
			loader.destroy();
	});

	app.on('activate', () => {
		if (mainWindow === undefined)
			createWindow();
	});
}).catch((err) => {
	log.error(err);
	if (loader)
		loader.destroy();
	if (mainWindow)
		mainWindow.destroy();
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
	log.error(origin.toString());
	log.error(err.message);
	log.error('Mapcraft exit with uncaughtException');
	errorDialog(err, true);
});
