import { buildMap, engine, sql } from 'mapcraft-api/backend';
import { log } from 'api/log';

import type datapack from 'mapcraft-api/dist/types/src/backend/engine/datapack';
import type resource from 'mapcraft-api/dist/types/src/backend/engine/resourcepack';
import database, { tableInterface} from 'mapcraft-api/dist/types/src/backend/sql';
import type { envInterface } from 'mapcraft-api/dist/types/src/backend/engine/interface';

export interface mapEngineInstanceInterface {
	build: buildMap,
	datapack: datapack,
	resourcepack: resource
}

export class mapEngine {
	public instance: mapEngineInstanceInterface;
	public database: database;
	
	constructor(env: envInterface, name: string, version: '1.17' | '1.18' | '1.19' | undefined = undefined) {
		this.instance = {} as mapEngineInstanceInterface;
		this.instance.datapack = new engine.data(env, name, version);
		this.instance.resourcepack = new engine.resource(env, name, version);
		this.instance.build = new buildMap(this.instance.datapack, this.instance.resourcepack);
		this.database = new sql(env, name, log.psql);
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
}

export let mapEngineInstance: mapEngine;
export default {
	init: (env: envInterface, name: string, version: '1.17' | '1.18' | '1.19' | undefined = undefined): mapEngine => {
		mapEngineInstance = new mapEngine(env, name, version);
		return mapEngineInstance;
	},
	database: (): database => mapEngineInstance.database,
	instance: (): mapEngine => mapEngineInstance,
	build: (): Promise<string> => mapEngineInstance.build(),
	clean: (): Promise<void[][]> => mapEngineInstance.clean(),
	install: (): Promise<void> => mapEngineInstance.install(),
	update: (): Promise<void[]> => mapEngineInstance.update(),
	sql: {
		add: (tables: tableInterface | tableInterface[]): void => mapEngineInstance.database.addTable(tables),
		exist: (names: string | string[]): number | number[] => mapEngineInstance.database.isExistTable(names),
		remove: (names: string | string[]): void => mapEngineInstance.database.removeTable(names),
		update: (tables: tableInterface | tableInterface[]): void => mapEngineInstance.database.updateTable(tables),
	}
};
