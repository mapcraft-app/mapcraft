import { contextBridge } from 'electron';
import './exposeEnv';
import ipc from 'electron/ipc/render';
import Log from 'api/log';

console.log(ipc);

const log = new Log();
contextBridge.exposeInMainWorld('log', {
	debug: (s: string): void => log.debug(s),
	error: (s: string): void => log.error(s),
	info: (s: string): void => log.info(s),
	warn: (s: string): void => log.warn(s),
});
