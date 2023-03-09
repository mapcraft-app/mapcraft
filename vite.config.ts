import { resolve } from 'path';
import { spawn, type ChildProcess } from 'child_process';
import { exit } from 'process';
import { AddressInfo } from 'net';

import { defineConfig, build, type ViteDevServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import tsconfigPaths from 'vite-tsconfig-paths';
import { version, repository } from './package.json';

const bundle = async (server: ViteDevServer) => {
	const address = server.httpServer.address() as AddressInfo;
	const host = () => {
		if (address.family === 'IPv6')
			return `[${address.address}]`;
		if (address.address === '127.0.0.1')
			return 'localhost';
		return address.address;
	};
	const appUrl = `http://${host()}:${address.port}`;

	let child: ChildProcess | undefined;
	const watcher: any = await build({
		configFile: 'vite.config.electron.ts',
		mode: server.config.mode,
		define: {
			'import.meta.env.APP_VERSION': JSON.stringify(version),
			'import.meta.env.APP_GIT_URL': JSON.stringify(repository.url),
			'import.meta.env.ELECTRON_APP_URL': JSON.stringify(appUrl),
			'import.meta.env.ELECTRON_LOAD_URL': JSON.stringify(`${appUrl}/load.html`),
		},
		build: {
			watch: {}
		}
	});
	const electron = require('electron') as string;
	const electronMain = resolve(server.config.root, server.config.build.outDir, 'main.js');
	const exitProcess = () => exit(0);
	const start = () => {
		if (child)
			child.kill();
		child = spawn(electron, [ electronMain ], {
			stdio: 'inherit',
			windowsHide: false
		});
		child.on('close', exitProcess);
	};
	const startElectron = ({ code }: any) => {
		if (code === 'END') {
			watcher.off('event', startElectron);
			start();
		}
	};

	watcher.on('event', startElectron);
	watcher.on('change', () => {
		child.off('close', exitProcess);
		start();
	});
};

export default defineConfig((env) => ({
	base: (env.mode === 'production') ? './' : '/',
	clearScreen: false,
	publicDir: './src/public',
	logLevel: 'error',
	define: {
		__VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
	},
	build: {
		emptyOutDir: true,
		target: ['esnext', 'chrome100'],
		minify: (env.mode === 'production'),
		rollupOptions: {
			input: {
				'load.html'		: resolve(__dirname, 'load.html'),
				'index.html'	: resolve(__dirname, 'index.html')
			}
		},
		sourcemap: false
	},
	plugins: [
		nodePolyfills(),
		tsconfigPaths({
			loose: true
		}),
		vue({
			template: { transformAssetUrls }
		}),
		quasar({
			sassVariables: 'src/quasar-variables.sass'
		}),
		{
			name: 'electron',
			configureServer(server) {
				server.httpServer.on('listening', () => {
					bundle(server).catch(server.config.logger.error);
				});
			}
		}
	]
}));
