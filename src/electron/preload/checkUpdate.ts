import { readFile } from 'fs/promises';
import { platform } from 'os';
import { resolve } from 'path';
import { version } from '@/main/package.json';
import { minecraft } from 'mapcraft-api/frontend';
import type { envInterface, minecraftVersion } from 'mapcraft-api';

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
		if (minecraft.semverCompare(currentVersion.software, infos.software.version) === 1) {
			update.software = {
				version: infos.software.version,
				description: infos.software.description,
				unpackDir: env.app,
				release: infos.software[os]
			};
		}
		if (minecraft.semverCompare(currentVersion.datapack.mapcraft.version, infos.datapack.releases[0].version) === 1) {
			update.datapack = {
				version: infos.datapack.releases[0].version,
				description: infos.datapack.releases[0].description,
				unpackDir: resolve(env.save, mapName, 'datapacks', 'mapcraft'),
				release: infos.datapack.releases[0]
			};
		}
		if (minecraft.semverCompare(currentVersion.resourcepack.mapcraft.version, infos.resourcepack.releases[0].version) === 1) {
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
