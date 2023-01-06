import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { readFileSync } from 'fs';
import { mkdir, readFile, rm } from 'fs/promises';
import { resolve } from 'path';
import { catogory, envInterface, type, sounds, sound } from './interface';

class music {
	private env: envInterface;
	private id: number;
	public json: Record<string, sound>;
	public path: {
		base: string,
		json: string
	};

	constructor(env: envInterface) {
		this.path = {
			base: resolve(env.resourcepack, 'assets', 'mapcraft', 'sounds'),
			json: resolve(env.resourcepack, 'assets', 'mapcraft', 'sounds.json')
		};
		this.env = env;
		this.id = 0;
		this.json = JSON.parse(readFileSync(this.path.json, { encoding: 'utf-8', flag: 'r' })) as Record<string, sound>;
		for (const id in this.json)
			this.id = this.json[id].id;
	}

	isExist(name: string): boolean {
		for (const id in this.json) {
			if (id === name)
				return true;
		}
		return false;
	}

	async addMusic(sound: sound) {
		const path = resolve(this.path.base, sound.name);
		const temp = {
			category: sound.category ?? 'none',
			id: ++this.id,
			name: sound.name,
			sounds: [],
			replace: sound.replace ?? undefined,
			subtitle: sound.subtitle ?? undefined
		} as sound;
		// await mkdir(path);
		// this.json[sound.name] = temp;
		return temp;
	}

	async removeMusic(name: string) {
		if (!this.isExist(name))
			throw new Error(`${name} not exist`);
		const path = resolve(this.path.base, name);
		await rm(path, { force: true, recursive: true });
		delete this.json[name];
	}

	async addSound(name: string, sound: sounds) {
		this.json[name].sounds.push(sound);
	}

	async removeSound(name: string, soundName: string) {
		for (const id in this.json[name].sounds) {
			if (this.json[name].sounds[id].name === soundName) {
				delete this.json[name].sounds[id];
				return true;
			}
		}
		return false;
	}
}

let __instance__: music;

exposeInMainWorld('music', {
	init: (env: envInterface) => {
		__instance__ = new music(env);
	},
	get: () => __instance__.json,
	music: {
		add: (sound: sound) => __instance__.addMusic(sound),
		remove: (name: string) => __instance__.removeMusic(name),
	},
	sound: {
		add: (name: string, sound: sounds) => __instance__.addSound(name, sound),
		remove: (name: string, soundName: string) => __instance__.removeSound(name, soundName),
	}
});
