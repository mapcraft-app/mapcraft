import {
	furnaceGen,
	smithing,
	smithingGen,
	stonecutter,
	stonecutterGen,
	tableGen
} from './interface';

export declare global {
	interface Window {
		recipe: {
			init: (env: envInterface, version: minecraftVersion) => void,
			paths: () => { base: string; block: string; item: string },
			textures: (type: texturesType) => Promise<{ id: string; name: string; path: string | undefined }[]>,
			generate: {
				furnace: (data: furnaceGen) => Promise<furnaceGen>,
				table: (data: tableGen) => Promise<tableGen>,
				stonecutter: (data: stonecutterGen) => Promise<stonecutter>,
				smithing: (data: smithingGen) => Promise<smithing>
			}
		}
	}
}
