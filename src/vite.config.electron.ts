import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version, repository } from '../package.json';

export default defineConfig((env) => ({
	clearScreen: false,
	plugins: [
		tsconfigPaths({
			root: resolve(__dirname, '..'),
			loose: true
		}),
	],
	build: {
		outDir: resolve(__dirname, '..', 'dist'),
		cssCodeSplit: false,
		emptyOutDir: false,
		minify: (env.mode === 'production'),
		target: ['esnext', 'node16'],
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			input: {	
				'main': 'src/electron/main/index.ts',
				'preload': 'src/electron/preload/index.ts'
			},
			output: {
				entryFileNames: '[name].mjs',
				format: 'es'
			}
		},
		sourcemap: false,
		ssr: true,
	},
	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(version),
		'import.meta.env.APP_GIT_URL': JSON.stringify(repository.url),
    'import.meta.env.ELECTRON_APP_URL': JSON.stringify('index.html'),
		'import.meta.env.ELECTRON_LOAD_URL': JSON.stringify('load.html')
  }
}));
