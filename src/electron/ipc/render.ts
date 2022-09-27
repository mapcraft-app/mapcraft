/**
 * Import this file inside renderer process (usually preload)
 */
import { contextBridge, ipcRenderer } from 'electron';
import type Electron from 'electron';
import ipcNaming, { ipcDefinition } from './ipcType';
import errorDialog from 'electron/api/errorDialog';
import { IpcError } from 'electron/api/error';

import dialogDefinitions from './channels/dialog/definitions';

const ipcList: string[] = [];
const pushImport = (def: ipcDefinition): void => {
	for (const channel of def.channels) {
		ipcList.push(ipcNaming(def.channel, channel, false));
		ipcList.push(ipcNaming(def.channel, channel, true));
	}
};

pushImport(dialogDefinitions);

const ipc = Object.freeze({
	send: (channel: string, ...args: any[]): Promise<Electron.IpcRenderer> | void => {
		if (!ipcRenderer || channel === undefined)
			return;
		if (!ipcList.includes(channel))
			errorDialog(new IpcError(`Channel ${channel} doesn't exist`), false);
		else
			return ipcRenderer.send(channel, ...args);
	},
	// eslint-disable-next-line no-unused-vars
	receive: (channel: string, fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer | void => {
		if (!ipcRenderer || channel === undefined)
			return;
		if (!ipcList.includes(channel))
			errorDialog(new IpcError(`Channel ${channel} doesn't exist`), false);
		else
			return ipcRenderer.once(channel, fn);
	}
});
contextBridge.exposeInMainWorld('ipc', ipc);
export default ipc;
