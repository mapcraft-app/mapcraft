/* eslint-disable no-unused-vars */
import type Electron from 'electron';

export interface ipcDefinition {
	channel: string;
	channels: {
		name: string;
		type: ipcType;
	}[]
}
export interface ipcFunctions {
	// eslint-disable-next-line no-unused-vars
	[index: number]: ((event: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent, ...args: any[]) => void)
}
export interface ipcListInterface {
	info: ipcDefinition;
	fn: ipcFunctions;
}
export enum ipcType {
	SEND = 0,
	INVOKE
}

export const ipcNamingConv = {
	sep: '::',
	response: 'response',
};

export default function ipcNaming(channel: string, definition: string, response = false): string {
	if (!response)
		return `${channel}${ipcNamingConv.sep}${definition}`;
	return `${channel}${ipcNamingConv.sep}${definition}${ipcNamingConv.sep}${ipcNamingConv.response}`;
};
