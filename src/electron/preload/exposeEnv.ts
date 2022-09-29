import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('env', {
	directory: {
		app: String(process.env.APP),
		appData: String(process.env.APP_DATA),
		game: String(process.env.GAME),
		log: String(process.env.LOG),
		date: String(process.env.DATE),
		save: String(process.env.SAVE_GAME),
		resource: String(process.env.RESOURCE_GAME),
		temp: String(process.env.TEMP)
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
	}
});
