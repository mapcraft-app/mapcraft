import { ipcRenderer } from 'electron';
import type Electron from 'electron';

import { ipcDialogDefinition } from 'electron/main/ipcDialog';

import { responseDefinition } from 'electron/api/ipcNaming';
import { IpcError } from 'electron/api/error';
import errorDialog from 'electron/api/errorDialog';

const channels = [
	ipcDialogDefinition
];

const channelExist = (channel: string, ret = false): boolean => {
	for (const chan of channels) {
		for (const desc of chan) {
			if (!ret && desc === channel)
				return true;
			else if (ret) {
				if (desc === channel.slice(0, (channel.length + 1 - (responseDefinition.sep.length + responseDefinition.response.length))))
					return true;
			}
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
