/**
 * Import this file inside main process
 */
import { ipcMain } from 'electron';
import ipcNaming, { ipcDefinition, ipcFunctions, ipcListInterface, ipcType } from './type';

import dialogDefinitions from './channels/dialog/definitions';
import dialogFunctions from './channels/dialog/functions';

import editorDefinitions from './channels/editor/definitions';
import editorFunctions from './channels/editor/functions';

import fileDefinitions from './channels/file/definitions';
import fileFunctions from './channels/file/functions';

import notificationDefinitions from './channels/notification/definitions';
import notificationFunctions from './channels/notification/functions';

import shellDefinitions from './channels/shell/definitions';
import shellFunctions from './channels/shell/functions';

import updateDefinitions from './channels/update/definitions';
import updateFunctions from './channels/update/functions';

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
importInList(editorDefinitions, editorFunctions);
importInList(fileDefinitions, fileFunctions);
importInList(notificationDefinitions, notificationFunctions);
importInList(shellDefinitions, shellFunctions);
importInList(updateDefinitions, updateFunctions);
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
