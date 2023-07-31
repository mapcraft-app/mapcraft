import { ipcDefinition, ipcType } from 'electron/ipc/ipcType';

export default {
	channel: 'update',
	channels: [
		{
			name: 'init',
			type: ipcType.SEND,
			reply: 'start'
		}
	]
} as ipcDefinition;
