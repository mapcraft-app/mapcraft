import { sevenZip, download } from 'mapcraft-api/backend';
import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import { resolve } from 'path';
import { rm } from 'fs/promises';
import { log } from '@/api/log';
import { platform } from 'os';
import type { packInstall, softwareInstall, update } from './checkUpdate';
import type { envInterface, statFile } from 'mapcraft-api';

export interface stat {
	datapack: number;
	resourcepack: number;
	software: number;
}
type updateType = 'datapack' | 'resourcepack' | 'software';

export const installStat: stat = {
	datapack: 0,
	resourcepack: 0,
	software: 0
};

export const getStat = (): stat => installStat;

export default (env: envInterface, updateData: update): void => {
	const rand = () => randomBytes(32).toString('hex').slice(0, 32);
	const updateSoftware = (): string => {
		switch (platform()) {
		case 'win32':
			return resolve(process.env.UPDATE, 'update-windows.exe');
		case 'darwin':
			return resolve(process.env.UPDATE, 'update-darwin');
		case 'linux':
		default:
			return resolve(process.env.UPDATE, 'update-linux');
		}
	};
	const promises = [];
	const config: Map<updateType, {
		down: download,
		zip: sevenZip,
		unpack: string
	}> = new Map();

	if (updateData.datapack) {
		config.set('datapack', {
			down: new download(
				(updateData.datapack.release as packInstall).url,
				resolve(env.temp, `${rand()}.tmp`)
			),
			zip: new sevenZip(),
			unpack: updateData.datapack.unpackDir
		});
	}
	if (updateData.resourcepack) {
		config.set('resourcepack', {
			down: new download(
				(updateData.resourcepack.release as packInstall).url,
				resolve(env.temp, `${rand()}.tmp`)
			),
			zip: new sevenZip(),
			unpack: updateData.resourcepack.unpackDir
		});
	}
	if (updateData.software) {
		config.set('software', {
			down: new download(
				(updateData.software.release as softwareInstall).archive.url,
				resolve(env.temp, `${rand()}.tmp`)
			),
			zip: new sevenZip(),
			unpack: updateData.software.unpackDir
		});
	}

	for (const c of config) {
		c[1].down.on('data', (downStat: statFile) => {
			if (c[0] === 'software')
				installStat[c[0]] = Math.floor(downStat.percent);
			else
				installStat[c[0]] = Math.floor(downStat.percent / 2);
		});
		promises.push(
			new Promise<void>((res, rej) => {
				c[1].down.get()
					.then(() => {
						if (c[0] === 'software')
							res();
						else {
							let temp = 0;
							const before = installStat[c[0]];
							const interval = setInterval(() => {
								if (c[1].zip.percent > temp) {
									temp = c[1].zip.percent;
									installStat[c[0]] = before + Math.floor(c[1].zip.percent / 2);
								}
							}, 100);
							c[1].zip.unpack(c[1].down.destination, c[1].unpack)
								.finally(() => {
									rm(c[1].down.destination, { force: true });
									installStat[c[0]] = 100;
									clearInterval(interval);
									c[1].down.removeAllListeners('data');
									res();
								})
								.catch((e) => {
									log.error(e);
									rej();
								});
						}
					});
			})
		);
	}
	const c = config.get('software');
	if (c) {
		Promise.all(promises)
			.then(() => {
				spawn(
					updateSoftware(),
					[
						c.down.destination,
						resolve(process.env.TEMP, rand()),
						process.env.APP_EXE,
						'false'
					],
					{
						detached: true,
						shell: false,
						windowsHide: false
					}
				).unref();
			});
	}
};
