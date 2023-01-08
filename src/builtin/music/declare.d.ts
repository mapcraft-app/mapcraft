import { envInterface, sound, sounds } from "./interface";

export declare global {
	interface Window {
		music: {
			init: (env: envInterface) => void,
			get: () => Record<string, sound>,
			save: (data?: Record<string, sound>) => Promise<void>,
			music: {
				add: (sound: sound) => Promise<sound>;
				remove: (name: string) => Promise<void>;
			},
			sound: {
				add: (name: string, sound: sounds) => Promise<void>,
				get: (name: string) => string,
				upload: (d: { name: string, key: number, file: File }) => Promise<string | undefined>,
				remove: (name: string, soundName: string) => Promise<void>
			}
		}
	}
}
