/**
 * tags: cutscene, cutscene_{id}
 * debug: debug, debugCutscene
 */

import bezierEasing from 'bezier-easing';
import { writeFile, mkdir, access, rm } from 'fs/promises';
import { resolve } from 'path';
import ipc from 'electron/ipc/render';
import { fs } from 'mapcraft-api/backend';
import database, { tableInterface } from 'mapcraft-api/dist/types/src/backend/sql';

import { mapEngineInstance } from 'electron/preload/engine';
import { exposeInMainWorld } from 'api/plugins/backend';
import { existsSync, writeFileSync } from 'fs';

export interface envInterface {
	datapack: {
		base: string;
		default: string;
	},
	resourcepack: string;
}

export interface bezier {
	transition: 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear',
	points: number[]
}

export interface cutsceneInterface {
	id: number;
	name: string;
	tag: string;
	duration: number;
}

export interface cutscenePointInterface {
	cutsceneId: number;
	point: number;
	x: number;
	y: number;
	z: number;
	rx: number;
	ry: number;
	duration: number;
	transition: 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear'
}

class cutscene {
	private env: envInterface;
	private name: string;
	private tables: tableInterface[];
	public db: database;
	public _path: {
		dir: string;
		main: string;
	};

	constructor() {
		this.env = {} as envInterface;
		this.name = '';
		this.tables = [
			{
				name: 'cutscene',
				sql: 'CREATE TABLE IF NOT EXISTS "cutscene" (\
					"id" INTEGER,\
					"name" TEXT,\
					"tag" TEXT,\
					"duration" INTEGER,\
					"description" TEXT,\
					PRIMARY KEY("id" AUTOINCREMENT)\
					UNIQUE("name")\
				);'
			},
			{
				name: 'cutscenePoint',
				sql: 'CREATE TABLE IF NOT EXISTS "cutscenePoint" (\
					"cutsceneId" INTEGER,\
					"point" INTEGER,\
					"x" INTEGER,\
					"y" INTEGER,\
					"z" INTEGER,\
					"rx" INTEGER,\
					"ry" INTEGER,\
					"duration" INTEGER,\
					"transition" TEXT\
				);'
			}
		];
		this.db = {} as database;
		this._path = {} as {dir: string, main: string};
	}

	async init(env: envInterface, name: string): Promise<void> {
		this.env = env;
		this.name = name;
		this.db = mapEngineInstance.database;
		this._path = {
			dir: resolve(env.datapack.base, 'functions', 'cutscene'),
			main: resolve(env.datapack.base, 'functions', 'cutscene', 'start.mcfunction')
		};
		this.db.addTable(this.tables);
		await access(this._path.dir)
			.catch(async () => await mkdir(this._path.dir, { recursive: true }));
		return await writeFile(this._path.main, '', { encoding: 'utf-8', flag: 'wx' })
			.catch(() => { /* make nothing */ });
	}

	openFile(id: number, start: boolean = true): void {
		const link = resolve(this._path.dir, id.toString(), `${start
			? 'start'
			: 'end'
		}.mcfunction`);
		if (!existsSync(link)) {
			writeFileSync(link, `# Cutscene ${start
				? 'start'
				: 'end'
			}\n`, { encoding: 'utf-8', flag: 'w' });
		}
		ipc.send('editor::open-editor', link);
	}

	//#region Getter
	async getCutscene(id: number | undefined = undefined): Promise<cutsceneInterface | cutsceneInterface[]> {
		if (id === undefined)
			return this.db.all('SELECT * FROM cutscene');
		return this.db.get('SELECT * FROM cutscene WHERE id = ?', id);
	}

	async getPoints(id: number): Promise<cutscenePointInterface[]> {
		return this.db.all('SELECT * FROM cutscenePoint WHERE cutsceneId = ?', id);
	}
	//#endregion Getter

	async createCutscene(name: string): Promise<cutsceneInterface> {
		await this.db.update('INSERT INTO cutscene (name, duration) VALUES (?, ?)', name, 0);
		const ret: cutsceneInterface = await this.db.get('SELECT * FROM cutscene WHERE name = ?', name);
		await this.db.update('UPDATE cutscene SET tag = ? WHERE id = ?', `cutscene_${ret.id}`, ret.id);
		await Promise.all([
			fs.addLine(this._path.main, `execute positioned 0 0 0 rotated 0 0 if entity @s[tag=cutscene,tag=cutscene_${ret.id}] run function mapcraft-data:cutscene/${ret.id}/cutscene`),
			mkdir(resolve(this._path.dir, ret.id.toString()))
		]);
		return {
			id: Number(ret.id),
			name: String(ret.name),
			tag: `Cutscene_${ret.id}`,
			duration: Number(ret.duration)
		};
	}

	async deleteCutscene(id: number): Promise<void> {
		await Promise.all([
			this.db.update('DELETE FROM cutscenePoint WHERE cutsceneId = ?', id),
			this.db.update('DELETE FROM cutscene WHERE id = ?', id),
			fs.removeLine(this._path.main, `tag=cutscene_${id.toString()}`),
		]);
		return rm(resolve(this._path.dir, id.toString()), { recursive: true });
	}

