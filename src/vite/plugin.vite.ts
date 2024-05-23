import { spawn, type ChildProcess } from 'child_process';
import { AddressInfo } from 'net';
import { resolve } from 'path';
import { build, Rollup, ViteDevServer } from 'vite';
import { version, repository } from '../../package.json';
import { exit } from 'process';

export default async (server: ViteDevServer) => {
	let child: ChildProcess | undefined;

	const address = server.httpServer?.address() as AddressInfo;
	const host = () => {
		if (address.family === 'IPv6')
			return `[${address.address}]`;
		if (address.address === '127.0.0.1')
			return 'localhost';
		return address.address;
	};
	const appUrl = `http://${host()}:${address.port}`;
	const electronMain = resolve(
		server.config.root,
		'..',
		server.config.build.outDir,
		'main.mjs'
	);

	const watcher: Rollup.RollupWatcher = await build({
		configFile: './src/vite.config.electron.ts',
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
	}) as Rollup.RollupWatcher;

	const exitProcess = () => exit(0);
	const start = () => {
		if (child)
			child.kill();
		child = spawn('node', [ './node_modules/electron/cli.js', electronMain ], {
			stdio: 'inherit',
			windowsHide: false
		});
		child.on('close', exitProcess);
	};
	const startElectron = ({ code }: { code: string }) => {
		if (code === 'END') {
			watcher.off('event', startElectron);
			start();
		}
	};

	console.log('\n⚛ Start Electron Server ⚛')
	watcher.on('event', startElectron);
	watcher.on('change', () => {
		child?.off('close', exitProcess);
		start();
	});
};
