import { readdir } from 'node:fs/promises';
import { resolve } from 'path';

export interface packageFormat {
	private: boolean;
	name: string;
	description: string;
	license: string;
	version: string;
	author: {
		email: string;
		name: string;
	};
	repository: {
		type: string;
		url: string;
	};
	keywords: string[];
	mapcraft: {
		baseDir: string,
		backend: string;
		frontend: string;
		lang: string;
		routes: string;
	}
}

export interface pluginsList {
	path: string;
	package: packageFormat;
}

export class PluginError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export const list: pluginsList[] = [];
export default async (baseUrl = '.'): Promise<pluginsList[]> => {
	return new Promise((res, rej) => {
		readdir(resolve(baseUrl, 'plugins'), { encoding: 'utf-8', withFileTypes: true })
			.then((files) => {
				files.filter((el) => el.isDirectory()).forEach(async (el) => {
					await import(resolve(baseUrl, 'plugins', el.name, 'package.json'))
						.then((d) => {
							list.push({
								path: resolve(baseUrl, 'plugins', el.name),
								package: d.default
							});
						})
						.catch((err) => rej(err));
				});
				res(list);
			})
			.catch((err) => rej(err));
	});
};
