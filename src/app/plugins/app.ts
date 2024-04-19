/* eslint-disable no-unused-vars */
import type { App } from 'vue';
import { globalStore } from '@/store/global';
import { builder } from '@/main/package.json';

/**
 * Get mapcraft api url
 */
export const api = (path?: string): string => {
	if (path) {
		return (import.meta.env.DEV)
			? `http://localhost:3000/${path}`
			: `https://api.mapcraft.app/${path}`;
	}
	return (import.meta.env.DEV)
		? 'http://localhost:3000'
		: 'https://api.mapcraft.app';
};

/**
 * Capitalize string
*/
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Set default image if error occur
 */
export const imgErr = (e: Event): void => {
	const target = e.target as HTMLImageElement;
	if (target) {
		target.classList.add('img-error');
		target.src = toPublic('imgs/minecraft/no_data.png');
	}
};

/**
 * In developpement mode, electron not have access to local system file. Use this
 * function to bypass this
 */
export const path = (url: string): string => {
	if (import.meta.env.DEV)
		return `app:///${url}`;
	return url;
};

/**
 * Handle public resource in production && developpement mode
 */
export const toPublic = (url: string): string => {
	if (import.meta.env.DEV)
		return url;
	let x = 0;
	while (x < url.length && (url[x] === '/' || url[x] === '\\'))
		++x;
	return `./resources/${
		(builder.asar)
			? 'app.asar'
			: 'app'
	}/${url.substring(x)}`;
};

export interface fetchInterface {
	get: (url: string) => Promise<globalThis.Response>,
	post: (url: string, data: Record<string, any>) => Promise<globalThis.Response>,
	put: (url: string, data: Record<string, any>) => Promise<globalThis.Response>,
	delete: (url: string, data: Record<string, any>) => Promise<globalThis.Response>,
}
/**
 * Preconfigured fetch api
*/
export class $fetch {
	static get(url: string): Promise<globalThis.Response> {
		return fetch(api(url), {
			method: 'GET'
		});
	}
	
	static post(url: string, data: Record<string, any>, contentType?: string): Promise<globalThis.Response> {
		return fetch(api(url), {
			method: 'POST',
			headers: {
				'Content-Type': contentType ?? 'application/json'
			},
			body: JSON.stringify({
				lang: globalStore().lang,
				...data
			})
		});
	}
	
	static put(url: string, data: Record<string, any>, contentType?: string): Promise<globalThis.Response> {
		return fetch(api(url), {
			method: 'PUT',
			headers: {
				'Content-Type': contentType ?? 'application/json'
			},
			body: JSON.stringify({
				lang: globalStore().lang,
				...data
			})
		});
	}
	
	static delete(url: string, data: Record<string, any>, contentType?: string): Promise<globalThis.Response> {
		return fetch(api(url), {
			method: 'DELETE',
			headers: {
				'Content-Type': contentType ?? 'application/json'
			},
			body: JSON.stringify({
				lang: globalStore().lang,
				...data
			})
		});
	}
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
		/**
		 * Get mapcraft api url
		 */
		$api: () => string;

		/**
		 * Capitalize string
		 */
		$capitalize: (str: string) => string;

		/**
		 * Set default image if error occur
		 */
		$imgErr: (e: Event) => void;

		/**
		 * In developpement mode, electron not have access to local system file. Use this
		 * function to bypass this
		 */
    $path: (url: string) => string;

		/**
		 * Handle public image in production & developpement mode
		 */
		$toPublic: (url: string) => string;

		/**
		 * Preconfigured fetch api
		 */
		$fetch: fetchInterface;
  }
}

export default {
	install: (app: App<Element>): void => {
		app.config.globalProperties.$api = api;
		app.provide('$api', api);

		app.config.globalProperties.$capitalize = capitalize;
		app.provide('$capitalize', capitalize);

		app.config.globalProperties.$imgErr = imgErr;
		app.provide('$imgErr', imgErr);

		app.config.globalProperties.$path = path;
		app.provide('$path', path);

		app.config.globalProperties.$toPublic = toPublic;
		app.provide('$toPublic', toPublic);
		
		app.config.globalProperties.$fetch = $fetch;
		app.provide('$fetch', $fetch);
	}
};
