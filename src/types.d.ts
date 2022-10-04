import { appMapGet } from 'electron/preload/mapSelection';

interface Window {
	env: {
		directory: {
			app: string,
			appData: string,
			game: string,
			log: string,
			date: string,
			save: string,
			resource: string,
			temp: string
		},
		pack: {
			data: string,
			resource: string
		},
		darkMode: () => boolean,
		lang: () => string
	}
	/**
	 * Send request to channel
	 */
	ipc: {
		invoke: (channel: string, ...args: any[]) => Promise<any> | undefined,
		send: (channel: string, ...args: any[]) => void | undefined,
		receive: (channel: string, fn: (...args: any[]) => void) => void | undefined
	},
	/**
	 * Write log inside logger file
	 */
	log: {
		debug: (s: string) => void,
		error: (s: string) => void,
		info: (s: string) => void,
		warn: (s: string) => void,
	},
	/**
	 * Functions for map selection
	 */
	appMap: {
		get: (dir: string) => Promise<appMapGet[]>
	}
}
