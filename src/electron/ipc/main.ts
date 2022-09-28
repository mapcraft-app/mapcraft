/**
 * Import this file inside main process
 */
import { ipcMain } from 'electron';
import ipcNaming, { ipcDefinition, ipcFunctions, ipcListInterface } from 'src/electron/ipc/ipcType';

import dialogDefinitions from './channels/dialog/definitions';
import dialogFunctions from './channels/dialog/functions';

import windowDefinitions from './channels/window/definitions';
import windowFunctions from './channels/window/functions';

const ipcList: ipcListInterface[] = [];
const importInList = (definition: ipcDefinition, functions: ipcFunctions): void => {
	ipcList.push({
		info: definition,
		fn: functions
	});
};
importInList(dialogDefinitions, dialogFunctions);
importInList(windowDefinitions, windowFunctions);

const help = [];
for (const ipc of ipcList) {
	const _help = {
		name: ipc.info.channel,
		channels: [] as string[]
	};
	for (const fn in ipc.fn) {
		_help.channels.push(ipcNaming(ipc.info.channel, ipc.info.channels[fn], false));
		ipcMain.on(ipcNaming(ipc.info.channel, ipc.info.channels[fn], false), ipc.fn[fn]);
	}
	help.push(_help);
}

console.log(help);