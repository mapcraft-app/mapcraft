import { contextBridge } from 'electron';
import fs from 'fs';
import { resolve } from 'path';

export interface appMapGet {
	icon: string;
	name: string;
	path: string;
}

contextBridge.exposeInMainWorld('appMap', {
	get: async (dir: string): Promise<appMapGet[]> => {
		const data = await fs.promises.readdir(dir, { encoding: 'utf-8', withFileTypes: true });
		return data.filter((el) => el.isDirectory()).map((el) => {
			return {
				icon: resolve(dir, el.name, 'icon.png'),
				name: el.name,
				path: resolve(dir, el.name)
			};
		});
	}
});
