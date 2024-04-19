import { ipcDefinition, ipcType } from '@/main/src/electron/ipc/type';

export default {
	channel: 'editor',
	channels: [
		{
			name: 'open-editor',
			type: ipcType.SEND,
			reply: 'open'
		},
		{
			name: 'save-editor',
			type: ipcType.SEND,
			reply: 'close'
		},
		{
			name: 'close-editor',
			type: ipcType.SEND,
			reply: 'close'
		}
	]
} as ipcDefinition;
