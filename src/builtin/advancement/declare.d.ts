import type { minecraftVersion } from 'mapcraft-api';
import { envInterface } from '../interface';
import { main } from './model';

export declare global {
	interface Window {
		advancement: {
			init: (env: envInterface, minecraftVersion: minecraftVersion) => void,
			readDir: () => void,
			getTexture: (id: string) => { id: string; path: string },
			
			gets: () => { path: string; data: main }[],
			get: (path: string) => { path: string; data: main } | undefined,
			create: () => Promise<{ path: string; data: main }>,
			save: (data: string) => Promise<void>,
			delete: (data: string) => Promise<void>,
			generate: (path: string) => Promise<void>
		}
	}
}
