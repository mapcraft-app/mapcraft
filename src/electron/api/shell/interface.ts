export interface commandRet {
	command: string;
	player: string;
	notification?: boolean;
	data: Record<string, any> | null
}

export interface shellModel {
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