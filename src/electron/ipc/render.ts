/* eslint-disable no-unused-vars */

/**
 * Import this file inside renderer process (usually preload)
 */
import { contextBridge, ipcRenderer } from 'electron';
import ipcNaming, { ipcDefinition, ipcType } from './ipcType';
import { IpcError } from 'electron/api/error';

import dialogDefinitions from './channels/dialog/definitions';
import windowDefinitions from './channels/window/definitions';

const ipcList: { name: string; type: ipcType }[] = [];
const isExist = (name: string): boolean => {
	for (const channel of ipcList) {
		if (channel.name === name)
			return true;
	}
	return false;
};
const pushImport = (def: ipcDefinition): void => {
	for (const channel of def.channels) {
		ipcList.push({
			name: ipcNaming(def.channel, channel.name),
			type: channel.type
		});
	}
};
pushImport(dialogDefinitions);
pushImport(windowDefinitions);

if (import.meta.env.DEV) {
	console.log('CHANNELS LIST:', ipcList.map((el) => {
		return {
			name: el.name,
			type: (el.type === 0)
				? 'send'
				: 'invoke'
		};
	}));
}

const checkIpc = (channel: string): boolean => {
	if (!ipcRenderer || channel === undefined)
		return true;
	if (!isExist(channel))
		throw new IpcError(`Channel ${channel} doesn't exist`);
	return false;
};

const ipc = {
	invoke: (channel: string, ...args: any[]): Promise<any> | undefined => {
		if (checkIpc(channel))
			return undefined;
		return ipcRenderer.invoke(channel, ...args);
	},
	send: (channel: string, ...args: any[]): void | undefined => {
		if (checkIpc(channel))
			return undefined;
		ipcRenderer.send(channel, ...args);
	},
	receive: (channel: string, fn: (...args: any[]) => void): void | undefined => {
		if (checkIpc(channel))
			return undefined;
		ipcRenderer.once(channel, (_event, ...args) => fn(...args));
	}
};
contextBridge.exposeInMainWorld('ipc', ipc);
export default ipc;
