/**
 * Import this file inside main process
 */
import { ipcMain } from 'electron';
import ipcNaming, { ipcDefinition, ipcFunctions, ipcListInterface } from 'src/electron/ipc/ipcType';

import dialogDefinitions from './channels/dialog/definitions';
import dialogFunctions from './channels/dialog/functions';

const importInList = (definition: ipcDefinition, functions: ipcFunctions) => {
	return {
		info: definition,
		fn: functions
	};
};
const ipcList: ipcListInterface[] = [];
ipcList.push(importInList(dialogDefinitions, dialogFunctions));

for (const ipc of ipcList) {
	for (const fn in ipc.fn)
		ipcMain.on(ipcNaming(ipc.info.channel, ipc.info.channels[fn], false), ipc.fn[fn]);
}
