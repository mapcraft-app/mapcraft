import { BrowserWindow } from 'electron';
import { ipcDialog } from './ipcDialog';

export default function ipc(window: BrowserWindow): void {
	ipcDialog(window);
};
