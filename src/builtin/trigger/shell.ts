import { commandFormat, shellModel } from 'app/src/electron/api/shell/interface';

export default {
	name: 'trigger',
	builtin: true,
	fn: (args) => {
		console.log(args);
		return commandFormat(args, { one: 'two' }, true);
	}
} as shellModel;
