import { BrowserWindow } from 'electron';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { WindowError } from '@/electron/api/error';
import type { update } from '@/electron/preload/checkUpdate';

export interface optionWindows {
	center?: boolean,
	height?: number,
	nodeIntegration?: boolean,
	preload?: string
	width?: number,
}

type windowType = 'main' | 'loader' | 'update';
interface windowSave {
	w: BrowserWindow;
	d: Date;
}

export const windowInstance: Map<windowType, windowSave> = new Map();
const pushWindow = (w: BrowserWindow, type: windowType) => {
	windowInstance.set(type, {
		w,
		d: new Date()
	});
};
const rmWindow = (w: BrowserWindow) => {
	for (const wi of windowInstance) {
		if (wi[1].w.id === w.id) {
			windowInstance.delete(wi[0]);
			return;
		}
	}
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconLoad = (): string => import.meta.env.DEV
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
			devTools: import.meta.env.DEV,
			defaultEncoding: 'utf-8',
			enableWebSQL: false,
			nodeIntegration: args.nodeIntegration ?? false,
			webSecurity: !import.meta.env.DEV,
			sandbox: false,
			preload: args.preload ?? resolve(__dirname, 'preload.mjs')
		}
	});
	if (!window)
		throw new WindowError('Failed to create app window, close app');
	if (import.meta.env.DEV) {
		window.loadURL(import.meta.env.ELECTRON_APP_URL);
		window.webContents.openDevTools();
	} else
		window.loadFile(import.meta.env.ELECTRON_APP_URL);
	pushWindow(window, 'main');
	window.on('close', () => rmWindow(window));
	return window;
};

export function updateWindow(parent: BrowserWindow, data: update): BrowserWindow {
	const window = new BrowserWindow({
		parent,
		width: 450,
		height: 450,
		minHeight: 450,
		minWidth: 450,
		show: false,
		frame: false,
		modal: true,
		icon: iconLoad(),
		webPreferences: {
			contextIsolation: true,
			devTools: import.meta.env.DEV,
			defaultEncoding: 'utf-8',
			enableWebSQL: false,
			nodeIntegration: false,
			webSecurity: true,
			sandbox: false,
			preload: resolve(__dirname, 'preload.mjs')
		}
	});
	if (!window)
		throw new WindowError('Failed to create update window, close app');
	if (import.meta.env.DEV) {
		window.loadURL(import.meta.env.ELECTRON_APP_URL);
		window.webContents.openDevTools();
	} else
		window.loadFile(import.meta.env.ELECTRON_APP_URL);
	pushWindow(window, 'update');
	window.once('ready-to-show', () => {
		window.webContents.send('update::start', data);
		window.show();
	});
	window.on('close', () => {
		rmWindow(window);
	});
	return window;
};

export function loaderWindows(): BrowserWindow {
	const window = new BrowserWindow({
		width: 350,
		height: 350,
		resizable: false,
		alwaysOnTop: false,
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
	pushWindow(window, 'loader');
	window.on('close', () => rmWindow(window));
	window.once('ready-to-show', () => window.show());
	return window;
};
