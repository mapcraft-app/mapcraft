import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { randomBytes } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { extname, resolve } from 'path';
import { envInterface } from '../interface';
import { main } from './model';

class advancement {
	private env: envInterface;
	public path: {
		base: string,
		data: string
	};
	public list: main[];

	constructor(env: envInterface) {
		this.env = env;
		this.path = {
			base: resolve(env.datapack.base, 'advancements'),
			data: resolve(env.datapack.base, 'advancements', 'data')
		};
		this.list = [];
		if (!existsSync(this.path.data))
			mkdir(this.path.data, { recursive: true });
		else {
			readdirSync(this.path.data, { encoding: 'utf-8', withFileTypes: true })
				.forEach((f) => {
					if (f.isFile() && extname(f.name) === '.json')
						this.list.push(JSON.parse(readFileSync(resolve(this.path.data, f.name), { encoding: 'utf-8', flag: 'r' })) as main);
				});
		}
	}

	private randomString(size = 8) {
		return randomBytes(size).toString('hex');
	}
}

let __instance__: advancement;

exposeInMainWorld('advancement', {
	init: (env: envInterface) => {
		__instance__ = new advancement(env);
	},
	getList: () => __instance__.list
});
