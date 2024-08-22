import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import tsConfigPaths from 'vite-tsconfig-paths';
import electronServer from './vite/plugin.vite';

export default defineConfig((env) => ({
	base: (env.mode === 'production') ? './' : '/',
	clearScreen: false,
	publicDir: './public',
	logLevel: 'info',
	define: {
		__VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false
	},
	build: {
		outDir: resolve(__dirname, '..', 'dist'),
		emptyOutDir: true,
		target: ['esnext', 'chrome100'],
		minify: (env.mode === 'production'),
		sourcemap: false,
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			input: {
				'load.html': resolve(__dirname, 'load.html'),
				'index.html': resolve(__dirname, 'index.html')
			},
			output: {
				format: 'es'
			}
		},
		watch: (env.mode !== 'production')
			? {}
			: undefined
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
		{
			name: 'electron',
			configureServer(server) {
				server.httpServer?.on('listening', () => {
					electronServer(server).catch(server.config.logger.error);
				});
			}
		}
	]
}));
