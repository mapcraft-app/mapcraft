import { BrowserWindow } from 'electron';
import { ipcFunctions } from 'electron/ipc/ipcType';
import { updateWindow } from 'electron/api/createWindow';
import type Electron from 'electron';
import type { update } from 'app/src/electron/preload/checkUpdate';

export default [
	(event: Electron.IpcMainEvent, data: update): void => {
		updateWindow(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, data);
	} 
] as ipcFunctions;