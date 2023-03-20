import { constants, watch } from 'fs';
import type { FSWatcher } from 'fs';
import { access } from 'fs/promises';
import { resolve } from 'path';
import { IpcError } from 'electron/api/error';
import ipc from 'electron/ipc/render';
import lang from 'i18n/index';
import { commandRet, ipcCommand, shellModel } from './interface';

import { builtinList } from 'app/src/builtin/front';
import { ipcRenderer } from 'electron';
import readLastLines, { line } from 'api/readLastLines';

export class Shell {
	COMMAND: string;
	commands: shellModel[];
	command: commandRet;
	logPath: string;
	oldData: string;
	watch: FSWatcher | undefined;
	rll: readLastLines;
	
	constructor(logPath: string | undefined = undefined) {
		this.COMMAND = '/mapcraft';
		this.commands = [];
		this.command = {} as commandRet;
		this.logPath = logPath ?? resolve(process.env.GAME, 'logs', 'latest.log');
		this.oldData = '';
		this.watch = undefined;
		this.rll = new readLastLines(this.logPath, 25);

		// Test is watch is available throw plateform
		try {
			watch(process.env.APP_DATA).close();
		} catch (err) {
			ipcRenderer.send('window::crash', 'NodeJS.fs.watch api is unavailable. Are you running Windows, Mac or Linux ?');
		}

		builtinList.forEach((el) => {
			if (el.shell !== undefined) {
				if (Array.isArray(el.shell))
					el.shell.forEach((s) => this.commands.push(s));
				else
					this.commands.push(el.shell);
			}
		});
		if (import.meta.env.DEV)
			console.log('SHELL:', this.commands.sort((a, b) => a.name.localeCompare(b.name)));
	}

	private isExist(name: string) {
		for (const x in this.commands) {
			if (this.commands[x].name === name)
				return Number(x);
		}
		return 0;
	}

	/**
	 * Add command(s) to shell
	 * @param commands Shell command(s)
	 */
	add(commands: shellModel | shellModel[]): void {
		if (Array.isArray(commands)) {
			commands.forEach((obj) => {
				if (commands.constructor !== ({}).constructor)
					throw new Error(`api/shell: command ${obj.name} is malformed`);
				if (this.isExist(obj.name))
					throw new Error(`api/shell: command ${obj.name} exist`);
				else
					this.commands.push(obj);
			});
		} else if (commands.constructor === ({}).constructor)
			this.commands.push(commands);
		else
			throw new Error(`api/shell: command ${commands.name} is malformed`);
	}

	/**
	 * Remove command to shell
	 * @param name Name of command
	 */
	remove(name: string | string[]): void {
		if (Array.isArray(name)) {
			name.forEach((el) => {
				const x = this.isExist(el);
				if (x)
					this.commands.splice(x, 1);
			});
		} else {
			const x = this.isExist(name);
			if (x)
				this.commands.splice(x, 1);
		}
	}

	/**
	 * Execute command of shell
	 * @param input Line of user input
	 * @returns return of executed command, or null if command is undefined
	 */
	exec(input: string | string[]): (ipcCommand | null)[] | ipcCommand | null {
		const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
		const ret = (data: string) => {
			const check = data.indexOf(this.COMMAND);
			if (check !== -1) {
				const args = data.substring(check + this.COMMAND.length).split(/\s/).filter((e) => e.length);
				const name = args[0].toLowerCase();
				for (const command of this.commands) {
					if (command.name.toLowerCase() === name) {
						this.command = command.fn(args);
						const reg = /^__q_strn\|(.*)$/m.exec(window.localStorage.getItem('lang') ?? '');
						const type = (command.builtin)
							? 'builtin'
							: 'plugin';
						return {
							plugin: command.plugin,
							text: {
								title: capitalize((reg)
									? lang[reg[1]][type][command.plugin.toLowerCase()].menu.name
									: command.plugin),
								description: capitalize((reg)
									? lang[reg[1]][type][command.plugin.toLowerCase()].notification
									: '')
							},
							ret: this.command
						} as ipcCommand;
					}
				}
			}
			return null;
		};

		if (Array.isArray(input)) {
			const __ret: (ipcCommand | null)[]  = [];
			input.forEach((e) => __ret.push(ret(e)));
			return __ret;
		} else
			return ret(input);
	}

	/**
	 * Check if log file exist
	 */
	async check(): Promise<void> {
		return new Promise((res, rej) => {
			access(this.logPath, constants.F_OK | constants.R_OK)
				.then(() => {
					res();
					if (this.watch === undefined)
						this.watchLog();
				})
				.catch(() => {
					rej();
					if (this.watch) {
						this.watch.close();
						this.watch = undefined;
					}
				});
		});
	}

	/**
	 * Watch log game file
	 */
	watchLog(): void {
		let isReading = false;
		let oldData: line[] = [];

		try {
			this.watch = watch(this.logPath, { persistent: true }, (eventType) => {
				if (eventType !== 'change' || isReading)
					return;
				isReading = true;
				this.rll.read()
					.then((data) => {
						if (
							oldData.length
							&& data.every((el, i) => el.line === oldData[i].line && el.n === oldData[i].n)
						)
							return;
						oldData = data;
						const lines = this.rll.diff();
						const commands = this.exec(
							(lines.length <= 1)
								? lines.at(0)?.line as string
								: lines.map((e) => e.line) as string[]
						);
						if (commands && Array.isArray(commands)) {
							commands.forEach((e) => {
								if (e) {
									if (e.ret.notification === undefined || e.ret.notification === true)
										ipc.send('notification::push', e);
									ipc.send('shell::new-command', e);
								}
							});
						} else if (commands) {
							if (commands) {
								if (commands.ret.notification === undefined || commands.ret.notification === true)
									ipc.send('notification::push', commands);
								ipc.send('shell::new-command', commands);
							}
						}
					})
					.catch((e) => {
						throw new IpcError(`Read log file failed: ${e}`);
					})
					.finally(() => isReading = false);
			});
		} catch (e) {
			ipc.send('window::crash', 'NodeJs.fs.watch crash', e);
		}
	}
}
