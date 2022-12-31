import { commandFormat, shellModel } from 'app/src/electron/api/shell/interface';

export default {
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
} as shellModel;
