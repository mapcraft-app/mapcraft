import { BrowserWindow } from 'electron';
import { resolve } from 'path';
import { WindowError } from 'electron/api/common/error';

export interface optionWindows {
	center?: boolean,
	height?: number,
	nodeIntegration?: boolean,
	preload?: string
	width?: number,
}

export function createWindow(args: optionWindows = {}): BrowserWindow | undefined {
	const mainWindow = new BrowserWindow({
		width: args.width ?? 800,
		height: args.height ?? 600,
		center: args.center ?? true,
		show: false,
		webPreferences: {
			contextIsolation: true,
			devTools: import.meta.env.DEV,
			defaultEncoding: 'utf-8',
			enableWebSQL: false,
			nodeIntegration: args.nodeIntegration ?? false,
			webSecurity: true,
			sandbox: false,
			preload: args.preload ?? resolve(__dirname, 'preload.js')
		}
	});
	if (!mainWindow)
		throw new WindowError('Failed to create app window, close app');
	if (import.meta.env.DEV) {
		mainWindow.loadURL(import.meta.env.ELECTRON_APP_URL);
		mainWindow.webContents.openDevTools();
	} else
		mainWindow.loadFile(import.meta.env.ELECTRON_APP_URL);
	return mainWindow;
};

export function loaderWindows(): BrowserWindow | undefined {
	const window = new BrowserWindow({
		width: 350,
		height: 350,
		resizable: false,
		alwaysOnTop: true,
		center: true,
		frame: false,
		show: false,
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