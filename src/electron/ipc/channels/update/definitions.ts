import { ipcDefinition, ipcType } from '@/main/src/electron/ipc/type';

export default {
	channel: 'update',
	channels: [
		{
			name: 'init',
			type: ipcType.SEND,
			reply: 'start'
		},
		{
			name: 'restart',
			type: ipcType.SEND
		}
	]
} as ipcDefinition;
