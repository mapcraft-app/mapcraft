/**
 * Import this file inside renderer process (usually preload)
 */
import { ipcRenderer } from 'electron';
import type Electron from 'electron';
import ipcNaming, { ipcDefinition } from './ipcType';
import errorDialog from 'electron/api/errorDialog';
import { IpcError } from 'electron/api/error';

import dialogDefinitions from './channels/dialog/definitions';

const ipcList: ipcDefinition[] = [];
ipcList.push(dialogDefinitions);

const channelExist = (channelName: string, isReceive = false): boolean => {
	for (const ipc of ipcList) {
		for (const channel of ipc.channels) {
			if (ipcNaming(ipc.channel, channel, isReceive) === channelName)
				return true;
		}
	}
	return false;
};

export default {
	send: (channel: string, ...args: any[]): Promise<Electron.IpcRenderer> | void => {
		if (!ipcRenderer || channel === undefined)
			return;
		if (!channelExist(channel))
			errorDialog(new IpcError(`Channel ${channel} doesn't exist`), false);
		else
			return ipcRenderer.send(channel, ...args);
	},
	// eslint-disable-next-line no-unused-vars
	receive: (channel: string, fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer | void => {
		if (!ipcRenderer || channel === undefined)
			return;
		if (!channelExist(channel, true))
			errorDialog(new IpcError(`Channel ${channel} doesn't exist`), false);
		else
			return ipcRenderer.once(channel, fn);
	}
};
