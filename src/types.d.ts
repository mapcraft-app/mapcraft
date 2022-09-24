interface Window {
	readSettings: () => Record<string, any>;
	env: {
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
		darkMode: () => boolean,
		lang: () => string
	}
}
