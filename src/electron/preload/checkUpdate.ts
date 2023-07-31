import { readFile } from 'fs/promises';
import { platform } from 'os';
import { resolve } from 'path';
import { version } from 'package.json';

import type { minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';
import type { envInterface } from 'mapcraft-api/dist/types/src/backend/engine/interface';

interface mcmeta {
	mapcraft: {
		version: string;
		minecraft: minecraftVersion[];
	};
	pack: {
		pack_format: number;
		description: string;
	}
}

export interface packInstall {
	description: string;
	url: string;
	version: string;
}

interface retInterface {
	statusCode: number;
	info: {
		type: string;
		code: string;
		message: string;
	};
	releases: packInstall[]
}

export interface softwareInstall {
	installer: {
		url: string;
		type: 'exe' | 'dmg' | 'appimage';
	};
	archive: {
		url: string;
		type: 'zip' | '7zip'
	}
}

interface retSoftwareInterface {
	statusCode: number;
	info: {
		type: string;
		code: string;
		message: string;
	};
	checksum: string;
	description: string;
	version: string;
	update: {
		url: string;
		type: 'zip'
	};
	windows: softwareInstall;
	darwin: softwareInstall;
	linux: softwareInstall
}

interface updateInfo {
	version: string;
	description: string;
	unpackDir: string;
	release: softwareInstall | packInstall;
}

export interface update {
	software?: updateInfo;
	datapack?: updateInfo;
	resourcepack?: updateInfo;
}

/**
 * Compare semver
 * @param oldVersion string
 * @param newVersion string
 * @returns -1 if newVersion is lesser than oldVersion, 0 if equal, 1 is upper
 */
const compareSemVer = (oldVersion: string, newVersion: string): number => {
	const ret = (comp: boolean) => <number><any>comp | 0;
	const data = {
		old: oldVersion.indexOf('-') !== -1
			? oldVersion.split('-')
			: oldVersion,
		new: newVersion.indexOf('-') !== -1
			? newVersion.split('-')
			: newVersion,
	};

	if (Array.isArray(data.old) !== Array.isArray(data.new))
		return ret(Array.isArray(data.old));
	if (Array.isArray(data.old) && Array.isArray(data.new)) {
		const preRelease = data.new[1].localeCompare(data.old[1]);
		return preRelease === 0
			? data.new[0].localeCompare(data.old[0], undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' })
			: preRelease;
	}
	return (data.new as string).localeCompare(data.old as string, undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' });
};

export default async (env: envInterface, mapName: string, minecraftVersion: minecraftVersion): Promise<update> => {
	const os = platform() === 'win32'
		? 'windows'
		: platform() === 'darwin'
			? 'darwin'
			: 'linux';
	const _fetch = async (url: string) => await fetch(url, { method: 'GET', cache: 'default' }).then((d) => d.json()) as unknown;

	const update = {} as update;
	const infos = {
		software: await _fetch('https://api.mapcraft.app/software') as retSoftwareInterface,
		datapack: await _fetch(`https://api.mapcraft.app/software/datapack/${minecraftVersion}`) as retInterface,
		resourcepack: await _fetch(`https://api.mapcraft.app/software/resourcepack/${minecraftVersion}`) as retInterface,
	};
	const currentVersion = {
		software: version,
		datapack: JSON.parse(
			await (readFile(resolve(env.save, mapName, 'datapacks', 'mapcraft', 'pack.mcmeta'), { encoding: 'utf-8' }))
		) as mcmeta,
		resourcepack: JSON.parse(
			await (readFile(resolve(env.resource, `mapcraft_${minecraftVersion}`, 'pack.mcmeta'), { encoding: 'utf-8' }))
		) as mcmeta
	};
	
	if (
		infos.datapack.statusCode === 200 &&
		infos.resourcepack.statusCode === 200 &&
		infos.software.statusCode === 200
	) {
		if (compareSemVer(currentVersion.software, infos.software.version) === 1) {
			update.software = {
				version: infos.software.version,
				description: infos.software.description,
				unpackDir: env.app,
				release: infos.software[os]
			};
		}
		if (compareSemVer(currentVersion.datapack.mapcraft.version, infos.datapack.releases[0].version) === 1) {
			update.datapack = {
				version: infos.datapack.releases[0].version,
				description: infos.datapack.releases[0].description,
				unpackDir: resolve(env.save, mapName, 'datapacks', 'mapcraft'),
				release: infos.datapack.releases[0]
			};
		}
		if (compareSemVer(currentVersion.resourcepack.mapcraft.version, infos.resourcepack.releases[0].version) === 1) {
			update.resourcepack = {
				version: infos.resourcepack.releases[0].version,
				description: infos.resourcepack.releases[0].description,
				unpackDir: resolve(env.resource, `mapcraft_${minecraftVersion}`),
				release: infos.resourcepack.releases[0]
			};
		}
	}
	return update;
};
