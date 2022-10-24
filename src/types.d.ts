import { appMapGet } from 'electron/preload/mapSelection';
import { userStorage } from 'electron/preload/exposeEnv';

export declare global {
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
			lang: () => string,
			user: () => userStorage
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
			debug: (message: any, ...optional: any[]) => void,
			error: (message: any, ...optional: any[]) => void,
			info: (message: any, ...optional: any[]) => void,
			warn: (message: any, ...optional: any[]) => void,
			psql: (message: any, ...optional: any[]) => void,
		},
		/**
		 * Functions for map selection
		 */
		appMap: {
			get: (dir: string) => Promise<appMapGet[]>
		}
	}
}
