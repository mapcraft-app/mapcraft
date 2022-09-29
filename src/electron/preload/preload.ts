import { contextBridge } from 'electron';
import './exposeEnv';
import ipc from 'electron/ipc/render';
import Log from 'api/log';

console.log(ipc);

const log = new Log();
contextBridge.exposeInMainWorld('log', Object.freeze({
	debug: (s: string) => log.debug(s),
	error: (s: string) => log.error(s),
	info: (s: string) => log.info(s),
	warn: (s: string) => log.warn(s),
}));
