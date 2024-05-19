import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import tsConfigPaths from 'vite-tsconfig-paths';
import electronPlugin from './vite.electron';
import { version, repository } from '../package.json';

const genDefine = (isProduction: boolean): any => {
	let ret: Record<string, unknown> = {};

	ret['__VUE_I18N_FULL_INSTALL__'] = false;
	ret['__VUE_I18N_LEGACY_API__'] = false;
	if (isProduction) {
		ret['import.meta.env.APP_VERSION'] = JSON.stringify(version);
		ret['import.meta.env.APP_GIT_URL'] = JSON.stringify(repository.url);
		ret['import.meta.env.ELECTRON_APP_URL'] = JSON.stringify('index.html');
		ret['import.meta.env.ELECTRON_LOAD_URL'] = JSON.stringify(`load.html`);
	}
	return ret;
};

const genInput = (isProduction: boolean): any => {
	let ret: Record<string, unknown> = {};

	ret['main'] = resolve(__dirname, 'electron', 'main', 'index.ts');
	ret['preload'] = resolve(__dirname, 'electron', 'preload', 'index.ts');
	if (isProduction) {
		ret['load.html'] = resolve(__dirname, 'load.html');
		ret['index.html'] = resolve(__dirname, 'index.html');
	}
	return ret;
};

export default defineConfig((env) => ({
	// base: (env.mode === 'production') ? './' : '/',
	base: './',
	clearScreen: false,
	publicDir: './public',
	logLevel: 'info',
	define: genDefine(env.mode === 'production'),
	build: {
		emptyOutDir: true,
		outDir: resolve(__dirname, '..', 'dist'),
		target: ['es2021', 'chrome100'],
		// minify: (env.mode === 'production'),
		minify: false,
		sourcemap: false,
		rollupOptions: {
			input: genInput(env.mode === 'production'),
			output: {
				chunkFileNames: '[name]-[hash].mjs',
				entryFileNames: '[name].mjs',
				format: 'es'
			}
		},
		ssr: true,
		watch: (env.mode !== 'production')
			? {}
			: undefined
	},
	appType: 'custom',
  plugins: [
		tsConfigPaths({
			root: resolve(__dirname, '..'),
			loose: true
		}),
		vue({
			template: {
				transformAssetUrls
			}
		}),
		quasar({
			sassVariables: resolve(__dirname, 'app', 'sass', 'theme.sass')
		}),
		(env.mode !== 'production')
			? electronPlugin({
					dev: (env.mode !== 'production')
				})
			: undefined
	]
}));
