import bezierEasing from 'bezier-easing';
import { writeFile, mkdir, access } from 'fs/promises';
import { resolve } from 'path';
import { fs, type sql } from 'mapcraft-api/backend';
import type { bezier, cutsceneInterface, cutscenePointInterface, transition } from '../interface';

interface CutsceneData {
	cameraEntity: string;
	cameraPlayer: string;
	entity: string;
	player: string;
	main: string;
	current_duration: number;
	old_duration: number;
}

class BezierCurve {
	private static bezierCurverGetCurve (transition: transition) {
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
	};

	static gen(distance: number, time: number, transition: transition = 'linear') {
		const duration = time * 20;
		const bezier = this.bezierCurverGetCurve(transition);
		const points = {
			step: { increment: 1.0 / duration, current: 0.0 },
			curve: { last: 0.0, current: 0.0 },
			percent: { last: 0.0, current: 0.0 },
		};
		const ret: bezier = { transition: transition, points: [] };
		let total = 0.0;

		if (ret.transition === 'linear')
			ret.points.push(distance / duration);
		else {
			for (let i = 0; i <= duration; i++) {
				points.curve.current = bezier(points.step.current);
				points.percent.current = points.curve.current - points.curve.last;
				points.step.current += points.step.increment;
				points.curve.last = points.curve.current;
				if (i < duration) {
					total += distance * points.percent.current;
					ret.points.push(distance * points.percent.current);
				} else if (i === duration)
					ret.points.push(distance - total);
			}
		}
		return ret;
	}
}

class GenerateCutsceneGen1 {
	private id: number;
	private db: sql;
	private path: { dir: string, main: string };

	constructor(
		id: number,
		db: sql,
		path: {dir: string, main: string},
	) {
		this.id = id;
		this.db = db;
		this.path = path;
	}

