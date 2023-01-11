import { dialog, shell, BrowserWindow } from 'electron';
import type Electron from 'electron';
import { ipcFunctions } from 'electron/ipc/ipcType';

const ipcWindow = <BrowserWindow>BrowserWindow.fromId(Number(process.env.WINDOW_ID));

export default [
	async (_event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile' ]
		});
	},
	async (_event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile', 'multiSelections' ]
		});
	},
	async (_event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory' ]
		});
	},
	async (_event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory', 'multiSelections' ]
		});
	},
	(_event: Electron.IpcMainEvent, path: string): void => shell.showItemInFolder(path),
	(_event: Electron.IpcMainEvent, path: string): Promise<string> => shell.openPath(path),
	(_event: Electron.IpcMainEvent, path: string, options?: globalThis.Electron.OpenExternalOptions): Promise<void> => shell.openExternal(path, options)
] as ipcFunctions;
