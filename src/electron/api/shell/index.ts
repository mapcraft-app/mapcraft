import { constants, watch } from 'fs';
import type { FSWatcher } from 'fs';
import { access, readFile } from 'fs/promises';
import { resolve } from 'path';
import { IpcError } from 'electron/api/error';
import ipc from 'electron/ipc/render';
import { commandRet, shellModel } from './interface';

import { builtinList } from 'app/src/builtin/front';
import { ipcRenderer } from 'electron';

export class Shell {
	COMMAND: string;
	commands: shellModel[];
	command: commandRet;
	logPath: string;
	watch: FSWatcher | undefined;
	
	constructor(logPath: string | undefined = undefined) {
		this.COMMAND = '/mapcraft';
		this.commands = [];
		this.command = {} as commandRet;
		this.logPath = logPath ?? resolve(process.env.GAME, 'logs', 'latest.log');
		this.watch = undefined;

		// Test is watch is available throw plateform
		try {
			watch(process.env.APP_DATA).close();
		} catch (err) {
			ipcRenderer.send('window::crash', 'NodeJS.fs.watch api is unavailable. Are you running Windows, Mac or Linux ?');
		}
		ipcRenderer.send('window::crash', 'NodeJS.fs.watch api is unavailable. Are you running Windows, Mac or Linux ?');

		builtinList.forEach((el) => {
			if (el.shell !== undefined) {
				if (Array.isArray(el.shell))
					el.shell.forEach((s) => this.commands.push(s));
				else
					this.commands.push(el.shell);
			}
		});
		console.log('SHELL :', this.commands);
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
	exec(input: string): commandRet | null {
		const check = input.indexOf(this.COMMAND);

		if (check !== -1) {
			const args = input.substring(check + this.COMMAND.length).split(/\s/).filter((e) => e.length);
			const name = args[0].toLowerCase();
			for (const command of this.commands) {
				if (command.name.toLowerCase() === name) {
					this.command = command.fn(args);
					return this.command;
				}
			}
		}
		return null;
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

		this.watch = watch(this.logPath, { persistent: true }, (eventType) => {
			if (eventType !== 'change')
				return;
			if (isReading)
				return;
			isReading = true;
			readFile(this.logPath, { encoding: 'utf-8', flag: 'r' })
				.then((data) => {
					const line = /\r?\n\[(?<time>\d\d:\d\d:\d\d)\] \[(?<info>.*)\]:(?<input>.*)\r?\n$/.exec(data);
					if (line && line.groups && line.groups.time && line.groups.info && line.groups.input) {
						const command = this.exec(line.groups.input.trim());
						if (command) {
							console.log(command);
							ipc.send('shell::new-command', command);
						}
					}
				})
				.catch(() => {
					throw new IpcError('Read log file failed');
				})
				.finally(() => isReading = false);
		});
	}
}