	private point(number: number) {
		return (number === 0.0)
			? ' ~0'
			: ` ~${number.toPrecision(10)}`;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private join(json: Record<any, any>) {
		let data = '';
		for (const id in json) {
			if (Object.prototype.hasOwnProperty.call(json, id)) {
				if (typeof json[id] === 'function') {
					const ret = json[id]();
					if (ret)
						data += `${ret.join('')}\n`;
				} else
					data += `${json[id].join('')}\n`;
			}
		}
		return data;
	}

	private genSavePosition (parse: string[]) {
		if (parse[0] === 'origin') {
			return [
				'# Save position',
				'\n',
				'execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] positioned as @s store result score @s MC_CutsceneSaveX run data get entity @s Pos[0]',
				'\n',
				'execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] positioned as @s store result score @s MC_CutsceneSaveY run data get entity @s Pos[1]',
				'\n',
				'execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] positioned as @s store result score @s MC_CutsceneSaveZ run data get entity @s Pos[2]',
				'\n',
				'execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] positioned as @s store result score @s MC_CutsceneSaveRx run data get entity @s Rotation[0]',
				'\n',
				'execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] positioned as @s store result score @s MC_CutsceneSaveRy run data get entity @s Rotation[1]'
			];
		}
		return undefined;
	}

	private genLoadPosition (parse: string[], time: { Max: number }) {
		if (parse[0] === 'custom') {
			const reg = /^[a-z]{1,2}:(.*)$/m;
			const point = { x: 0, y: 0, z: 0, rx: 0, ry: 0 };
			const temp = {
				x: reg.exec(parse[1]),
				y: reg.exec(parse[2]),
				z: reg.exec(parse[3]),
				rx: reg.exec(parse[4]),
				ry: reg.exec(parse[5])
			};
			if (temp.x)
				point.x = Number(temp.x[1]);
			if (temp.y)
				point.y = Number(temp.y[1]);
			if (temp.z)
				point.z = Number(temp.z[1]);
			if (temp.rx)
				point.rx = Number(temp.rx[1]);
			if (temp.ry)
				point.ry = Number(temp.ry[1]);
			return [
				'execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. run tp @s ',
				`${point.x} `, `${point.y} `, `${point.z} `,
				`${point.rx} `, `${point.ry}`,
			];
		} else if (parse[0] === 'last')
			return undefined;
		else if (parse[0] === 'origin') {
			return [
				'execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!Debug] run scoreboard players operation @s MC_PlayerX = @s MC_CutsceneSaveX',
				'\n',
				'execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!Debug] run scoreboard players operation @s MC_PlayerY = @s MC_CutsceneSaveY',
				'\n',
				'execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!Debug] run scoreboard players operation @s MC_PlayerZ = @s MC_CutsceneSaveZ',
				'\n',
				'execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!Debug] run scoreboard players operation @s MC_PlayerRx = @s MC_CutsceneSaveRx',
				'\n',
				'execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!Debug] run scoreboard players operation @s MC_PlayerRy = @s MC_CutsceneSaveRy',
				'\n',
				'execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!Debug] run function mapcraft:built_in/instant_tp/main'
			];
		}
	}

	private genPoint(points: cutscenePointInterface[], data: CutsceneData) {
		const Camera = {
			entity: ['execute if score @s MC_Cutscene matches ', ' run tp @s'],
			player: ['execute if score @s MC_Cutscene matches ', ' run tp @e[tag=Camera,sort=nearest]']
		};
		
		for (let id = 0; id < points.length; id++) {
			if ((id + 1) >= points.length)
				break;
			
			data.current_duration += points[id].duration * 20;
			const X = BezierCurve.gen(points[id + 1].x - points[id].x, points[id].duration, points[id].transition);
			const Y = BezierCurve.gen(points[id + 1].y - points[id].y, points[id].duration, points[id].transition);
			const Z = BezierCurve.gen(points[id + 1].z - points[id].z, points[id].duration, points[id].transition);
			const Rx = BezierCurve.gen(points[id + 1].rx - points[id].rx, points[id].duration, points[id].transition);
			const Ry = BezierCurve.gen(points[id + 1].ry - points[id].ry, points[id].duration, points[id].transition);

			if (points[id].transition === 'linear') {
				const teleport = [this.point(X.points[0]), this.point(Y.points[0]), this.point(Z.points[0]), this.point(Rx.points[0]), this.point(Ry.points[0])].join('');
				const matches = (id === 0 || data.old_duration >= data.current_duration)
					? (`..${data.current_duration}`)
					: (`${data.old_duration}..${data.current_duration}`);
				data.cameraEntity += `# Point ${points[id].point}\n${Camera.entity[0]}${matches}${Camera.entity[1]}${teleport}\n`;
				data.cameraPlayer += `# Point ${points[id].point}\n${Camera.player[0]}${matches}${Camera.player[1]}${teleport}\n`;
			} else {
				let timeToPoint = data.old_duration;
				data.cameraEntity += `# Point ${points[id].point}\n`;
				data.cameraPlayer += `# Point ${points[id].point}\n`;
				for (let _id = 0; timeToPoint <= data.current_duration; _id++) {
					const Teleport = [this.point(X.points[_id]), this.point(Y.points[_id]), this.point(Z.points[_id]), this.point(Rx.points[_id]), this.point(Ry.points[_id])].join('');
					data.cameraEntity += `${Camera.entity[0]}${timeToPoint}${Camera.entity[1]}${Teleport}\n`;
					data.cameraPlayer += `${Camera.player[0]}${timeToPoint++}${Camera.player[1]}${Teleport}\n`;
				}
			}

			data.old_duration = data.current_duration + 1;
		}
	}

	async generate(): Promise<void[]> {
		const cutscene: cutsceneInterface = await this.db.get('SELECT * FROM cutscene WHERE id = ?', this.id);
		const parse = cutscene.position.split(';');
		const points: cutscenePointInterface[] = await this.db.all('SELECT * FROM cutscenePoint WHERE cutsceneId = ? ORDER BY point', this.id);
		if (points.length <= 1)
			throw new Error('cutscene need two points');
		const tag = `Cutscene_${this.id.toString()}`;
		const time = { Max: cutscene.duration * 20 };
		const coordinates = {
			position: [points[0].x, points[0].y, points[0].z].join(' '),
			rotation: [points[0].rx, points[0].ry].join(' '),
		};
		const data = {
			cameraEntity: '', cameraPlayer: '',
			entity: '', player: '',
			main: '',
			current_duration: 0, old_duration: 0,
		} as CutsceneData;

		const filePath = {
			main: resolve(this.path.dir, this.id.toString(), 'main.mcfunction'),

			entity: resolve(this.path.dir, this.id.toString(), 'entity.mcfunction'),
			player: resolve(this.path.dir, this.id.toString(), 'player.mcfunction'),

			cameraEntity: resolve(this.path.dir, this.id.toString(), 'camera_entity.mcfunction'),
			cameraPlayer: resolve(this.path.dir, this.id.toString(), 'camera_player.mcfunction'),

			start: resolve(this.path.dir, this.id.toString(), 'start.mcfunction'),
			end: resolve(this.path.dir, this.id.toString(), 'end.mcfunction')
		};

		const templateFiles = {
			Launch: ['execute if entity @s[tag=Cutscene,tag=', tag ,'] run function mapcraft-data:cutscene/', this.id.toString(), '/main'],
			Start: ['# ', tag,' start'],
			End: ['# ', tag,' end'],
			Main: {
				0: ['execute if entity @s[type=minecraft:player] positioned ', coordinates.position, ' rotated ', coordinates.rotation, ' run function mapcraft-data:cutscene/', this.id.toString() ,'/player'],
				1: ['execute unless entity @s[type=minecraft:player] run function mapcraft-data:cutscene/', this.id.toString() ,'/entity']
			}
		};

		const templateEntityFile = {
			Core: {
				0: ['# Core'],
				1: () => this.genSavePosition(parse),
				2: ['execute if score @s MC_Cutscene matches 0 run tp @s[tag=', tag, ',tag=Cutscene,tag=!Debug] ', coordinates.position, ' ', coordinates.rotation],
				3: ['execute if score @s MC_Cutscene matches 0 unless entity @e[sort=nearest,tag=Cutscene,tag=Camera] run function mapcraft:built_in/cutscene/summon_camera'],
				4: ['execute if score @s MC_Cutscene matches 0 run tag @e[tag=Cutscene,tag=Camera,sort=nearest,limit=1] add ', tag],
				5: ['execute if score @s MC_Cutscene matches 0 run tp @e[tag=', tag ,',tag=Cutscene,tag=Camera,sort=nearest,limit=1] ', coordinates.position, ' ', coordinates.rotation],
				6: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=Debug] run data merge entity @e[tag=', tag ,',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1] {CustomNameVisible:1b,CustomName:\'{"text":"', cutscene.name ,'"}\'}'],
			},
			Init: {
				0: ['# Init'],
				1: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run function mapcraft-data:cutscene/', this.id.toString() ,'/start'],
				2: ['execute if entity @s[tag=Debug] positioned as @e[tag=', tag ,',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1] run particle minecraft:happy_villager ~ ~0.6 ~ 0 0 0 0 0 force'],
				3: ['execute if score @s MC_Cutscene matches 0.. if entity @s[tag=', tag ,',tag=!Debug] run kill @e[tag=', tag ,',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1]'],
			},
			Cutscene: {
				0: ['# Cutscene'],
				1: ['execute if score @s MC_Cutscene matches 1..', time.Max.toString(), ' run function mapcraft-data:cutscene/', this.id.toString(), '/camera_entity'],
				2: ['scoreboard players add @s MC_Cutscene 1'],
			},
			End: {
				0: ['# End'],
				1: ['execute if score @s MC_Cutscene matches ', time.Max.toString() ,'.. if entity @s[tag=', tag ,',tag=!Debug] run tag @s remove ', tag],
				2: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. run kill @e[tag=', tag, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1]'],
				3: () => this.genLoadPosition(parse, time),
				4: ['execute if score @s MC_Cutscene matches ', time.Max.toString() ,'.. if entity @s[tag=!Debug] run function mapcraft-data:cutscene/', this.id.toString() ,'/end'],
				5: ['execute if score @s MC_Cutscene matches ', time.Max.toString() ,'.. run scoreboard players set @s MC_Cutscene 0']
			}
		};

		const templatePlayerFile = {
			Core: {
				0: ['# Core'],
				1: () => this.genSavePosition(parse),
				2: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run function mapcraft:built_in/cutscene/save_gamemode'],
				3: ['execute if score @s MC_Cutscene matches 0 run tp @s[tag=', tag, ',tag=Cutscene,tag=!Debug] ~ ~ ~ ~ ~'],
				4: ['execute if score @s MC_Cutscene matches 0 unless entity @e[sort=nearest,tag=Cutscene,tag=Camera] run function mapcraft:built_in/cutscene/summon_camera'],
				5: ['execute if score @s MC_Cutscene matches 0 run tag @e[tag=Cutscene,tag=Camera,sort=nearest,limit=1] add ', tag],
				6: ['execute if score @s MC_Cutscene matches 0 run tp @e[tag=', tag ,',tag=Cutscene,tag=Camera,sort=nearest,limit=1] ~ ~ ~ ~ ~'],
				7: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=Debug] run data merge entity @e[tag=', tag ,',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1] {CustomNameVisible:1b,CustomName:\'{"text":"', cutscene.name ,'"}\'}'],
			},
			Init: {
				0: ['# Init'],
				1: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run gamemode spectator @s'],
				2: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run spectate @e[tag=', tag ,',tag=Cutscene,tag=Camera,sort=nearest,limit=1] @s'],
				3: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run function mapcraft-data:cutscene/', this.id.toString() ,'/start'],
				4: ['execute if entity @s[tag=Debug] positioned as @e[tag=', tag ,',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1] run particle minecraft:happy_villager ~ ~0.6 ~ 0 0 0 0 0 force'],
				5: ['execute if score @s MC_Cutscene matches 0.. if entity @s[tag=', tag ,',tag=!Debug] run kill @e[tag=', tag ,',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1]'],
			},
			Cutscene: {
				0: ['# Cutscene'],
				1: ['execute if entity @s[tag=', tag ,',tag=!Debug] if score @s MC_Cutscene matches ..', time.Max.toString() ,' if entity @e[tag=', tag ,',tag=Cutscene,tag=Camera,sort=nearest,limit=1,distance=1..] run spectate @e[tag=', tag ,',tag=Cutscene,tag=Camera,sort=nearest,limit=1] @s'],
				2: ['scoreboard players add @s MC_Cutscene 1'],
				3: ['execute if score @s MC_Cutscene matches 1..', time.Max.toString(), ' at @e[tag=', tag, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1] run function mapcraft-data:cutscene/', this.id.toString(), '/camera_player'],
			},
			End: {
				0: ['# End'],
				1: ['execute if score @s[tag=', tag ,',tag=!Debug] MC_Cutscene matches ..', time.Max.toString() ,' if entity @e[tag=', tag ,',tag=Cutscene,tag=Camera,sort=nearest,limit=1,distance=1..] run spectate @e[tag=', tag ,',tag=Cutscene,tag=Camera,sort=nearest,limit=1] @s'],
				4: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. run kill @e[tag=', tag, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1]'],
				5: ['execute if score @s MC_Cutscene matches ', time.Max.toString(), '.. if entity @s[tag=!Debug] run function mapcraft:built_in/cutscene/load_gamemode'],
				6: () => this.genLoadPosition(parse, time),
				7: ['execute if score @s MC_Cutscene matches ', time.Max.toString() ,'.. if entity @s[tag=', tag ,',tag=!Debug] run tag @s remove ', tag],
				8: ['execute if score @s MC_Cutscene matches ', time.Max.toString() ,'.. if entity @s[tag=!Debug] run function mapcraft-data:cutscene/', this.id.toString() ,'/end'],
				9: ['execute if score @s MC_Cutscene matches ', time.Max.toString() ,'.. run scoreboard players set @s MC_Cutscene 0']
			}
		};

