import { appMapGet } from 'electron/preload/mapSelection';
import { userStorage } from 'electron/preload/exposeEnv';
import { builtinFormat } from 'app/src/builtin/front';
import { minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';
import type { download } from 'mapcraft-api';
import type { envInterface } from 'mapcraft-api/dist/types/src/engine/interface';
import type { tableInterface } from 'mapcraft-api/dist/types/src/backend/sql';
import type { dataEngineInterface, mapEngine, mapEngineInstance } from 'electron/preload/engine';
import type { update } from './electron/preload/checkUpdate';
import type { stat } from './electron/preload/installUpdate';

export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			OS: string,
			DEV: string,
			PACKAGED: string,
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
				os: 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32',
				app: string,
				appData: string,
				game: string,
				log: string,
				date: string,
				save: string,
				resource: string,
				temp: string
			},
			darkMode: () => boolean,
			lang: () => string,
			user: () => userStorage
		}
		
		/**
		 * Send request to channel
		 * 
		 * https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereronchannel-listener
		 */
		ipc: {
			/**
			 * Send a message to the main process via channel and expect a promise with the response
			 */
			invoke: (channel: string, ...args: any[]) => Promise<any>,

			/**
			 * Send an asynchronous message to the main process via channel, along with arguments
			 */
		 	send: (channel: string, ...args: any[]) => void,

			/**
			 * Adds a one time listener function for the event. This listener is invoked only the next time a message is sent to *channel*, after which it is removed
			 */
			receive: (channel: string, fn: (...args: any[]) => void) => void,

			/**
			 * Listen to *channel*, when a new message arrives listener would be called with listener(event, args...)
			 */
			receiveAll: (channel: string, fn: (...args: any[]) => void) => void,

			/**
			 * Remove the specified listener for the specified channel
			 */
			remove: (channel: string, fn: (...args: any[]) => void) => void,

			/**
			 * Remove all listeners for the specified channel
			 */
			removeAll: (channel: string) => void
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

		update: {
			check: (
				env: envInterface,
				mapName: string,
				minecraftVersion: minecraftVersion
			) => Promise<update>,
			install: (env: envInterface, updateData: update) => void,
			getStat: () => stat
		}

		mapcraft: {
			/**
			 * Access to selected NodeJS module
			 */
			module: {
				path: {
					join: (...paths: string[]) => string,
					resolve: (...paths: string[]) => string,
					normalize: (path: string) => string
				}
			},
			clipboard: {
				clear: () => void,
				readHtml: () => string,
				writeHtml: (html: string) => void,
				readText: () => string,
				writeText: (text: string) => void,
			},

			/**
			 * Acces to mapcraft-api
			 */
			download: download,
			engine: {
				newInstance: (env: envInterface, name: string) => mapEngine,
				init: (version: minecraftVersion) => void,
				database: () => database,
				instance: () => mapEngine,
				build: () => Promise<string>,
				buildStatus: () => string,
				clean: () => Promise<void[][]>,
				install: () => Promise<void>,
				update: () => Promise<void[]>,
				getInfo: () => Promise<mapEngineInfoTable>,
				updateInfo: (name: string, version: string) => Promise<void>,
				sql: {
					table: {
						add: (tables: tableInterface | tableInterface[]) => void,
						exist: (names: string | string[]) => number | number[],
						remove: (names: string | string[]) => void,
						update: (tables: tableInterface | tableInterface[]) => void
					},
					check(): Promise<void>,
					get(req: string, ...args: any[]): Promise<any>;
					all(req: string, ...args: any[]): Promise<any[]>;
					update(req: string, ...args: any[]): Promise<RunResult>;
				}
			}

			logIsWatch: () => boolean,

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
