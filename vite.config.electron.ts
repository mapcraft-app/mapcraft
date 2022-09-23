import { defineConfig } from 'vite';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version, repository } from './package.json';

export default defineConfig({
	publicDir: false,
	plugins: [
		nodePolyfills(),
		tsconfigPaths({
			loose: true
		}),
	],
	build: {
		cssCodeSplit: false,
		emptyOutDir: false,
		minify: false,
		rollupOptions: {
			input: [
				'src/electron/main/main.ts',
				'src/electron/preload/preload.ts'
			],
			output: {
				format: 'commonjs'
			}
		},
		sourcemap: false,
		ssr: true
	},
	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(version),
		'import.meta.env.APP_GIT_URL': JSON.stringify(repository.url),
    'import.meta.env.ELECTRON_APP_URL': JSON.stringify('index.html'),
		'import.meta.env.ELECTRON_LOAD_URL': JSON.stringify('load.html')
  }
});
