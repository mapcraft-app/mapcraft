import { contextBridge } from 'electron';

export interface userStorage {
	username: string,
	offline: boolean,
	remember: boolean
}

const generateEnv = {
	directory: {
		app: process.env.APP,
		appData: process.env.APP_DATA,
		game: process.env.GAME,
		log: process.env.LOG,
		date: process.env.DATE,
		save: process.env.SAVE_GAME,
		resource: process.env.RESOURCE_GAME,
		temp: process.env.TEMP
	},
	pack: {
		data: 'Mapcraft-{name}',
		resource: 'Mapcraft-{name}'
	},
	darkMode: () => {
		const ret = window.localStorage.getItem('darkMode');
		if (ret)
			return !(ret.charAt(ret.length - 1) === '0');
		return false;
	},
	lang: () => {
		const data = window.localStorage.getItem('lang');
		if (data)
			return data.split('|')[1];
		return 'en-US';
	},
	user: (): userStorage => {
		const ret = window.localStorage.getItem('user')?.split('|')[1];
		if (ret)
			return JSON.parse(ret);
		return {} as userStorage;
	}
};

contextBridge.exposeInMainWorld('env', generateEnv);
