import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import tsConfigPaths from 'vite-tsconfig-paths';
import electronPlugin from './vite.electron';

export default defineConfig((env) => ({
	base: (env.mode === 'production') ? './' : '/',
	clearScreen: false,
	publicDir: './public',
	logLevel: 'info',
	define: {
		__VUE_I18N_FULL_INSTALL__: true,
		__VUE_I18N_LEGACY_API__: false,
	},
	build: {
		emptyOutDir: true,
		target: ['es2021', 'chrome100'],
		minify: (env.mode === 'production'),
		sourcemap: false,
		rollupOptions: {
			input: {
				'main': resolve(__dirname, 'electron', 'main', 'index.ts'),
				'preload': resolve(__dirname, 'electron', 'preload', 'index.ts')
			},
			output: {
				chunkFileNames: '[name]-[hash].mjs',
				entryFileNames: '[name].mjs',
				format: 'es'
			}
		},
		ssr: true,
		watch: {}
	},
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
		electronPlugin({
			dev: (env.mode === 'production')
		})
	]
}));
