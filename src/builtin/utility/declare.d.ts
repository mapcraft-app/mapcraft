import { envInterface } from '../interface';

export declare global {
	interface Window {
		utility: {
			init: (env: envInterface, version: minecraftVersion) => void,
			entities: () => Promise<list[]>,
			textures: (type: 'blocks' | 'items') => Promise<{ id: string; name: string; path: string | undefined }[]>
		}
	}
}
