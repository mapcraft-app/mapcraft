/* eslint-disable no-unused-vars */
import type Electron from 'electron';

declare global {
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
			send: (channel: string, ...args: any[]) => Promise<Electron.IpcRenderer> | void,
			receive: (channel: string, fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => Electron.IpcRenderer | void
		},
		/**
		 * Write log inside logger file
		 */
		log: {
			debug: (s: string) => void,
			error: (s: string) => void,
			info: (s: string) => void,
			warn: (s: string) => void,
		}
	}
}
