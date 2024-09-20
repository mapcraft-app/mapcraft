import { ipcFunctions } from '@/main/src/electron/ipc/type';
import { parseFile } from 'node_modules/music-metadata/lib/index';
import type Electron from 'electron';

export default [
	async (_event: Electron.IpcMainEvent, pathToFile: string): Promise<number> => Math.floor((await parseFile(pathToFile.replace('app:///', ''))).format.duration ?? 1),
] as ipcFunctions;
