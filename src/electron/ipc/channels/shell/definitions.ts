import { ipcDefinition, ipcType } from '@/main/src/electron/ipc/type';

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