	//#region cutscene generation
	private bezierCurverGetCurve(transition: 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear') {
		switch (transition) {
		case 'ease':
			return bezierEasing(0.25, 0.1, 0.25, 1);
		case 'ease-in':
			return bezierEasing(0.42, 0, 1, 1);
		case 'ease-out':
			return bezierEasing(0, 0, 0.58, 1);
		case 'ease-in-out':
			return bezierEasing(0.42, 0, 0.58, 1);
		case 'linear':
		default:
			return bezierEasing(0, 0, 1, 1);
		}
	}

	private bezierCurve(distance: number, time: number, transition: 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear' = 'linear'): bezier {
		const duration = time * 20;
		const bezier = this.bezierCurverGetCurve(transition);
		let total = 0.0;
		const points = {
			step: { increment: 1.0 / duration, current: 0.0 },
			curve: { last: 0.0, current: 0.0 },
			percent: { last: 0.0, current: 0.0 },
		};
		const ret: bezier = {} as bezier;

		if (transition === 'linear')
			ret.points.push(parseFloat((distance / duration).toFixed(6)));
		else {
			for (let i = 0; i <= duration; i++) {
				points.curve.current = bezier(points.step.current);
				points.percent.current = points.curve.current - points.curve.last;
				points.step.current += points.step.increment;
				points.curve.last = points.curve.current;
				if (i < duration) {
					total += parseFloat((distance * points.percent.current).toFixed(6));
					ret.points.push(parseFloat((distance * points.percent.current).toFixed(6)));
				} else if (i === duration)
					ret.points.push(parseFloat((distance - total).toFixed(6)));
			}
		}
		return (ret);
	}

	private point(number: number) {
		return number === 0.0
			? ' ~0'
			: ` ~${number}`;
	}

