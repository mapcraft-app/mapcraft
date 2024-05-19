import { resolve } from 'path';
import { exit } from 'process';
import { build, type PluginOption, type ViteDevServer, type Rollup } from 'vite';
import { spawn, type ChildProcess } from 'child_process';
import { version, repository } from '../package.json';
import { compilerOptions } from '../tsconfig.json';
import type { AddressInfo } from 'net';

interface option {
	dev: boolean;
}

const electronDevServer = async (options: option, server: ViteDevServer) => {
	let child: ChildProcess | undefined;;
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
		base: (!options.dev) ? './' : '/',
		mode: server.config.mode,
		clearScreen: false,
		define: {
			'import.meta.env.APP_VERSION': JSON.stringify(version),
			'import.meta.env.APP_GIT_URL': JSON.stringify(repository.url),
			'import.meta.env.ELECTRON_APP_URL': JSON.stringify(appUrl),
			'import.meta.env.ELECTRON_LOAD_URL': JSON.stringify(`${appUrl}/load.html`),
		},
		build: {
			cssCodeSplit: false,
			emptyOutDir: !options.dev,
			minify: options.dev,
			target: ['es2021', 'node21'],
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
			sourcemap: false,
			ssr: true,
			watch: (options.dev)
				? {}
				: undefined
		},
		resolve: {
			alias: Object
				.entries(compilerOptions.paths)
				.map((e) => ({
					find: e[0].slice(0, e[0].length - 2),
					replacement: resolve(
						(/\/\*/mi.test(e[1][0]))
							? e[1][0].slice(0, e[1][0].length - 2)
							: e[1][0]
					)
				}))	
		}
	}) as any as Rollup.RollupWatcher;

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
	const startElectron = ({ code }: any) => {
		if (code === 'END') {
			watcher.off('event', startElectron);
			start();
		}
	};
	watcher.on('event', startElectron);
	watcher.on('change', () => {
		child?.off('close', exitProcess);
		start();
	});

};

export default (options: option): PluginOption => ({
	name: 'electron',
	configureServer (server) {
		server.httpServer?.on('listening', () => {
			electronDevServer(options, server)
				.catch(server.config.logger.error);
		});
	}
});
