import { exposeInMainWorld } from '@/api/plugins/backend';
import ipc from '@/electron/ipc/render';
import { mapEngineInstance } from '@/electron/preload/engine';
import { existsSync, writeFileSync } from 'fs';
import { access, mkdir, rm } from 'fs/promises';
import { fs, sql } from 'mapcraft-api/backend';
import { minecraft } from 'mapcraft-api/frontend';
import { resolve } from 'path';
import { createTrigger, triggerInterface } from './interface';
import { envInterface } from '../interface';
import type { tableInterface } from 'mapcraft-api';

class trigger {
	private env: envInterface;
	private table: tableInterface;
	private db: sql;
	public datapackDir: {
		base: string,
		detect: string,
		execute: string
	};

	constructor(env: envInterface) {
		let temp = resolve(env.datapack.base, 'functions', 'trigger');
		this.env = env;
		this.table = {
			name: 'trigger',
			sql: 'CREATE TABLE IF NOT EXISTS "trigger" (\
				"id" INTEGER,\
				"name" TEXT,\
				"onlyOnce"	INTEGER NOT NULL DEFAULT 0,\
				"x1" INTEGER,\
				"y1" INTEGER,\
				"z1" INTEGER,\
				"x2" INTEGER,\
				"y2" INTEGER,\
				"z2" INTEGER,\
				PRIMARY KEY("id" AUTOINCREMENT)\
				UNIQUE ("name")\
			);'
		};
		this.db = mapEngineInstance.database;
		this.datapackDir = {
			base: temp,
			detect: resolve(temp, 'detect.mcfunction'),
			execute: resolve(temp, 'execute.mcfunction'),
		};
		this.db.addTable(this.table);
		this.db.get('SELECT minecraftVersion FROM info')
			.then((d) => d.minecraftVersion)
			.then((d: string) => {
				if ((minecraft.semverCompare(d , '1.21') >= 0)) {
					temp = resolve(env.datapack.base, 'function', 'trigger');
					this.datapackDir = {
						base: temp,
						detect: resolve(temp, 'detect.mcfunction'),
						execute: resolve(temp, 'execute.mcfunction'),
					};
				}
			
			})
			.finally(() => {
				access(this.datapackDir.base)
					.catch(async () => await mkdir(this.datapackDir.base, { recursive: true }));
			});
	}

	editFile(id: number): void {
		const link = resolve(this.datapackDir.base, id.toString(), 'execute.mcfunction');

		if (!existsSync(link))
			writeFileSync(link, `# Trigger ${id.toString()}\n`, { encoding: 'utf-8', flag: 'w' });
		ipc.send('editor::open-editor', link);
	}

	async getTriggers(id: number | undefined = undefined): Promise<triggerInterface | triggerInterface[]> {
		if (id === undefined)
			return this.db.all('SELECT * FROM trigger');
		return this.db.get('SELECT * FROM trigger WHERE id = ?', id);
	}

	async create(data: createTrigger): Promise<triggerInterface> {
		await this.db.update(
			'INSERT INTO trigger (name, onlyOnce, x1, y1, z1, x2, y2, z2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			data.name, data.onlyOnce,
			data.x1, data.y1, data.z1,
			data.x2, data.y2, data.z2
		);
		const ret: triggerInterface = await this.db.get('SELECT id FROM trigger WHERE name = ?', data.name);
		const format = {
			id: ret.id,
			name: data.name,
			onlyOnce: data.onlyOnce,
			x1: data.x1, y1: data.y1, z1: data.z1,
			x2: data.x2, y2: data.y2, z2: data.z2
		} as triggerInterface;
		this.generateTrigger(format);
		return format;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	generateTrigger(data: triggerInterface, _edit = false) {
		const triggerPath = resolve(this.datapackDir.base, data.id.toString());

		mkdir(triggerPath, { recursive: true })
			.then(() => {
				writeFileSync(
					resolve(triggerPath, 'detect.mcfunction'),
					[
						'execute if entity @s[x=', data.x1.toString(),
						',y=', data.y1.toString(),
						',z=', data.z1.toString(),
						',dx=', (data.x2 - data.x1).toString(),
						',dy=', (data.y2 - data.y1).toString(),
						',dz=', (data.z2 - data.z1).toString(),
						'] run scoreboard players set @s MC_Trigger ', data.id.toString()
					].join(''),
					{ encoding: 'utf-8', flag: 'w' }
				);

				if (!existsSync(resolve(triggerPath, 'execute.mcfunction'))) {
					writeFileSync(
						resolve(triggerPath, 'execute.mcfunction'),
						`# Trigger ${data.id.toString()}\n`,
						{ encoding: 'utf-8', flag: 'w' }
					);
				}
				
				if (data.onlyOnce === 1) {
					writeFileSync(
						resolve(triggerPath, 'reset.mcfunction'),
						`tag @s remove Trigger${data.id.toString()}`,
						{ encoding: 'utf-8', flag: 'w' }
					);
					writeFileSync(
						resolve(triggerPath, 'execute_only_once.mcfunction'),
						`tag @s add Trigger${data.id.toString()}\nfunction mapcraft-data:trigger/${data.id.toString()}/execute`,
						{ encoding: 'utf-8', flag: 'w' }
					);
				}
				fs.modifyLine(
					this.datapackDir.detect,
					`trigger/${data.id.toString()}/detect`,
					`function mapcraft-data:trigger/${data.id.toString()}/detect`,
					true
				);
				fs.modifyLine(
					this.datapackDir.execute,
					`score @s MC_Trigger matches ${data.id.toString()}`,
					[
						'execute if score @s MC_Trigger matches ', data.id.toString(),
						(data.onlyOnce === 1) ? ` unless entity @s[tag=Trigger${data.id.toString()}] ` : ' ',
						`run function mapcraft-data:trigger/${data.id.toString()}/`,
						(data.onlyOnce === 1) ? 'execute_only_once' : 'execute'
					].join(''),
					true
				);
			})
			.catch((e) => window.log.error(e));
	}

	async delete(id: number): Promise<void> {
		const link = resolve(this.datapackDir.base, id.toString());
		const occ = `/${id.toString()}/`;

		try {
			if (existsSync(link))
				rm(link, { recursive: true });
		} catch {
			/// make nothing
		}
		await fs.removeLine(this.datapackDir.detect, occ);
		await fs.removeLine(this.datapackDir.execute, occ);
		await this.db.update('DELETE FROM trigger WHERE id = ?', id);
	}

	async editTrigger(data: triggerInterface): Promise<void> {
		this.generateTrigger(data, true);
		await this.db.update(
			'UPDATE trigger SET name = ?, onlyOnce = ?, x1 = ?, y1 = ?, z1 = ?, x2 = ?, y2 = ?, z2 = ? WHERE id = ?',
			data.name, data.onlyOnce,
			data.x1, data.y1, data.z1,
			data.x2, data.y2, data.z2,
			data.id
		);
	}
}

let __instance__: trigger;
exposeInMainWorld('trigger', {
	init: (env: envInterface) => {
		__instance__ = new trigger(env);
	},
	editFile: (id: number) => __instance__.editFile(id),
	get: (id: number | undefined = undefined) => __instance__.getTriggers(id),
	create: (data: createTrigger) => __instance__.create(data),
	delete: (id: number) => __instance__.delete(id),
	edit: (data: triggerInterface) => __instance__.editTrigger(data)
});
