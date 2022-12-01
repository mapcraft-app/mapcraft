import { buildMap, engine } from 'mapcraft-api/backend';
import type datapack from 'mapcraft-api/dist/types/src/engine/datapack';
import type resource from 'mapcraft-api/dist/types/src/engine/resourcepack';
import type { envInterface } from 'mapcraft-api/dist/types/src/engine/interface';

export interface mapEngineInstance {
	build: buildMap,
	datapack: datapack,
	resourcepack: resource
}

export class mapEngine {
	public instance: mapEngineInstance;
	
	constructor(env: envInterface, name: string, version: '1.17' | '1.18' | '1.19' | undefined = undefined) {
		this.instance = {} as mapEngineInstance;
		this.instance.datapack = new engine.data(env, name, version);
		this.instance.resourcepack = new engine.resource(env, name, version);
		this.instance.build = new buildMap(this.instance.datapack, this.instance.resourcepack);
	}

	async build(): Promise<string> {
		return await this.instance.build.start();
	}

	async clean(): Promise<void[][]> {
		return Promise.all([
			this.instance.datapack.clean(),
			this.instance.resourcepack.clean()
		]);
	}

	async install(): Promise<void> {
		if (!this.instance.datapack.check())
			await this.instance.datapack.install();
		if (!this.instance.resourcepack.check())
			await this.instance.resourcepack.install();
	}

	async update(): Promise<void[]> {
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
	instance: (): mapEngine => __instance__mapengine__
};
