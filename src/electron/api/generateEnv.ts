import type Electron from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { platform, tmpdir } from 'os';
import { basename, join, resolve } from 'path';

export default function generateEnv(app: Electron.App): void {
	const game = (): string => {
		switch (platform()) {
		case 'win32':
			return join(String(app.getPath('appData')), '.minecraft');
		case 'darwin':
			return join(String(app.getPath('home')), 'Library', 'Application Support', 'minecraft');
		case 'linux':
		default:
			return join(String(app.getPath('home')), '.minecraft');
		}
	};
	const tempGame = game();

	process.env.OS = platform();
	process.env.DEV = (import.meta.env.DEV)
		? 'true'
		: 'false';
	process.env.PACKAGED = (app.isPackaged)
		? 'true'
		: 'false';
	process.env.APP = app.getAppPath();
	if (import.meta.env.DEV) {
		process.env.APP_EXE = `"node ${resolve(
			app.getAppPath(),
			'..',
			'node_modules',
			'vite',
			'bin',
			'vite.js'
		)} ${resolve(app.getAppPath(), '..')}"`;
	} else
		process.env.APP_EXE = app.getPath('exe');
	process.env.APP_DATA = resolve(app.getPath('userData'), 'appdata');
	process.env.UPDATE = resolve(app.getPath('userData'), 'update');
	const configFile = resolve(process.env.APP_DATA, 'config');
	const data = existsSync(configFile)
		? JSON.parse(readFileSync(configFile, { encoding: 'utf-8' }))
		: undefined;
	process.env.GAME = data
		? data.game
		: tempGame;
	process.env.LOG = app.getPath('logs');
	process.env.DATE = new Date().toISOString().normalize().replace(/[-:\\.]/g, '_');
	process.env.SAVE_GAME = data
		? data.save_game
		: join(tempGame, 'saves');
	process.env.RESOURCE_GAME = data
		? data.resource_game
		: join(tempGame, 'resourcepacks');
	process.env.TEMP = data
		? data.temp
		: tmpdir();
	process.env.PRODUCTION = String((basename(app.getAppPath()) === 'app.asar'));
	
	/**
	 * Create vital directory & file
	 */
	if (!existsSync(app.getPath('userData')))
		mkdirSync(app.getPath('userData'));
	if (!existsSync(process.env.APP_DATA))
		mkdirSync(process.env.APP_DATA);
	if (!existsSync(process.env.UPDATE))
		mkdirSync(process.env.UPDATE);
	if (!existsSync(configFile)) {
		writeFileSync(configFile, JSON.stringify({
			game: process.env.GAME,
			temp: process.env.TEMP,
			resource_game: process.env.RESOURCE_GAME,
			save_game: process.env.SAVE_GAME
		}, null, 2), { encoding: 'utf-8', flag: 'w' });
	}
}
