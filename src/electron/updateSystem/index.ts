import { randomBytes } from 'crypto';
import { readdirSync,  } from 'fs';
import { download, sevenZip } from 'mapcraft-api/backend';
import { resolve } from 'path';

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

const install = async (apiData: apiData): Promise<void> => {
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
	await zip.unpack(dl.destination, resolve(process.env.UPDATE, apiData.version));
};

export default async (): Promise<void> => {
	const dirs = readdirSync(process.env.UPDATE, { encoding: 'utf-8' });
	const apiData: apiData = await fetch('https://api.mapcraft.app/software/update')
		.then((d) => d.json());

	if (apiData.statusCode === 200 && (dirs.length <= 0 || !dirs.includes(apiData.version)))
		install(apiData);
};
