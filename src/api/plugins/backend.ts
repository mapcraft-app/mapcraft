import { contextBridge } from 'electron';

/*import { readdir } from 'node:fs/promises';
import { resolve } from 'path';
import { pluginsList, PluginError } from './index';
import langOptions from 'i18n/options';

export function backend(list: pluginsList[]): void {
	list.forEach((el) => {
		import(resolve(el.path, el.package.config.backend))
			.catch((e) => { throw new PluginError(e); });
	});
};

interface langRet {
	key: string;
	value: Record<string, any>
}

export function lang(list: pluginsList[]): void {
	//const reg = /^(\S+)\.ts$/;
	const langs: langRet[] = langOptions.map((el) => {
		return {
			key: el.value,
			value: {}
		};
	})//

	list.forEach((plugin) => {
		const basePath = resolve(plugin.path, plugin.package.config.lang);
		import(resolve(basePath, 'en-US.ts'))
			.then((d) => console.log(d))
			.catch((e) => console.error(e));
	});
}
//
		readdir(basePath, { encoding: 'utf-8', withFileTypes: true })
			.then((files) => {
				files.filter((el) => el.isFile()).forEach(async (el) => {
					const name = reg.exec(el.name);
					if (name && name.length === 2) {
						for (const x in langs) {
							if (langs[x].key === name[1]) {
								/*import(resolve(basePath, el.name))
									.then((d) => langs[x].value[plugin.package.name] = d)
									.catch((e))
								break;
							}
						}
					}
					/*
					import(resolve(basePath, el.name))
						.then((d) => {
							const name = reg.exec(el.name);
							console.log(name);
						})
					
				});
			})
			.catch((e) => { throw new PluginError(e); });
	});
*/

//#region expose in main world wrapper
const saveChannels: Set<string> = new Set();
export async function exposeInMainWorld(apiKey: string, api: unknown): Promise<void> {
	if (saveChannels.has(apiKey)) {
		let i = 0;
		for (; saveChannels.has(`${apiKey}_${i}`); i++)
			;
		throw new Error(`${apiKey} channel is already registered. The closest available channel is ${apiKey}_${i}`);
	}
	try {
		contextBridge.exposeInMainWorld(apiKey, api);
	} catch {
		throw new Error(`${apiKey} channel is already registered. The closest available channel is ${apiKey}_0`);
	}
}
//#endregion expose in main world wrapper
