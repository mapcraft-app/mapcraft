import { contextBridge } from 'electron';
import { resolve, join } from 'path';
import './exposeEnv';
import 'electron/ipc/render';
import { log } from 'api/log';
import './mapSelection';

contextBridge.exposeInMainWorld('path', {
	resolve,
	join
});

contextBridge.exposeInMainWorld('log', {
	debug: (message: any, ...optional: any[]) => log.debug(message, optional),
	error: (message: any, ...optional: any[]) => log.error(message, optional),
	info: (message: any, ...optional: any[]) => log.info(message, optional),
	warn: (message: any, ...optional: any[]) => log.warn(message, optional),
	psql: (message: any, ...optional: any[]) => log.psql(message, optional)
});
