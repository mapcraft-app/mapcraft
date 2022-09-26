import { dialog, BrowserWindow } from 'electron';
import type Electron from 'electron';
import errorDialog from 'electron/api/errorDialog';
import { ipcFunctions } from 'electron/ipc/ipcType';
import ipcNaming from 'electron/ipc/ipcType';
import definitions from './definitions';

const ipcWindow = <BrowserWindow>BrowserWindow.fromId(Number(process.env.WINDOW_ID));

export default [
	(event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): void => {
		dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile' ]
		})
			.then((data) => event.reply(ipcNaming(definitions.channel, definitions.channels[0], true), data))
			.catch((err) => errorDialog(err, false));
	},
	(event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): void => {
		dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openFile', 'multiSelections' ]
		})
			.then((data) => event.reply(ipcNaming(definitions.channel, definitions.channels[1], true), data))
			.catch((err) => errorDialog(err, false));
	},
	(event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): void => {
		dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory' ]
		})
			.then((data) => event.reply(ipcNaming(definitions.channel, definitions.channels[3], true), data))
			.catch((err) => errorDialog(err, false));
	},
 	(event: Electron.IpcMainEvent, defaultPath: string = String(process.env.GAME), filters?: Electron.FileFilter[]): void => {
		dialog.showOpenDialog(ipcWindow, {
			defaultPath,
			filters,
			properties: [ 'openDirectory', 'multiSelections' ]
		})
			.then((data) => event.reply(ipcNaming(definitions.channel, definitions.channels[4], true), data))
			.catch((err) => errorDialog(err, false));
	}
] as ipcFunctions;
