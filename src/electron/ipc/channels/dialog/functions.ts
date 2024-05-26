import { dialog, shell, BrowserWindow, OpenDialogReturnValue } from 'electron';
import type Electron from 'electron';
import type { ipcFunctions } from '@/main/src/electron/ipc/type';

export default [
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<OpenDialogReturnValue> => {
		return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<OpenDialogReturnValue> => {
		return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile', 'multiSelections' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<OpenDialogReturnValue> => {
		return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory' ]
		});
	},
	async (event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): Promise<OpenDialogReturnValue> => {
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
