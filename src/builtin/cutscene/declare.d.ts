import { Statement, RunResult } from 'better-sqlite3';
import { tableInterface } from 'mapcraft-api/dist/types/src/sql';
import { cutsceneInterface, cutscenePointInterface } from './backend';
import { envInterface } from '../interface';

export declare global {
	interface Window {
		cutscene: {
			init: (env: envInterface, name: string) => Promise<void>,
			openFile: (id: number, start: boolean = true) => void,
			getCutscene: (id: number | undefined = undefined) => Promise<cutsceneInterface | cutsceneInterface[]>,
			getPoints: (id: number) => Promise<cutscenePointInterface[]>,
			create: (name: string) => Promise<cutsceneInterface>,
			delete: (id: number) => Promise<void[]>,
			save: (cutscene: cutsceneInterface, points: cutscenePointInterface[]) => Promise<void>,
			generate: (id: number) => Promise<void[]>
		}
	}
}
