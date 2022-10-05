import { contextBridge } from 'electron';
import fs, { existsSync } from 'fs';
import { resolve } from 'path';

export interface appMapGet {
	icon: string | false;
	name: string;
	path: string;
}

contextBridge.exposeInMainWorld('appMap', {
	get: async (dir: string): Promise<appMapGet[]> => {
		const data = await fs.promises.readdir(dir, { encoding: 'utf-8', withFileTypes: true });
		return data.filter((el) => el.isDirectory() && existsSync(resolve(dir, el.name, 'level.dat'))).map((el) => {
			const path = resolve(dir, el.name, 'icon.png');
			return {
				icon: existsSync(path)
					? path
					: false,
				name: el.name,
				path: resolve(dir, el.name)
			};
		});
	}
});
