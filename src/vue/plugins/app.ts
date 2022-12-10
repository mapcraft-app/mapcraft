/* eslint-disable no-unused-vars */
import type { App } from 'vue';
import { globalStore } from 'store/global';

export const path = (url: string): string => {
	if (import.meta.env.DEV)
		return `app:///${url}`;
	return url;
};

export const imgErr = (e: Event): void => {
	const target = e.target as HTMLImageElement;
	if (target)
		target.src = 'imgs/minecraft/player.png';
};

export const api = (): string => (import.meta.env.DEV)
	? 'http://localhost:3000'
	: 'https://api.mapcraft.app';

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export interface fetchInterface {
	get: (url: string) => Promise<globalThis.Response>,
	post: (url: string, data: Record<string, any>) => Promise<globalThis.Response>,
	put: (url: string, data: Record<string, any>) => Promise<globalThis.Response>,
	delete: (url: string, data: Record<string, any>) => Promise<globalThis.Response>,
}
export class $fetch {
	static get(url: string): Promise<globalThis.Response> {
		return fetch(`${api}/${url}`, {
			method: 'GET'
		});
	}
	
	static post(url: string, data: Record<string, any>): Promise<globalThis.Response> {
		return fetch(`${api}/${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				lang: globalStore().lang,
				...data
			})
		});
	}
	
	static put(url: string, data: Record<string, any>): Promise<globalThis.Response> {
		return fetch(`${api}/${url}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				lang: globalStore().lang,
				...data
			})
		});
	}
	
	static delete(url: string, data: Record<string, any>): Promise<globalThis.Response> {
		return fetch(`${api}/${url}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
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
		 * In developpement mode, electron not have access to local system file. Use this
		 * function to bypass this
		 */
    $path: (url: string) => string;

		/**
		 * Set default image if error occur
		 */
		$imgErr: (e: Event) => void;

		/**
		 * Get mapcraft api url
		 */
		$api: () => string;

		/**
		 * Capitalize string
		 */
		$capitalize: (str: string) => string;

		/**
		 * Preconfigured fetch api
		 */
		$fetch: fetchInterface;
  }
}

export default {
	install: (app: App<Element>): void => {
		app.config.globalProperties.$path = path;
		app.provide('$path', path);

		app.config.globalProperties.$imgErr = imgErr;
		app.provide('$imgErr', imgErr);

		app.config.globalProperties.$api = api;
		app.provide('$api', api);

		app.config.globalProperties.$capitalize = capitalize;
		app.provide('$capitalize', capitalize);

		app.config.globalProperties.$fetch = $fetch;
		app.provide('$fetch', $fetch);
	}
};
