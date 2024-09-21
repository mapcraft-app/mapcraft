import { sound, sounds } from './interface';
import { envInterface } from '../interface';

export declare global {
	interface Window {
		music: {
			init: (env: envInterface) => void,
			get: () => Record<string, sound>,
			save: (data?: Record<string, sound>) => Promise<void>,
			analyze: (src: string) => Promise<number>,
			datapack: {
				create: (d: {
						id: number;
						name: string;
						category: category;
						duration: number;
				}) => Promise<void>;
				delete: (id: number) => Promise<void>;
			},
			music: {
				add: (sound: sound) => Promise<sound>;
				changeName: (newName: string, oldName: string) => Promise<sound>;
				remove: (name: string) => Promise<void>;
			},
			sound: {
				add: (name: string, sound: sounds) => Promise<void>,
				get: (name: string) => string,
				upload: (d: { name: string, index: number, file: File }) => Promise<string | undefined>,
				remove: (name: string, soundName: string) => Promise<void>
			}
		}
	}
}
