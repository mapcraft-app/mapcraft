/* eslint-disable no-unused-vars */
import type { App } from 'vue';

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
  }
}

export default {
	install: (app: App<Element>): void => {
		const path = (url: string): string => {
			if (import.meta.env.DEV)
				return `app:///${url}`;
			return url;
		};
		app.config.globalProperties.$path = path;
		app.provide('$path', path);

		const imgErr = (e: Event): void => {
			const target = e.target as HTMLImageElement;
			if (target)
				target.src = 'imgs/minecraft/player.png';
		};
		app.config.globalProperties.$imgErr = imgErr;
		app.provide('$imgErr', imgErr);

		const api = (import.meta.env.DEV)
			? 'http://localhost:3000'
			: 'https://api.mapcraft.app';
		app.config.globalProperties.$api = api;
		app.provide('$api', api);
	}
};
