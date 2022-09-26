import { ipcDefinition } from 'electron/ipc/ipcType';

export default {
	channel: 'dialog',
	channels: [ 'select-file', 'select-files', 'select-directory', 'select-directories' ]
} as ipcDefinition;
