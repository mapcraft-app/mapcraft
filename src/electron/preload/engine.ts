import { buildMap, engine, sql } from 'mapcraft-api/backend';
import { log } from 'api/log';

import type datapack from 'mapcraft-api/dist/types/src/engine/datapack';
import type resource from 'mapcraft-api/dist/types/src/engine/resourcepack';
import database from 'mapcraft-api/dist/types/src/sql';
import type { envInterface } from 'mapcraft-api/dist/types/src/engine/interface';

export interface mapEngineInstance {
	build: buildMap,
	datapack: datapack,
	resourcepack: resource
}

export class mapEngine {
	public instance: mapEngineInstance;
	public database: database;
	
	constructor(env: envInterface, name: string, version: '1.17' | '1.18' | '1.19' | undefined = undefined) {
		this.instance = {} as mapEngineInstance;
		this.instance.datapack = new engine.data(env, name, version);
		this.instance.resourcepack = new engine.resource(env, name, version);
		this.instance.build = new buildMap(this.instance.datapack, this.instance.resourcepack);
		this.database = new sql(env, name, log.info);
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

let __instance__mapengine__: mapEngine;
export default {
	init: (env: envInterface, name: string, version: '1.17' | '1.18' | '1.19' | undefined = undefined): mapEngine => {
		__instance__mapengine__ = new mapEngine(env, name, version);
		return __instance__mapengine__;
	},
	database: (): database => __instance__mapengine__.database,
	instance: (): mapEngine => __instance__mapengine__,
	build: (): Promise<string> => __instance__mapengine__.build(),
	clean: (): Promise<void[][]> => __instance__mapengine__.clean(),
	install: (): Promise<void> => __instance__mapengine__.install(),
	update: (): Promise<void[]> => __instance__mapengine__.update(),
};
