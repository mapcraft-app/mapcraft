import { defineConfig, build, type ViteDevServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { spawn, type ChildProcess } from 'child_process';
import { exit } from 'process';
import { AddressInfo } from 'net';

const bundle = async (server: ViteDevServer) => {
	const address = server.httpServer.address() as AddressInfo;
	const host = (address.address === '127.0.0.1')
		? 'localhost'
		: address.address;
	const appUrl = `http://${host}:${address.port}`;

	let child: ChildProcess | undefined;
	const watcher: any = await build({
		configFile: 'vite.config.electron.ts',
		mode: server.config.mode,
		define: {
			'import.meta.env.ELECTRON_APP_URL': JSON.stringify(appUrl)
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
		child = spawn(electron, [ electronMain ], { windowsHide: false });
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
	build: {
		emptyOutDir: true
	},
	plugins: [
		vue(),
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
