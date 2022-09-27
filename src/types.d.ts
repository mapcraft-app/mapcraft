/* eslint-disable no-unused-vars */
import type Electron from 'electron';

interface Window {
	ipc: {
		send: (channel: string, ...args: any[]) => Promise<Electron.IpcRenderer> | void,
		receive: (channel: string, fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => Electron.IpcRenderer | void
	},
	readSettings: () => Record<string, any>;
	env: {
		directory: {
			app: string,
			appData: string,
			game: string,
			log: string,
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
}
