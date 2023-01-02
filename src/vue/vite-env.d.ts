declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	// eslint-disable-next-line @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare const APP_VERSION: string
declare const APP_GIT_URL: string
declare const ELECTRON_APP_URL: string
declare const ELECTRON_LOAD_URL: string
