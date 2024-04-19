import { commandRet } from '@/electron/api/shell/interface';
import { ipcFunctions } from '@/main/src/electron/ipc/type';
import type Electron from 'electron';

export default [
	(event: Electron.IpcMainEvent, command: commandRet): void => {
		event.reply('shell::command', command);
	}
] as ipcFunctions;
