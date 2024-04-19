import { BrowserWindow, app } from 'electron';
import { ipcFunctions } from '@/main/src/electron/ipc/type';
import { updateWindow } from '@/electron/api/createWindow';
import type Electron from 'electron';
import type { update } from '@/electron/preload/checkUpdate';

export default [
	(event: Electron.IpcMainEvent, data: update): void => {
		updateWindow(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, data);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(_event: Electron.IpcMainEvent): void => {
		app.exit(0);
	}
] as ipcFunctions;
