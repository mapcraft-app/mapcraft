import { ipcDefinition } from 'electron/ipc/ipcType';

export default {
	channel: 'window',
	channels: [ 'close', 'fullscreen', 'maximize', 'minimize' ]
} as ipcDefinition;
