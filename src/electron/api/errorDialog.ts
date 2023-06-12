import { clipboard, dialog, shell } from 'electron';
import { arch, platform, totalmem, version } from 'os';
import { URLSearchParams } from 'url';
import type Electron from 'electron';

export default function errorDialog(err: Error, exit: boolean = true): void {
	const gitUrl = (): string => {
		const ret = String(import.meta.env.APP_GIT_URL);
		return ret.slice(0, ret.length - 4);
	};
	const defineError = [
		'══ Info ══',
		`Version : ${import.meta.env.APP_VERSION}`,
		`UTC : ${new Date().toUTCString()}`,
		`Plateform : ${platform()} (${arch()}) - ${version()}`,
		`Heap usage : ${((process.memoryUsage().heapTotal * 8) / (8 * 1000 * 1000)).toPrecision(2)}MB`,
		`Total memory : ${((totalmem() * 8) / 8000000000).toPrecision(2)}GB`,
		'\n══ Message ══',
		err.message,
		'\n══ Stack ══',
		err.stack
	].join('\n').toString();
	
	dialog.showMessageBox({
		type: 'error',
		message: err.name,
		title: `Mapcraft - ${err.name}`,
		detail: [
			'This error will be copied to your clipboard if you decide to submit the bug so that you can use it :\n',
			defineError
		].join('\n'),
		cancelId: 1,
		noLink: true,
		buttons: [ 'Send issue to dev', 'Close application' ]
	}).then((ret: Electron.MessageBoxReturnValue) => {
		if (ret.response === 0) {
			clipboard.writeText(defineError, 'clipboard');
			const params = new URLSearchParams({
				title: [ `Auto report - ${err.name}` ],
				template: [ 'bug_report.md' ],
				body: [ defineError ]
			}).toString();
			shell.openExternal(`${gitUrl()}/issues/new?${params}`);
		}
		if (exit)
			process.exit(127);
	});
}
