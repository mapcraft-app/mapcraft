/* eslint-disable no-unused-vars */
import type { App } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
		/**
		 * In developpement mode, electron not have access to local system file. Use this
		 * function to bypass this
		 */
    $path: (url: string) => string;
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
	}
};
