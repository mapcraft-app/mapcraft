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
		{
			name: 'open-directory',
			type: ipcType.SEND
		},
		{
			name: 'open-path',
			type: ipcType.SEND
		},
		{
			name: 'open-external',
			type: ipcType.SEND
		}
	]
} as ipcDefinition;
