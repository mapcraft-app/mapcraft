import { randomBytes } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { download, sevenZip } from 'mapcraft-api/backend';
import { resolve } from 'path';
import semver from 'electron/api/semver';
import { writeFile } from 'fs/promises';

interface apiData {
	statusCode: number;
	info: {
		type: string;
		code: string;
		message: string;
	};
	checksum: string;
	description: string;
	version: string;
	darwin: string;
	linux: string;
	windows: string;
}

type os = 'darwin' | 'linux' | 'windows';

const install = async (apiData: apiData, pathVersion: string): Promise<void> => {
	const osToDl: Map<string, os> = new Map([
		['win32', 'windows'],
		['darwin', 'darwin'],
		['linux', 'linux'],
	]);
	const dl = new download(
		apiData[osToDl.get(process.env.OS) as os ?? 'linux'],
		resolve(process.env.TEMP, randomBytes(32).toString('hex').slice(0, 32))
	);
	const zip = new sevenZip();

	await dl.get();
	await zip.unpack(dl.destination, process.env.UPDATE);
	await writeFile(pathVersion, apiData.version, { encoding: 'utf-8' });
};

export default async (): Promise<void> => {
	const pathVersion = resolve(process.env.UPDATE, 'version');
	const apiData: apiData = await fetch('https://api.mapcraft.app/software/update', { method: 'GET' })
		.then((d) => d.json());

	if (apiData.statusCode === 200) {
		const version = (existsSync(pathVersion))
			? readFileSync(pathVersion, { encoding: 'utf-8' })
			: null;
		if (version === null || semver(version.toString(), apiData.version) === 1)
			install(apiData, pathVersion);
	}
};
