import { commandFormat, shellModel } from '@/electron/api/shell/interface';

export default {
	name: 'cutscene',
	builtin: true,
	fn: (args) => {
		const stof = (str: string) => parseFloat(parseFloat(str.slice(0, -1)).toFixed(1));
		switch (args[2]) {
		case 'create':
			return commandFormat(args, { type: args[2] });
		case 'add-point':
			return commandFormat(args, {
				type: args[2],
				coordinates: {
					point: [stof(args[3]), stof(args[4]), stof(args[5])],
					rotation: [stof(args[6]), stof(args[7])],
				},
			}, false);
		case 'delete-point':
			return commandFormat(args, {
				type: args[2],
				coordinates: {
					point: [stof(args[3]), stof(args[4]), stof(args[5])]
				},
			}, false);
		default:
			return commandFormat(args, {
				error: 'command not exist'
			});
		}
	}
} as shellModel;
