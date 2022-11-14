import { commandRet } from 'electron/api/shell/interface';
import { ipcFunctions } from 'electron/ipc/ipcType';

export default [
	// eslint-disable-next-line no-undef
	(event: Electron.IpcMainEvent, command: commandRet): void => {
		event.reply('shell::command', command);
	}
] as ipcFunctions;
