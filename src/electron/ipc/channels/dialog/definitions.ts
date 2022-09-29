import { ipcDefinition, ipcType } from 'electron/ipc/ipcType';

export default {
	channel: 'dialog',
	channels: [
		{
			name: 'select-file',
			type: ipcType.INVOKE
		},
		{
			name: 'select-files',
			type: ipcType.INVOKE
		},
		{
			name: 'select-directory',
			type: ipcType.INVOKE
		},
		{
			name: 'select-directories',
			type: ipcType.INVOKE
		},
	]
} as ipcDefinition;
