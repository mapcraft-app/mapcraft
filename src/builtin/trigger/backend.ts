import { exposeInMainWorld } from 'api/plugins/backend';
import ipc from 'app/src/electron/ipc/render';
import { mapEngineInstance } from 'app/src/electron/preload/engine';
import { existsSync, writeFileSync } from 'fs';
import { access, mkdir, rm } from 'fs/promises';
// import { fs } from 'mapcraft-api/backend';
import database, { tableInterface } from 'mapcraft-api/dist/types/src/backend/sql';
import { resolve } from 'path';
import { createTrigger, envInterface, triggerInterface } from './interface';

class trigger {
	private env: envInterface;
	private table: tableInterface;
	private db: database;
	public datapackDir: string;

	constructor(env: envInterface) {
		this.env = env;
		this.table = {
			name: 'trigger',
			sql: 'CREATE TABLE IF NOT EXISTS "trigger" (\
				"id" INTEGER,\
				"name" TEXT,\
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
		this.datapackDir = resolve(env.datapack.base, 'functions', 'trigger');
		this.db.addTable(this.table);
		access(this.datapackDir)
			.catch(async () => await mkdir(this.datapackDir, { recursive: true }));
	}

	editFile(id: number): void {
		const link = resolve(this.datapackDir, `${id.toString()}.mcfunction`);

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
		await this.db.update('INSERT INTO trigger (name, x1, y1, z1, x2, y2, z2) VALUES (?, ?, ?, ?, ?, ?, ?)', data.name, data.x1, data.y1, data.z1, data.x2, data.y2, data.z2);
		const ret: triggerInterface = await this.db.get('SELECT id FROM trigger WHERE name = ?', data.name);
		return {
			id: ret.id,
			name: data.name,
			x1: data.x1, y1: data.y1, z1: data.z1,
			x2: data.x2, y2: data.y2, z2: data.z2
		};
	}

	async delete(id: number): Promise<void> {
		const link = resolve(this.datapackDir, `${id.toString()}.mcfunction`);

		try {
			if (existsSync(link))
				rm(link, { recursive: true });
		} catch (___) {
			///
		}
		await this.db.update('DELETE FROM trigger WHERE id = ?', id);
	}

	async editTrigger(data: triggerInterface): Promise<void> {
		await this.db.update('UPDATE trigger SET name = ?, x1 = ?, y1 = ?, z1 = ?, x2 = ?, y2 = ?, z2 = ? WHERE id = ?', data.name, data.x1, data.y1, data.z1, data.x2, data.y2, data.z2, data.id);
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
