/* eslint-disable no-unused-vars */

/**
 * Import this file inside renderer process (usually preload)
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import ipcNaming, { ipcDefinition, ipcType } from './ipcType';
import { IpcError } from 'electron/api/error';

import dialogDefinitions from './channels/dialog/definitions';
import editorDefinitions from './channels/editor/definitions';
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
pushImport(editorDefinitions);
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
		return true;
	return false;
};

const ipc = {
	invoke: (channel: string, ...args: any[]): Promise<any> => {
		if (checkIpc(channel))
			throw new Error(`Channel ${channel} doesn't exist`);
		return ipcRenderer.invoke(channel, ...args);
	},
	send: (channel: string, ...args: any[]): void => {
		if (checkIpc(channel))
			throw new Error(`Channel ${channel} doesn't exist`);
		ipcRenderer.send(channel, ...args);
	},
	receive: (channel: string): Promise<any | any[]> => {
		return new Promise((res, rej) => {
			if (checkIpc(channel))
				return rej(`Channel ${channel} doesn't exist`);
			ipcRenderer.once(channel, (_event, ...args) => {
				if (args.length === 1)
					return res(args[0]);
				return res(args);
			});
		});
	},
	receiveAll: (channel: string): Promise<any | any[]> => {
		return new Promise((res, rej) => {
			if (checkIpc(channel))
				return rej(`Channel ${channel} doesn't exist`);
			ipcRenderer.on(channel, (_event, ...args) => {
				if (args.length === 1)
					return res(args[0]);
				return res(args);
			});
		});
	}
};

contextBridge.exposeInMainWorld('ipc', ipc);

export default ipc;
