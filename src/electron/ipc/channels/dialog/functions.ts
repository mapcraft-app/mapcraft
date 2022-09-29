import { dialog, BrowserWindow } from 'electron';
import type Electron from 'electron';
import { ipcFunctions } from 'electron/ipc/ipcType';

const ipcWindow = <BrowserWindow>BrowserWindow.fromId(Number(process.env.WINDOW_ID));

export default [
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile', 'multiSelections' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory', 'multiSelections' ]
		});
	}
] as ipcFunctions;
