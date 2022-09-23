import { app, BrowserWindow } from 'electron';
import { existsSync, mkdirSync } from 'fs';
import { platform, tmpdir } from 'os';
import { basename, join } from 'path';
import process from 'process';
import localeOptions from '../../../i18n/options';

export interface global {
	directory: {
		app: string,
		appData: string,
		game: string,
		log: string,
		save: string,
		temp: string
	},
	pack: {
		data: string,
		resource: string
	},
	lang: string,
	darkMode: boolean
}

export default class Env {
	static instance: Env;
	private _window: BrowserWindow | undefined;
	private _data: global = {} as global;

	constructor(window: BrowserWindow | undefined = undefined) {
		if (Env.instance)
			return Env.instance;
		console.log('toto est content');
		this._window = window;
		this._data = {
			directory: {
				app: this.app(),
				appData: this.appData(),
				game: this.game(),
				log: this.log(),
				save: join(this.game(), 'saves'),
				temp: tmpdir()
			},
			pack: {
				data: 'Mapcraft-{name}',
				resource: 'Mapcraft-{name}'
			},
			lang: 'en-US',
			darkMode: false
		};
		Env.instance = this;
		(async() => {
			this._data.darkMode = await this.dark();
			this._data.lang = await this.lang();
		})();
	}

	public get data(): global {
		return this._data;
	}

	public log(): string {
		return app.getPath('logs');
	}

	public app(): string {
		const ret = app.getAppPath();
		process.env.PRODUCTION = String((basename(ret) === 'app.asar'));
		return ret;
	}

	public appData(): string {
		const ret = app.getPath('userData');
		if (!existsSync(ret))
			mkdirSync(ret);
		return ret;
	}

	public async dark(): Promise<boolean> {
		const ret = await this._window?.webContents.executeJavaScript('window.localStorage.getItem(\'darkMode\')');
		if (ret)
			return !(ret.charAt(ret.length - 1) === '0');
		return false;
	}

	public game(): string {
		switch (platform()) {
		case 'win32':
			return join(String(app.getPath('appData')), '.minecraft');
		case 'darwin':
			return join(String(app.getPath('home')), 'Library', 'Application Support', 'minecraft');
		case 'linux':
		default:
			return join(String(app.getPath('home')), '.minecraft');
		}
	}

	public async lang(force = ''): Promise<string> {
		if (!force.length) {
			const data = await this._window?.webContents.executeJavaScript('window.localStorage.getItem(\'lang\')');
			if (data)
				return data.split('|')[1];
		} else {
			for (const key of localeOptions) {
				if (key.value === force)
					return key.value;
			}
		}
		return 'en-US';
	}
}
/*
export default class Env {
	static instance: Env;
	private _window: BrowserWindow | undefined;
	private _data: global = {} as global;

	constructor(window: BrowserWindow | undefined = undefined) {
		if (Env.instance)
			return Env.instance;
		console.log('toto est content');
		this._window = window;
		this._data = {
			directory: {
				app: this.app(),
				appData: this.appData(),
				game: this.game(),
				log: this.log(),
				save: join(this.game(), 'saves'),
				temp: tmpdir()
			},
			pack: {
				data: 'Mapcraft-{name}',
				resource: 'Mapcraft-{name}'
			},
			lang: 'en-US',
			darkMode: false
		};
		Env.instance = this;
		(async() => {
			this._data.darkMode = await this.dark();
			this._data.lang = await this.lang();
		})();
	}

	public get data(): global {
		return this._data;
	}

	public log(): string {
		return app.getPath('logs');
	}

	public app(): string {
		const ret = app.getAppPath();
		process.env.PRODUCTION = (basename(ret) === 'app.asar')
			? 'true'
			: 'false';
		return ret;
	}

	public appData(): string {
		const ret = app.getPath('userData');
		if (!existsSync(ret))
			mkdirSync(ret);
		return ret;
	}

	public async dark(): Promise<boolean> {
		const ret = await this._window?.webContents.executeJavaScript('window.localStorage.getItem(\'darkMode\')');
		if (ret)
			return !(ret.charAt(ret.length - 1) === '0');
		return false;
	}

	public game(): string {
		switch (platform()) {
		case 'win32':
			return join(String(app.getPath('appData')), '.minecraft');
		case 'darwin':
			return join(String(app.getPath('home')), 'Library', 'Application Support', 'minecraft');
		case 'linux':
		default:
			return join(String(app.getPath('home')), '.minecraft');
		}
	}

	public async lang(force = ''): Promise<string> {
		if (!force.length) {
			const data = await this._window?.webContents.executeJavaScript('window.localStorage.getItem(\'lang\')');
			if (data)
				return data.split('|')[1];
		} else {
			for (const key of localeOptions) {
				if (key.value === force)
					return key.value;
			}
		}
		return 'en-US';
	}
}
*/
