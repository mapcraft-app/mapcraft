import { envInterface } from '../interface';
import { main } from './model';

export declare global {
	interface Window {
		advancement: {
			init: (env: envInterface) => void,
			getList: () => main[]
		}
	}
}
