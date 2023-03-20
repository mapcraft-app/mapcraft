import { ipcDefinition, ipcType } from 'electron/ipc/ipcType';

export default {
	channel: 'notification',
	channels: [
		{
			name: 'push',
			type: ipcType.SEND,
			reply: 'selected'
		}
	]
} as ipcDefinition;
