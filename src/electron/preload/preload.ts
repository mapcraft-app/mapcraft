import { contextBridge } from 'electron';
import { writeFile } from 'fs';
import { resolve, join } from 'path';
import { download } from 'mapcraft-api';

import './exposeEnv';
import engine from './engine';
import 'electron/ipc/render';
import { log } from 'api/log';
import getMap from './mapSelection';
import { Shell } from 'electron/api/shell';
import 'builtin/front';
import 'builtin/back';

const shell = new Shell();
shell.watchLog();

contextBridge.exposeInMainWorld('log', {
	debug : (message: any, ...optional: any[]) => log.debug(message, optional),
	error : (message: any, ...optional: any[]) => log.error(message, optional),
	info  : (message: any, ...optional: any[]) => log.info(message, optional),
	warn  : (message: any, ...optional: any[]) => log.warn(message, optional),
	psql  : (message: any, ...optional: any[]) => log.psql(message, optional)
});
	
contextBridge.exposeInMainWorld('mapcraft', {
	module: {
		path: { resolve, join }
	},
	download,
	engine,
	updateConfig: (data: { game: string, temp: string, resource_game: string, save_game: string }) => {
		writeFile(resolve(process.env.APP_DATA, 'config'), JSON.stringify(data, null, 2), { encoding: 'utf-8', flag: 'w' }, (err) => {
			if (err)
				log.error(err.message, '|' ,err.cause);
			else
				log.info('config file saved');
		});
	},
	getMap,
});
