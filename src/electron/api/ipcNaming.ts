export const responseDefinition = {
	sep: '::',
	response: 'response'
};

export default function ipcNaming(channel: string, definition: string, response = false): string {
	if (!response)
		return `${channel}${responseDefinition.sep}${definition}`;
	return `${channel}${responseDefinition.sep}${definition}${responseDefinition.sep}${responseDefinition.response}`;
};
