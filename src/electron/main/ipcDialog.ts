import { dialog, ipcMain } from 'electron';
import type Electron from 'electron';
import errorDialog from 'electron/api/errorDialog';
import ipcNaming from 'electron/api/ipcNaming';

const channel = 'dialog';

export const ipcDialogDefinition = [
	ipcNaming(channel, 'select-file'),
	ipcNaming(channel, 'select-files'),
	ipcNaming(channel, 'select-directory'),
	ipcNaming(channel, 'select-directories')
];

export function ipcDialog(window: Electron.BrowserWindow): void {
	ipcMain.on(ipcNaming(channel, 'select-file'), (
		event: Electron.IpcMainEvent,
		defaultPath: string = String(process.env.GAME),
		filters?: Electron.FileFilter[]
	) => {
		dialog.showOpenDialog(window, {
			defaultPath,
			filters,
			properties: [ 'openFile' ]
		})
			.then((data) => event.reply(
				ipcNaming(channel, 'select-file', true),
				data.canceled,
				data.filePaths)
			)
			.catch((err) => errorDialog(err));
	});

	ipcMain.on(ipcNaming(channel, 'select-files'), (
		event: Electron.IpcMainEvent,
		defaultPath: string = String(process.env.GAME),
		filters?: Electron.FileFilter[]
	) => {
		dialog.showOpenDialog(window, {
			defaultPath,
			filters,
			properties: [ 'openFile', 'multiSelections' ]
		})
			.then((data) => event.reply(
				ipcNaming(channel, 'select-files', true),
				data.canceled,
				data.filePaths)
			)
			.catch((err) => errorDialog(err));
	});

	ipcMain.on(ipcNaming(channel, 'select-directory'), (
		event: Electron.IpcMainEvent,
		defaultPath: string = String(process.env.GAME),
		filters?: Electron.FileFilter[]
	) => {
		dialog.showOpenDialog(window, {
			defaultPath,
			filters,
			properties: [ 'openDirectory' ]
		})
			.then((data) => event.reply(
				ipcNaming(channel, 'select-directory', true),
				data.canceled,
				data.filePaths)
			)
			.catch((err) => errorDialog(err));
	});

	ipcMain.on(ipcNaming(channel, 'select-directories'), (
		event: Electron.IpcMainEvent,
		defaultPath: string = String(process.env.GAME),
		filters?: Electron.FileFilter[]
	) => {
		dialog.showOpenDialog(window, {
			defaultPath,
			filters,
			properties: [ 'openDirectory', 'multiSelections' ]
		})
			.then((data) => event.reply(
				ipcNaming(channel, 'select-directories', true),
				data.canceled,
				data.filePaths)
			)
			.catch((err) => errorDialog(err));
	});
};
