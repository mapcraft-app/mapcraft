import { dialog, shell, BrowserWindow } from 'electron';
import type Electron from 'electron';
import type { ipcFunctions } from 'electron/ipc/ipcType';

export default [
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile', 'multiSelections' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<any> => {
		return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory', 'multiSelections' ]
		});
	},
	(_event: Electron.IpcMainEvent, path: string): void => shell.showItemInFolder(path),
	(_event: Electron.IpcMainEvent, path: string): Promise<string> => shell.openPath(path),
	(_event: Electron.IpcMainEvent, path: string, options?: globalThis.Electron.OpenExternalOptions): Promise<void> => shell.openExternal(path, options)
] as ipcFunctions;
