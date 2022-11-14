import { ipcDefinition, ipcType } from 'electron/ipc/ipcType';

export default {
	channel: 'shell',
	channels: [
		{
			name: 'new-command',
			type: ipcType.SEND,
			reply: 'command'
		}
	]
} as ipcDefinition;
