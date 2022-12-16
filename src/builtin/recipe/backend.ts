/*
import ipc from 'electron/ipc/render';
import { fs } from 'mapcraft-api/backend';
import database, { tableInterface } from 'mapcraft-api/dist/types/src/backend/sql';
import { mapEngineInstance } from 'electron/preload/engine';
import { exposeInMainWorld } from 'api/plugins/backend';
*/
import { access, mkdir } from 'fs/promises';
import { resolve } from 'path';

export interface envInterface {
	datapack: {
		base: string;
		default: string;
	},
	resourcepack: string;
}

class recipe {
	private regex: {
		output: RegExp,
		isShapeless: RegExp,
		isExactPosition: RegExp
	};
	private recipeDir: string;

	constructor(env: envInterface) {
		this.regex = {
			output: new RegExp('(?:formOutput$)', 'gm'),
			isShapeless: new RegExp('(?:shapeless$)', 'gm'),
			isExactPosition: new RegExp('(?:exactPosition$)', 'gm')
		};
		this.recipeDir = resolve(env.datapack.base, 'recipes');
		access(this.recipeDir)
			.catch(async () => await mkdir(this.recipeDir, { recursive: true }));
	}
}
