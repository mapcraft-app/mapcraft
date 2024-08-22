/**
 * tags: Cutscene, Cutscene_{id}
 * debug: Debug, DebugCutscene
 */
import { existsSync, writeFileSync } from 'fs';
import { writeFile, mkdir, access } from 'fs/promises';
import { resolve } from 'path';
import ipc from '@/electron/ipc/render';
import { minecraft } from 'mapcraft-api/frontend';
import type { sql } from 'mapcraft-api/backend';
import type { tableInterface } from 'mapcraft-api';

import { mapEngineInstance } from '@/electron/preload/engine';
import { exposeInMainWorld } from '@/api/plugins/backend';

import createCutscene from './functions/createCutscene';
import deleteCutscene from './functions/deleteCutscene';
import generateCutscene from './functions/generateCutscene';
import saveCutscene from './functions/saveCutscene';

import { envInterface } from '../interface';
import { cutsceneInterface, cutscenePointInterface } from './interface';

class cutscene {
	private env: envInterface;
	private name: string;
	private functionOrFunctions: 'function' | 'functions';
	private tables: tableInterface[];
	public db: sql;
	public _path: {
		dir: string;
		main: string;
	};

	constructor() {
		this.env = {} as envInterface;
		this.name = '';
		this.functionOrFunctions = 'functions';
		this.tables = [
			{
				name: 'cutscene',
				sql: 'CREATE TABLE IF NOT EXISTS "cutscene" (\
					"id" INTEGER,\
					"name" TEXT,\
					"tag" TEXT,\
					"duration" INTEGER,\
					"description" TEXT,\
					"position" INTEGER,\
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
		this.db = {} as sql;
		this._path = {} as {dir: string, main: string};
	}

	async init(env: envInterface, name: string): Promise<void> {
		this.env = env;
		this.name = name;
		this.db = mapEngineInstance.database;
		
		if (minecraft.semverCompare(
			(await this.db.get('SELECT minecraftVersion FROM info'))
			?.minecraftVersion, '1.21') >= 0
		)
			this.functionOrFunctions = 'function';

		this._path = {
			dir: resolve(env.datapack.base, this.functionOrFunctions, 'cutscene'),
			main: resolve(env.datapack.base, this.functionOrFunctions, 'cutscene', 'start.mcfunction')
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

	async getCutscene(id: number | undefined = undefined): Promise<cutsceneInterface | cutsceneInterface[]> {
		if (id === undefined)
			return this.db.all('SELECT * FROM cutscene');
		return this.db.get('SELECT * FROM cutscene WHERE id = ?', id);
	}

	async getPoints(id: number): Promise<cutscenePointInterface[]> {
		return this.db.all('SELECT * FROM cutscenePoint WHERE cutsceneId = ?', id);
	}

	async createCutscene(name: string): Promise<cutsceneInterface> {
		return createCutscene(name, this.db, this._path);
	}

	async deleteCutscene(id: number): Promise<void> {
		return deleteCutscene(id, this.db, this._path);
	}

	async saveCutscene(cutscene: cutsceneInterface, points: cutscenePointInterface[]): Promise<void> {
		return saveCutscene(this.db, cutscene, points);
	}

	async generateCutscene(id: number): Promise<void[]> {
		return generateCutscene(id, this.db, this._path);
	}
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
	save: (cutscene: cutsceneInterface, points: cutscenePointInterface[]) => __instance__.saveCutscene(cutscene, points),
	generate: (id: number) => __instance__.generateCutscene(id),
});
