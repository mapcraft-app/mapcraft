/* eslint-disable @typescript-eslint/no-explicit-any */

export interface commandRet {
	command: string;
	player: string;
	notification?: boolean;
	data: Record<string, any> | null
}

export interface ipcCommand {
	plugin: string;
	text: {
		title: string;
		description: string;
	};
	ret: commandRet
}

export interface shellModel {
	plugin: string;
	name: string;
	builtin?: boolean;
	fn: (args: string[]) => commandRet // eslint-disable-line no-unused-vars
}

export function commandFormat(args: string[], data: Record<string, any> | null = null, notification = true): commandRet {
	return {
		command: args[0],
		player: args[1],
		notification,
		data
	};
}
