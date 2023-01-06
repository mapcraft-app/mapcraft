import { envInterface, sound, sounds } from "./interface";

export declare global {
	interface Window {
		music: {
			init: (env: envInterface) => void,
			get: () => Record<string, sound>,
			music: {
				add: (sound: sound) => Promise<sound>;
				remove: (name: string) => Promise<void>;
			},
			sound: {
				add: (name: string, sound: sounds) => Promise<void>;
				remove: (name: string, soundName: string) => Promise<boolean>;
			}
		}
	}
}
