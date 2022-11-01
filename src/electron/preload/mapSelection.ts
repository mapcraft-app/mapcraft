/* eslint-disable no-undef */
import { contextBridge } from 'electron';
import { readdir, existsSync } from 'fs';
import { resolve } from 'path';

export interface appMapGet {
	icon: string | false;
	name: string;
	path: string;
}

contextBridge.exposeInMainWorld('appMap', {
	get: async (dir: string): Promise<appMapGet[] | NodeJS.ErrnoException> => {
		return new Promise((res, rej) => {
			readdir(dir, { encoding: 'utf-8', withFileTypes: true }, (err, files) => {
				if (err)
					rej(err);
				try {
					const data: appMapGet[] = files
						.filter((el) =>
							el.isDirectory()
							&& existsSync(resolve(dir, el.name, 'level.dat')))
						.map((el) => {
							const path = resolve(dir, el.name, 'icon.png');
							return {
								icon: existsSync(path)
									? path
									: false,
								name: el.name,
								path: resolve(dir, el.name)
							};
						});
					if (data.length)
						res(data);
					else
						rej('NO_MAPS');
				} catch (e: unknown) {
					rej(e as NodeJS.ErrnoException);
				}
			});
		});
	}
});
