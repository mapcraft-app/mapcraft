import { commandRet } from 'electron/api/shell/interface';
import { ipcFunctions } from 'electron/ipc/ipcType';
import type Electron from 'electron';

export default [
	(event: Electron.IpcMainEvent, command: commandRet): void => {
		event.reply('shell::command', command);
	}
] as ipcFunctions;
