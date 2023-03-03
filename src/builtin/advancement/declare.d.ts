import { minecraftVersion } from 'mapcraft-api/dist/types/src/minecraft/interface';
import { envInterface } from '../interface';
import { main } from './model';

export declare global {
	interface Window {
		advancement: {
			init: (env: envInterface, minecraftVersion: minecraftVersion) => void,
			getList: () => main[],
			getTexture: (id: string) => { id: string; path: string }
		}
	}
}
