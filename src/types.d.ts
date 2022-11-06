import { appMapGet } from 'electron/preload/mapSelection';
import { userStorage } from 'electron/preload/exposeEnv';
import { builtinFormat } from 'builtin/index';

export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP: string,
			APP_DATA: string,
			GAME: string,
			LOG: string,
			DATE: string,
			SAVE_GAME: string,
			RESOURCE_GAME: string,
			TEMP: string
		}
	}

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
		 * Logger system
		 */
		log: {
			debug: (message: any, ...optional: any[]) => void,
			error: (message: any, ...optional: any[]) => void,
			info: (message: any, ...optional: any[]) => void,
			warn: (message: any, ...optional: any[]) => void,
			psql: (message: any, ...optional: any[]) => void,
		}

		mapcraft: {
			/**
			 * Access to selected NodeJS module
			 */
			module: {
				path: {
					join: (...paths: string[]) => string,
					resolve: (...paths: string[]) => string
				}
			},

			/**
			 * Builtin
			 */
			builtinList: builtinFormat[]

			/**
			 * Update configuration file
			 */
			updateConfig: (data: { game: string, temp: string, resource_game: string, save_game: string }) => void,

			/**
			 * Get list of map(s) inside save directory
			 */
			getMap: (dir: string) => Promise<appMapGet[]>
		}
	}
}
