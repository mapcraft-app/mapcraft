import { BrowserWindow } from 'electron';
import { resolve } from 'path';
import { WindowError } from 'src/electron/api/error';

export interface optionWindows {
	center?: boolean,
	height?: number,
	nodeIntegration?: boolean,
	preload?: string
	width?: number,
}

const iconLoad = (): string =>
	import.meta.env.DEV
		? resolve(__dirname, '..', 'src', 'public', 'imgs', 'app', 'icon.ico')
		: resolve(__dirname, 'imgs', 'app', 'icon.ico');

export function createWindow(args: optionWindows = {}): BrowserWindow {
	const window = new BrowserWindow({
		center: args.center ?? true,
		width: args.width ?? 800,
		height: args.height ?? 600,
		minHeight: 600,
		minWidth: 800,
		show: false,
		frame: false,
		icon: iconLoad(),
		webPreferences: {
			contextIsolation: true,
			devTools: true,//import.meta.env.DEV,
			defaultEncoding: 'utf-8',
			enableWebSQL: false,
			nodeIntegration: args.nodeIntegration ?? false,
			webSecurity: true,
			sandbox: false,
			preload: args.preload ?? resolve(__dirname, 'preload.js')
		}
	});
	if (!window)
		throw new WindowError('Failed to create app window, close app');
	process.env.WINDOW_ID = String(window.id);

	if (import.meta.env.DEV) {
		window.loadURL(import.meta.env.ELECTRON_APP_URL);
		window.webContents.openDevTools();
	} else
		window.loadFile(import.meta.env.ELECTRON_APP_URL);
	return window;
};

export function loaderWindows(): BrowserWindow {
	const window = new BrowserWindow({
		width: 350,
		height: 350,
		resizable: false,
		alwaysOnTop: true,
		center: true,
		frame: false,
		show: false,
		icon: iconLoad(),
		webPreferences: {
			contextIsolation: true,
			defaultEncoding: 'utf-8',
			devTools: false,
			javascript: false,
			nodeIntegration: false,
			sandbox: true
		}
	});
	if (!window)
		throw new WindowError('Failed to create loader window, close app');

	if (import.meta.env.DEV)
		window.loadURL(import.meta.env.ELECTRON_LOAD_URL);
	else
		window.loadFile(import.meta.env.ELECTRON_LOAD_URL);
	window.once('ready-to-show', () => window.show());
	return window;
};