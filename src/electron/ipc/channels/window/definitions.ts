import { ipcDefinition, ipcType } from 'electron/ipc/ipcType';

export default {
	channel: 'window',
	channels: [
		{
			name: 'close',
			type: ipcType.SEND
		},
		{
			name: 'fullscreen',
			type: ipcType.SEND
		},
		{
			name: 'maximize',
			type: ipcType.SEND
		},
		{
			name: 'minimize',
			type: ipcType.SEND
		}
	]
} as ipcDefinition;