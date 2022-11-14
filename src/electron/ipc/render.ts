/* eslint-disable no-unused-vars */

/**
 * Import this file inside renderer process (usually preload)
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import ipcNaming, { ipcDefinition, ipcType } from './ipcType';
import { IpcError } from 'electron/api/error';

import dialogDefinitions from './channels/dialog/definitions';
import shellDefinitions from './channels/shell/definitions';
import windowDefinitions from './channels/window/definitions';

const ipcList: {
	name: string;
	reply?: string;
	type: ipcType
}[] = [];
const isExist = (name: string): boolean => {
	for (const channel of ipcList) {
		if ((channel.type === ipcType.SEND && channel.reply && channel.reply === name)
			|| channel.name === name)
			return true;
	}
	return false;
};
const pushImport = (def: ipcDefinition): void => {
	for (const channel of def.channels) {
		ipcList.push({
			name: ipcNaming(def.channel, channel.name),
			reply: (channel.reply)
				? ipcNaming(def.channel, channel.reply)
				: undefined,
			type: channel.type
		});
	}
};

pushImport(dialogDefinitions);
pushImport(shellDefinitions);
pushImport(windowDefinitions);

if (import.meta.env.DEV) {
	console.log('CHANNELS LIST:', ipcList.map((el) => {
		const ret: Record<string, string> = {
			name: el.name,
			type: (el.type === 0)
				? 'send'
				: 'invoke'
		};
		if (el.reply)
			ret.reply = el.reply;
		return ret;
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
	// eslint-disable-next-line no-undef
	receive: (channel: string, fn: (...args: any[]) => void): Electron.IpcRenderer | undefined => {
		if (checkIpc(channel))
			return undefined;
		ipcRenderer.once(channel, (_event, ...args) => fn(...args));
	},
	// eslint-disable-next-line no-undef
	receiveAll: (channel: string, fn: (event: IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer | undefined => {
		if (checkIpc(channel))
			return undefined;
		return ipcRenderer.on(channel, fn);
	}
};
contextBridge.exposeInMainWorld('ipc', ipc);
export default ipc;
