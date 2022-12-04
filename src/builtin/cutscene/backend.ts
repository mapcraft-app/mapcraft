import { contextBridge } from 'electron';
import { resolve } from 'path';
import { writeFile, mkdir, access } from 'fs/promises';
// import bezierEasing from 'bezier-easing';
import type { envInterface } from 'mapcraft-api/dist/types/src/engine/interface';

class cutscene {
	private _path: {
		dir: string;
		main: string;
	};

	constructor(env: envInterface, name: string) {
		this._path = {
			dir: resolve(env.save, name, 'datapack', 'mapcraft-data', 'functions', 'cutscene'),
			main: resolve(env.save, name, 'datapack', 'mapcraft-data', 'functions', 'cutscene', 'start.mcfunction')
		};
	}

	async install(): Promise<void> {
		await access(this._path.dir)
			.catch(async () => await mkdir(this._path.dir, { recursive: true }));
		return await access(this._path.main)
			.catch(() => writeFile(this._path.main, '', { encoding: 'utf-8' }));
	}
}

contextBridge.exposeInMainWorld('cutscene', {
	...cutscene
});