	async generateCutscene(id: number): Promise<void[]> {
		const cutscene: cutsceneInterface = await this.db.get('SELECT * FROM cutscene WHERE id = ?', id);
		const points: cutscenePointInterface[] = await this.db.get('SELECT * FROM cutscenePoint WHERE cutsceneId = ? ORDER BY point', id);
		// create dir if not exist
		await access(resolve(this._path.dir, id.toString()))
			.catch(() => mkdir(resolve(this._path.dir, id.toString()), { recursive: true }));

		if (points.length <= 1)
			throw new Error('');
		const tag = `cutscene_${id.toString()}`;
		const name = cutscene.name;
		const time = { Max: cutscene.duration * 20 };
		const coordinates = {
			position: [points[0].x, points[0].y, points[0].z].join(' '),
			rotation: [points[0].rx, points[0].ry].join(' '),
		};
		const commands = {
			Launch: ['execute positioned ', coordinates.position, ' rotated ', coordinates.rotation, ' if entity @s[tag=cutscene,tag=cutscene_', id.toString(), '] run function mapcraft-data:cutscene/', id.toString(), '/cutscene'],
			Core: {
				0: ['# Core'],
				1: ['execute if score @s MC_Cutscene matches 0 run tp @s[tag=', tag, ',tag=cutscene,tag=!debug] ~ ~ ~ ~ ~'],
				2: ['execute if score @s MC_Cutscene matches 0 unless entity @e[sort=nearest,tag=cutscene,tag=Camera] run function mapcraft:built_in/cutscene/summon_camera'],
				3: ['execute if score @s MC_Cutscene matches 0 run tag @e[tag=cutscene,tag=Camera,sort=nearest,limit=1] add ', tag],
				4: ['execute if score @s MC_Cutscene matches 0 run tp @e[tag=', tag, ',tag=cutscene,tag=Camera,sort=nearest,limit=1] ', coordinates.position, ' ', coordinates.rotation],
				5: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=debug] run data merge entity @e[tag=', tag, ',tag=cutscene,tag=Camera,tag=debugCutscene,sort=nearest,limit=1] {CustomNameVisible:1b,CustomName:\'{"text":"', name, '"}\'}'],
				6: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!debug] run gamemode spectator @s'],
				7: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!debug] run spectate @e[tag=', tag, ',tag=cutscene,tag=Camera,sort=nearest,limit=1] @s'],
				8: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!debug] run function mapcraft-data:cutscene/', id.toString(), '/start'],
				9: ['execute if entity @s[tag=debug] positioned as @e[tag=', tag, ',tag=cutscene,tag=Camera,tag=debugCutscene,sort=nearest,limit=1] run particle minecraft:happy_villager ~ ~0.6 ~ 0 0 0 0 0 force'],
				10: ['execute if score @s MC_Cutscene matches 0.. if entity @s[tag=', tag, ',tag=!debug] run kill @e[tag=', tag, ',tag=cutscene,tag=Camera,tag=debugCutscene,sort=nearest,limit=1]'],
				11: ['scoreboard players add @s MC_Cutscene 1'],
				12: ['# Cutscene'],
			},
			End: {
				0: ['# End'],
				1: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=', tag, ',tag=!debug] run spectate'],
				2: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=', tag, ',tag=!debug] run gamemode creative @s'],
				3: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. run kill @e[tag=', tag, ',tag=cutscene,tag=Camera,sort=nearest,limit=1]'],
				4: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!debug] run tag @s remove ', tag],
				5: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!debug] run function mapcraft-data:cutscene/', id.toString(), '/end'],
				6: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. run scoreboard players set @s MC_Cutscene 0'],
			},
			LaunchCamera: ['execute if score @s MC_Cutscene matches 0..', time.Max.toString(), ' at @e[tag=', tag, ',tag=cutscene,tag=Camera,sort=nearest,limit=1] run function mapcraft-data:cutscene/', id.toString(), '/camera'],
			Camera: ['execute if score @s MC_Cutscene matches ', ' run tp @e[tag=Camera,sort=nearest]'],
			TeleportPlayer: ['execute if score @s[tag=', tag, ',tag=!debug] MC_Cutscene matches ..', time.Max.toString(), ' if entity @e[tag=', tag, ',tag=cutscene,tag=Camera,sort=nearest,limit=1,distance=1..] run spectate @e[tag=', tag, ',tag=cutscene,tag=Camera,sort=nearest,limit=1] @s'],
		};
		const data = {
			file: '',
			camera: '',
			current_duration: 0,
			old_duration: 0,
		};
		const Join = (JSON: Record<any, any>) => {
			let _data = '';
			for (const id in JSON) {
				if (Object.prototype.hasOwnProperty.call(JSON, id)) {
					_data += JSON[id].join('');
					_data += '\n';
				}
			}
			return (_data);
		};
		fs.modifyLine(this._path.main, `tag=${tag}`, commands.Launch.join(''), true);
		data.file += Join(commands.Core);
		data.file += `${commands.LaunchCamera.join('')}\n`;
		for (let id = 0; id < points.length; id++) {
			if ((id + 1) >= points.length)
				break;
			data.current_duration += points[id].duration * 20;
			const X = this.bezierCurve(points[id + 1].x - points[id].x, points[id].duration, points[id].transition);
			const Y = this.bezierCurve(points[id + 1].y - points[id].y, points[id].duration, points[id].transition);
			const Z = this.bezierCurve(points[id + 1].z - points[id].z, points[id].duration, points[id].transition);
			const Rx = this.bezierCurve(points[id + 1].rx - points[id].rx, points[id].duration, points[id].transition);
			const Ry = this.bezierCurve(points[id + 1].ry - points[id].ry, points[id].duration, points[id].transition);

			if (points[id].transition === 'linear') {
				data.camera += `# Point ${points[id].point}\n`;
				const teleport = [this.point(X.points[0]), this.point(Y.points[0]), this.point(Z.points[0]), this.point(Rx.points[0]), this.point(Ry.points[0])].join('');
				const matches = (id === 0 || data.old_duration >= data.current_duration)
					? (`..${data.current_duration}`)
					: (`${data.old_duration}..${data.current_duration}`);
				data.camera += `${commands.Camera[0]}${matches}${commands.Camera[1]}${teleport}\n`;
			} else {
				let timeToPoint = data.old_duration;
				data.camera += `# Point ${points[id].point}\n`;
				for (let _id = 0; timeToPoint <= data.current_duration; _id++) {
					const Teleport = [this.point(X.points[_id]), this.point(Y.points[_id]), this.point(Z.points[_id]), this.point(Rx.points[_id]), this.point(Ry.points[_id])].join('');
					data.camera += `${commands.Camera[0]}${timeToPoint++}${commands.Camera[1]}${Teleport}\n`;
				}
			}
			data.old_duration = data.current_duration + 1;
		}
		data.file += `# Put the player back in place\n${commands.TeleportPlayer.join('')}\n`;
		data.file += Join(commands.End);

		return Promise.all([
			writeFile(resolve(this._path.dir, id.toString(), 'cutscene.mcfunction'), data.file, { encoding: 'utf-8', flag: 'w' }),
			writeFile(resolve(this._path.dir, id.toString(), 'camera.mcfunction'), data.camera, { encoding: 'utf-8', flag: 'w' }),
			writeFile(resolve(this._path.dir, id.toString(), 'start.mcfunction'), '# Cutscene start\n', { encoding: 'utf-8', flag: 'wx' }),
			writeFile(resolve(this._path.dir, id.toString(), 'end.mcfunction'), '# Cutscene end\n', { encoding: 'utf-8', flag: 'wx' })
		]);
	}
	//#endregion cutscene generation
}

const __instance__ = new cutscene();
exposeInMainWorld('cutscene', {
	__builtin__: true,
	init: (env: envInterface, name: string) => __instance__.init(env, name),
	openFile: (id: number, start: boolean = true) => __instance__.openFile(id, start),
	getCutscene: (id: number | undefined = undefined) => __instance__.getCutscene(id),
	getPoints: (id: number) => __instance__.getPoints(id),
	create: (name: string) => __instance__.createCutscene(name),
	delete: (id: number) => __instance__.deleteCutscene(id),
	generate: (id: number) => __instance__.generateCutscene(id)
});
