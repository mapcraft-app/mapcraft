/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserWindow } from 'electron';
import type Electron from 'electron';
import { ipcFunctions } from 'electron/ipc/ipcType';

const ipcWindow = <BrowserWindow>BrowserWindow.fromId(Number(process.env.WINDOW_ID));

export default [
	(_event: Electron.IpcMainEvent): void => {
		if (!ipcWindow.webContents.isDevToolsOpened())
			ipcWindow.webContents.openDevTools();
		else
			ipcWindow.webContents.closeDevTools();
	},
	(_event: Electron.IpcMainEvent): void => {
		ipcWindow.close();
	},
	(_event: Electron.IpcMainEvent): void => {
		ipcWindow.setFullScreen(!ipcWindow.isFullScreen());
	},
	(_event: Electron.IpcMainEvent): void => {
		if (!ipcWindow.isMaximized())
			ipcWindow.maximize();
		else
			ipcWindow.unmaximize();
	},
	(_event: Electron.IpcMainEvent): void => {
		ipcWindow.minimize();
	},
	(_event: Electron.IpcMainEvent, error: string): void => {
		throw new Error(error);
	}
] as ipcFunctions;
