import { exposeInMainWorld } from 'app/src/api/plugins/backend';
import { existsSync, readFileSync } from 'fs';
import { cp, mkdir, rm, writeFile } from 'fs/promises';
import { basename, resolve } from 'path';
import { fs } from 'mapcraft-api/backend';
import { sounds, sound, category } from './interface';
import { envInterface } from '../interface';

class music {
	private env: envInterface;
	private id: number;
	public json: Record<string, sound>;
	public path: {
		base: string,
		json: string
	};
	public datapack: {
		execute: string,
		function: string
	};

	constructor(env: envInterface) {
		this.path = {
			base: resolve(env.resourcepack, 'assets', 'mapcraft', 'sounds'),
			json: resolve(env.resourcepack, 'assets', 'mapcraft', 'sounds.json')
		};
		this.datapack = {
			execute: resolve(env.datapack.base, 'functions', 'music', 'execute.mcfunction'),
			function: resolve(env.datapack.base, 'functions', 'music')
		};
		this.env = env;
		this.id = 0;
		this.json = JSON.parse(readFileSync(this.path.json, { encoding: 'utf-8', flag: 'r' })) as Record<string, sound>;
		for (const id in this.json)
			this.id = this.json[id].id;
		if (!existsSync(this.datapack.function))
			mkdir(this.datapack.function, { recursive: true });
	}

	isExist(name: string): boolean {
		for (const id in this.json) {
			if (id === name)
				return true;
		}
		return false;
	}

	async saveFile(data?: Record<string, sound>) {
		return writeFile(this.path.json, JSON.stringify(data ?? this.json, null, 2), { encoding: 'utf-8', flag: 'w' });
	}

	async addMusic(sound: sound) {
		const path = resolve(this.path.base, sound.name);
		if (existsSync(path))
			throw new Error(`${sound.name} exist`);
		const temp = {
			category: sound.category ?? 'none',
			id: ++this.id,
			name: sound.name,
			sounds: [],
			replace: sound.replace ?? undefined,
			subtitle: sound.subtitle ?? undefined
		} as sound;
		await mkdir(path);
		this.json[sound.name] = temp;
		this.saveFile();
		return temp;
	}

	async removeMusic(name: string) {
		if (!this.isExist(name))
			throw new Error(`${name} not exist`);
		const path = resolve(this.path.base, name);
		await rm(path, { force: true, recursive: true });
		delete this.json[name];
		this.saveFile();
	}

	async addSound(name: string, sound: sounds) {
		this.json[name].sounds.push(sound);
		this.saveFile();
	}

	async uploadSound(d: {
		index: number,
		name: string,
		file: File
	}) {
		if (!d)
			return;
		const retName = `mapcraft:${this.json[d.name].name}/${basename(d.file.path).replace('.ogg', '')}`;
		const destPath = resolve(this.path.base, this.json[d.name].name, basename(d.file.path));
		await rm(resolve(this.path.base, ...this.json[d.name].sounds[d.index].name.slice(this.json[d.name].sounds[d.index].name.indexOf(':') + 1).concat('.ogg').split('/')), { force: true, recursive: true });
		await cp(d.file.path, destPath, { force: true, recursive: false });
		this.json[d.name].sounds[d.index].name = retName;
		this.saveFile();
		return retName;
	}

	getSound(name: string | undefined) {
		if (!name)
			return '';
		return resolve(this.path.base, ...name.slice(name.indexOf(':') + 1).concat('.ogg').split('/'));
	}

	async removeSound(name: string, soundName: string) {
		for (const id in this.json[name].sounds) {
			if (this.json[name].sounds[id].name === soundName) {
				this.json[name].sounds.splice(Number(id), 1);
				await rm(resolve(this.path.base, ...soundName.slice(soundName.indexOf(':') + 1).concat('.ogg').split('/')), { force: true, recursive: true });
				this.saveFile();
				return;
			}
		}
		throw new Error('no sound to delete');
	}

	//#region datapack

	/**
	 * 1: 11, 12, 13, ...
	 * 2: 21, 22, 23, ...
	 * ...
	 */
	async datapackCreateMusic(d: {
		id: number,
		name: string,
		index: number,
		category: category,
		duration: number
	}) {
		const soundId = `${d.id}${d.index}`;
		const category: category = (d.category === 'none')
			? 'master'
			: d.category;
		const duration = isNaN(d.duration)
			? 0
			: d.duration;
		const path = resolve(this.datapack.function, `${soundId}.mcfunction`);
		const data = [
			`execute if score @s MC_MusicTime matches 1 run playsound ${d.name} ${category} @s ~ ~ ~`,
			`execute if score @s[tag=!RepeatMusic] MC_MusicTime matches ${duration}.. run scoreboard players set @s MC_Music 0`,
			`execute if score @s MC_MusicTime matches ${duration}.. run scoreboard players set @s MC_MusicTime -1`,
			'scoreboard players add @s MC_MusicTime 1',
		];
		if (!existsSync(this.datapack.execute))
			await writeFile(this.datapack.execute, '', { encoding: 'utf-8', flag: 'w', mode: 0o666 });
		await writeFile(path, data.join('\n'), { encoding: 'utf-8', flag: 'w' });
		await fs.modifyLine(
			this.datapack.execute,
			`function mapcraft-data:music/${soundId}`,
			`execute if score @s MC_Music matches ${soundId} run function mapcraft-data:music/${soundId}`,
			true
		);
	}

	async datapackDeleteMusic(id: number, index: number) {
		const soundId = `${id}${index}`;
		const path = resolve(this.datapack.function, `${soundId}.mcfunction`);
		if (!existsSync(this.datapack.execute))
			return;
		await rm(path, { force: true });
		await fs.removeLine(this.datapack.execute, `matches ${soundId.toString()}`);
	}
	//#endregion datapack
}

let __instance__: music;

exposeInMainWorld('music', {
	init: (env: envInterface) => {
		__instance__ = new music(env);
	},
	get: () => __instance__.json,
	save: (data?: Record<string, sound>) => __instance__.saveFile(data),
	datapack: {
		create: (d: {
			id: number,
			name: string,
			index: number,
			category: category,
			duration: number}) => __instance__.datapackCreateMusic(d),
		delete: (id: number, index: number) => __instance__.datapackDeleteMusic(id, index)
	},
	music: {
		add: (sound: sound) => __instance__.addMusic(sound),
		remove: (name: string) => __instance__.removeMusic(name),
	},
	sound: {
		add: (name: string, sound: sounds) => __instance__.addSound(name, sound),
		get: (name: string) => __instance__.getSound(name),
		upload: (d: { name: string, index: number, file: File }) => __instance__.uploadSound(d),
		remove: (name: string, soundName: string) => __instance__.removeSound(name, soundName),
	}
});
