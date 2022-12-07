import { Statement, RunResult } from 'better-sqlite3';
import { tableInterface } from 'mapcraft-api/dist/types/src/sql';
import { envInterface, cutsceneInterface, cutscenePointInterface } from './backend';

export declare global {
	interface Window {
		cutscene: {
			init: (env: envInterface, name: string) => Promise<void>,
			getCutscene: (id: number | undefined = undefined) => Promise<cutsceneInterface | cutsceneInterface[]>,
			getPoints: (id: number) => Promise<cutscenePointInterface[]>,
			create: (name: string) => Promise<cutsceneInterface>,
			delete: (id: number) => Promise<void[]>,
			generate: (id: number) => Promise<void[]>
		}
	}
}
