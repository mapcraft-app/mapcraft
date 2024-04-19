import { ipcDefinition, ipcType } from '@/main/src/electron/ipc/type';

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
