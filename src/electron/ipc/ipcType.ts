import type Electron from 'electron';

export interface ipcDefinition {
	channel: string;
	channels: string[];
}
export interface ipcFunctions {
	// eslint-disable-next-line no-unused-vars
	[index: number]: ((event: Electron.IpcMainEvent, ...args: any[]) => void)
}
export interface ipcListInterface {
	info: ipcDefinition;
	fn: ipcFunctions;
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
