/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserWindow } from 'electron';
import type Electron from 'electron';
import { ipcFunctions } from 'electron/ipc/ipcType';

const ipcWindow = <BrowserWindow>BrowserWindow.fromId(Number(process.env.WINDOW_ID));

export default [
	(event: Electron.IpcMainEvent): void => {
		ipcWindow.close();
	},
	(event: Electron.IpcMainEvent): void => {
		ipcWindow.setFullScreen(!ipcWindow.isFullScreen());
	},
	(event: Electron.IpcMainEvent): void => {
		if (!ipcWindow.isMaximized())
			ipcWindow.maximize();
		else
			ipcWindow.unmaximize();
	},
	(event: Electron.IpcMainEvent): void => {
		ipcWindow.minimize();
	}
] as ipcFunctions;
