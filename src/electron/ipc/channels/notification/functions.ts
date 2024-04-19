import { Notification } from 'electron';
import { ipcFunctions } from '@/main/src/electron/ipc/type';
import { ipcCommand } from '@/electron/api/shell/interface';
import { resolve } from 'path';
import { builder } from '@/main/package.json';
import type Electron from 'electron';

const toPublic = (url: string): string => {
	if (import.meta.env.DEV)
		return resolve('.', 'src', 'public', url);
	let x = 0;
	while (x < url.length && (url[x] === '/' || url[x] === '\\'))
		++x;
	return `./resources/${
		(builder.asar)
			? 'app.asar'
			: 'app'
	}/${url.substring(x)}`;
};

export default [
	(event: Electron.IpcMainEvent, e: ipcCommand, iconPath?: string): void => {
		const notif = new Notification({
			icon: iconPath ?? toPublic('imgs/app/icon_small.png'),
			title: e.text.title,
			body: e.text.description
		});
		notif.show();
		notif.on('click', () => event.reply('notification::selected', e));
	}
] as ipcFunctions;
