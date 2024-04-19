import { ipcDefinition, ipcType } from '@/main/src/electron/ipc/type';

export default {
	channel: 'window',
	channels: [
		{
			name: 'dev',
			type: ipcType.SEND
		},
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
		},
		{
			name: 'crash',
			type: ipcType.SEND
		}
	]
} as ipcDefinition;