		/**
		 * Generate
		 */
		this.genPoint(points, data);

		data.main += this.join(templateFiles.Main);

		data.entity += this.join(templateEntityFile.Core);
		data.entity += this.join(templateEntityFile.Init);
		data.entity += this.join(templateEntityFile.Cutscene);
		data.entity += this.join(templateEntityFile.End);

		data.player += this.join(templatePlayerFile.Core);
		data.player += this.join(templatePlayerFile.Init);
		data.player += this.join(templatePlayerFile.Cutscene);
		data.player += this.join(templatePlayerFile.End);

		/**
		 * Create dir of cutscene and add start line
		 */
		await access(resolve(this.path.dir, this.id.toString()))
			.catch(() => mkdir(resolve(this.path.dir, this.id.toString()), { recursive: true }));
		fs.modifyLine(this.path.main, `tag=${tag}`, templateFiles.Launch.join(''), true);

		/**
		 * Create start and end mcfunction files
		 */
		await Promise.all([
			writeFile(filePath.start , `${templateFiles.Start.join('')}\n`, { encoding: 'utf-8', flag: 'wx' }),
			writeFile(filePath.end, `${templateFiles.End.join('')}\n`, { encoding: 'utf-8', flag: 'wx' })
		]).catch(() => { /* make nothing */ });

		/**
		 * Create cutscene data mcfunction files
		 */
		return Promise.all([
			writeFile(filePath.main, data.main, { encoding: 'utf-8', flag: 'w' }),
			writeFile(filePath.entity, data.entity, { encoding: 'utf-8', flag: 'w' }),
			writeFile(filePath.player, data.player, { encoding: 'utf-8', flag: 'w' }),
			writeFile(filePath.cameraEntity, data.cameraEntity, { encoding: 'utf-8', flag: 'w' }),
			writeFile(filePath.cameraPlayer, data.cameraPlayer, { encoding: 'utf-8', flag: 'w' }),
		]);
	}
}

export default (
	id: number,
	db: sql,
	path: {dir: string, main: string}
): Promise<void[]> => {
	/*
	const version = mapStore().minecraftVersion;

	if (
		version === '1.17' || version === '1.17.1' || version === '1.17.2'
		|| version === '1.18' || version === '1.18.1' || version === '1.18.2'
		|| version === '1.19' || version === '1.19.1' || version === '1.19.2' || version === '1.19.3' || version === '1.19.4'
	)
	*/
	const generateCutscene = new GenerateCutsceneGen1(id, db, path);
	return generateCutscene.generate();
};
