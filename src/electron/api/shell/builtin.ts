import { commandFormat, shellModel } from './interface';

export default [
	{
		name: 'option',
		builtin: true,
		fn: (args) => {
			return commandFormat(args, {
				option: args[2]
			});
		}
	},
	{
		name: 'trigger',
		builtin: true,
		fn: (args) => {
			return commandFormat(args, {
				coordinates: {
					p1: [args[2], args[3], args[4]],
					p2: [args[5], args[6], args[7]],
				}
			});
		}
	}
] as shellModel[];
