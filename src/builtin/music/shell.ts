import { commandFormat, shellModel } from 'app/src/electron/api/shell/interface';

export default {
	name: 'music',
	builtin: true,
	fn: (args) => {
		return commandFormat(args, {});
	}
} as shellModel;
