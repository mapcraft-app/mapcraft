import type Electron from 'electron';
import { existsSync, mkdirSync } from 'fs';
import { platform, tmpdir } from 'os';
import { basename, join } from 'path';

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

	process.env.APP = app.getAppPath();
	process.env.APP_DATA = app.getPath('userData');
	process.env.GAME = game();
	process.env.LOG = app.getPath('logs');
	process.env.SAVE_GAME = join(game(), 'saves');
	process.env.TEMP = tmpdir();

	process.env.PRODUCTION = String((basename(app.getAppPath()) === 'app.asar'));
	if (!existsSync(app.getPath('userData')))
		mkdirSync(app.getPath('userData'));
}
