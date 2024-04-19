import { editor } from 'mapcraft-api/backend';
import { ipcFunctions } from '@/main/src/electron/ipc/type';
import type Electron from 'electron';

export default [
	(event: Electron.IpcMainEvent, pathToFile: string): void => {
		const data = editor.openFile(pathToFile);
		event.reply('editor::open', data);
	},
	(event: Electron.IpcMainEvent, data: string): void => {
		editor.saveFile(data);
		event.reply('editor::save');
	},
	(event: Electron.IpcMainEvent): void => {
		event.reply('editor::close');
	}
] as ipcFunctions;
