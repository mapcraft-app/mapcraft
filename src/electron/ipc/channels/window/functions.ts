import { BrowserWindow } from 'electron';
import type Electron from 'electron';
import type { ipcFunctions } from '@/main/src/electron/ipc/type';

export default [
	(event: Electron.IpcMainEvent): void => {
		if (!event.sender.isDevToolsOpened())
			event.sender.openDevTools();
		else
			event.sender.closeDevTools();
	},
	(event: Electron.IpcMainEvent): void => {
		event.sender.close();
	},
	(event: Electron.IpcMainEvent): void => {
		BrowserWindow.fromWebContents(event.sender)?.setFullScreen(
			!BrowserWindow.fromWebContents(event.sender)?.isFullScreen()
		);
	},
	(event: Electron.IpcMainEvent): void => {
		if (!BrowserWindow.fromWebContents(event.sender)?.isMaximized())
			BrowserWindow.fromWebContents(event.sender)?.maximize();
		else
			BrowserWindow.fromWebContents(event.sender)?.unmaximize();
	},
	(event: Electron.IpcMainEvent): void => {
		BrowserWindow.fromWebContents(event.sender)?.minimize();
	},
	(_event: Electron.IpcMainEvent, error: string): void => {
		throw new Error(error);
	}
] as ipcFunctions;
