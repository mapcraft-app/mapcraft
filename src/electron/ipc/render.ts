/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Import this file inside renderer process (usually preload)
 */
import { contextBridge, ipcRenderer } from 'electron';
import ipcNaming, { ipcDefinition, ipcType } from './type';

import dialogDefinitions from './channels/dialog/definitions';
import editorDefinitions from './channels/editor/definitions';
import fileDefinitions from './channels/file/definitions';
import notificationDefinitions from './channels/notification/definitions';
import shellDefinitions from './channels/shell/definitions';
import updateDefitions from './channels/update/definitions';
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
pushImport(editorDefinitions);
pushImport(fileDefinitions);
pushImport(notificationDefinitions);
pushImport(shellDefinitions);
pushImport(updateDefitions);
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
	}).sort((a, b) => a.name.localeCompare(b.name)));
}
ipcRenderer.setMaxListeners(Infinity);

const checkIpc = (channel: string): boolean => {
	if (!ipcRenderer || channel === undefined)
		return true;
	if (!isExist(channel))
		return true;
	return false;
};

const ipcErrorMessage = (channel: string) => {
	if (checkIpc(channel))
		throw new Error(`Channel ${channel} doesn't exist`);
};

const ipc = {
	invoke: (channel: string, ...args: any[]): Promise<any> => {
		ipcErrorMessage(channel);
		return ipcRenderer.invoke(channel, ...args);
	},
	send: (channel: string, ...args: any[]): void => {
		ipcErrorMessage(channel);
		ipcRenderer.send(channel, ...args);
	},
	receive: (channel: string, fn: (..._args: any[]) => void): void => {
		ipcErrorMessage(channel);
		ipcRenderer.once(channel, (_event, ...args) => fn(...args));
	},
	receiveAll: (channel: string, fn: (..._args: any[]) => void): void => {
		ipcErrorMessage(channel);
		ipcRenderer.on(channel, (_event, ...args) => fn(...args));
	},
	remove: (channel: string, fn: (..._args: any[]) => void): void => {
		ipcErrorMessage(channel);
		ipcRenderer.removeListener(channel, (_event, ...args) => fn(...args));
	},
	removeAll: (channel: string): void => {
		ipcRenderer.removeAllListeners(channel);
	}
};

contextBridge.exposeInMainWorld('ipc', ipc);

export default ipc;
