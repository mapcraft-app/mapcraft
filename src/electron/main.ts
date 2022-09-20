import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';

let mainWindow: BrowserWindow | undefined;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		center: true,
		webPreferences: {
			contextIsolation: true,
			devTools: import.meta.env.DEV,
			defaultEncoding: 'utf-8',
			enableWebSQL: false,
			nodeIntegration: false,
			webSecurity: true,
			sandbox: false,
			preload: resolve(__dirname, 'preload.js')
		}
	});

	if (import.meta.env.DEV) {
		mainWindow.loadURL(import.meta.env.ELECTRON_APP_URL);
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(import.meta.env.ELECTRON_APP_URL);
		mainWindow.webContents.on('devtools-opened', () =>
			mainWindow?.webContents.closeDevTools()
		);
	}

	mainWindow.on('closed', () => {
		mainWindow = undefined;
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (mainWindow === undefined) createWindow();
});
