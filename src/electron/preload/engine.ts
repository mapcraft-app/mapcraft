import { buildMap, engine, sql } from 'mapcraft-api/backend';
import { log } from 'api/log';

import type datapack from 'mapcraft-api/dist/types/src/backend/engine/datapack';
import type resource from 'mapcraft-api/dist/types/src/backend/engine/resourcepack';
import database, { tableInterface} from 'mapcraft-api/dist/types/src/backend/sql';
import type { envInterface } from 'mapcraft-api/dist/types/src/backend/engine/interface';
import { RunResult } from 'better-sqlite3';
import { minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';

export interface mapEngineInstanceInterface {
	build: buildMap,
	datapack: datapack,
	resourcepack: resource
}

export interface mapEngineInfoTable {
	name: string;
	minecraftVersion: string;
}

export class mapEngine {
	private __env: envInterface;
	private __name: string;
	private __version: minecraftVersion;

	public instance: mapEngineInstanceInterface;
	public database: database;

	public eventStatus: string;
	
	constructor(env: envInterface, name: string) {
		this.__env = env;
		this.__name = name;
		this.__version = '1.17';
		this.instance = {} as mapEngineInstanceInterface;
		this.database = new sql(env, name, log.psql, {
			name: 'info',
			sql: 'CREATE TABLE IF NOT EXISTS "info" (\
				"name"              TEXT NOT NULL UNIQUE,\
				"minecraftVersion"  TEXT NOT NULL\
			)'
		});
		this.eventStatus = '';
	}

	public init(version: minecraftVersion): void {
		this.__version = version;
		this.instance = {} as mapEngineInstanceInterface;
		this.instance.datapack = new engine.data(this.__env, this.__name, version);
		this.instance.resourcepack = new engine.resource(this.__env, this.__name, version);
		this.instance.build = new buildMap(this.instance.datapack, this.instance.resourcepack);
		this.instance.build.on('change', (e) => this.eventStatus = e as string);
	}

	public async build(): Promise<string> {
		return this.instance.build.start();
	}

	public async clean(): Promise<void[][]> {
		return Promise.all([
			this.instance.datapack.clean(),
			this.instance.resourcepack.clean()
		]);
	}

	public async install(): Promise<void> {
		if (!this.instance.datapack.check())
			await this.instance.datapack.install();
		if (!this.instance.resourcepack.check())
			await this.instance.resourcepack.install();
	}

	public async update(): Promise<void[]> {
		return Promise.all([
			this.instance.datapack.update(),
			this.instance.resourcepack.update()
		]);
	}

	public async getInfo(): Promise<mapEngineInfoTable> {
		return new Promise((res, rej) => {
			this.database.get('SELECT * FROM info')
				.then((data: mapEngineInfoTable | undefined) => {
					if (data === undefined || !data.name || !data.minecraftVersion)
						return rej(data);
					res(data);
				});
		});
	}

	public async updateInfo(name: string, version: string): Promise<any> {
		return this.database.get('SELECT * FROM info')
			.then((d: mapEngineInfoTable | undefined) => {
				if (d === undefined)
					this.database.update('INSERT INTO info ("name", "minecraftVersion") VALUES (?, ?)', name, version);
				else
					this.database.update('UPDATE info SET "name" = ?, "minecraftVersion" = ?', name, version);
			});
	}
}

export let mapEngineInstance: mapEngine;
export default {
	newInstance: (env: envInterface, name: string): mapEngine => {
		mapEngineInstance = new mapEngine(env, name);
		return mapEngineInstance;
	},
	init: (version: minecraftVersion): void => {
		mapEngineInstance.init(version);
	},
	database: (): database => mapEngineInstance.database,
	instance: (): mapEngine => mapEngineInstance,
	build: (): Promise<string> => mapEngineInstance.build(),
	buildStatus: (): string => mapEngineInstance.eventStatus,
	clean: (): Promise<void[][]> => mapEngineInstance.clean(),
	install: (): Promise<void> => mapEngineInstance.install(),
	update: (): Promise<void[]> => mapEngineInstance.update(),
	getInfo: (): Promise<mapEngineInfoTable> => mapEngineInstance.getInfo(),
	updateInfo: (name: string, version: string): Promise<void> => mapEngineInstance.updateInfo(name, version),
	sql: {
		table: {
			add: (tables: tableInterface | tableInterface[]): void => mapEngineInstance.database.addTable(tables),
			exist: (names: string | string[]): number | number[] => mapEngineInstance.database.isExistTable(names),
			update: (tables: tableInterface | tableInterface[]): void => mapEngineInstance.database.updateTable(tables),
			remove: (names: string | string[]): void => mapEngineInstance.database.removeTable(names)
		},
		check: (): Promise<void> => mapEngineInstance.database.check(),
		get: (req: string, ...args: any[]): Promise<any> => mapEngineInstance.database.get(req, ...args),
		all: (req: string, ...args: any[]): Promise<any[]> => mapEngineInstance.database.all(req, ...args),
		update: (req: string, ...args: any[]): Promise<RunResult> => mapEngineInstance.database.get(req, ...args),
	}
};
