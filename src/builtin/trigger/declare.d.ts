import { createTrigger, triggerInterface } from './interface';
import { envInterface } from '../interface';

export declare global {
	interface Window {
		trigger: {
			init: (env: envInterface) => void,
			editFile: (id: number) => void,
			get: (id?: number | undefined) => Promise<triggerInterface | triggerInterface[]>,
			create: (data: createTrigger) => Promise<triggerInterface>,
			delete: (id: number) => Promise<void>,
			edit: (data: triggerInterface) => Promise<void>
		}
	}
}
