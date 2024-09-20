import { ipcDefinition, ipcType } from '@/main/src/electron/ipc/type';

export default {
	channel: 'file',
	channels: [
		{
			name: 'get-duration',
			type: ipcType.INVOKE,
		}
	]
} as ipcDefinition;
