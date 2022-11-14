/**
 * Import this file inside main process
 */
import { ipcMain } from 'electron';
import ipcNaming, { ipcDefinition, ipcFunctions, ipcListInterface, ipcType } from './ipcType';

import dialogDefinitions from './channels/dialog/definitions';
import dialogFunctions from './channels/dialog/functions';

import shellDefinitions from './channels/shell/definitions';
import shellFunctions from './channels/shell/functions';

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
importInList(shellDefinitions, shellFunctions);
importInList(windowDefinitions, windowFunctions);

for (const ipc of ipcList) {
	for (const x in ipc.fn) {
		switch (ipc.info.channels[x].type) {
		case ipcType.SEND:
			ipcMain.on(ipcNaming(ipc.info.channel, ipc.info.channels[x].name), ipc.fn[x]);
			break;
		case ipcType.INVOKE:
		default:
			ipcMain.handle(ipcNaming(ipc.info.channel, ipc.info.channels[x].name), ipc.fn[x]);
		}
	}
}
