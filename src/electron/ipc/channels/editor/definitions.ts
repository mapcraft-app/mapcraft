import { ipcDefinition, ipcType } from 'electron/ipc/ipcType';

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
