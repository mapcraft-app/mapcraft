import {
	furnaceGen,
	furnaceTable,
	listInterface,
	resultTable,
	smithing,
	smithingGen,
	smithingTable,
	stonecutter,
	stonecutterGen,
	stonecutterTable,
	tableGen
} from './interface';

export declare global {
	interface Window {
		recipe: {
			init: (env: envInterface, version: minecraftVersion) => void,
			paths: () => { base: string; block: string; item: string },
			textures: (type: texturesType) => Promise<{ id: string; name: string; path: string | undefined }[]>,
			list: () => Promise<listInterface[]>,
			generate: {
				furnace: (data: furnaceGen) => Promise<furnaceGen>,
				table: (data: tableGen) => Promise<tableGen>,
				stonecutter: (data: stonecutterGen) => Promise<stonecutter>,
				smithing: (data: smithingGen) => Promise<smithing>
			},
			read: {
				type: (data: any) => 'furnace' | 'stonecutter' | 'smithing' | 'table',
				table: (name: string, data: any) => resultTable,
				furnace: (name: string, data: any) => furnaceTable,
				stonecutter: (name: string, data: any) => stonecutterTable,
				smithing: (name: string, data: any) => smithingTable
			},
			file: {
				create: (data: any, name: string) => Promise<void>,
				read: (path: string) => Promise<string>,
				delete: (name: string) => Promise<void>
			}
		}
	}
}
