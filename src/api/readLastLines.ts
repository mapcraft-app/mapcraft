import { constants } from 'fs';
import { access, open } from 'fs/promises';
import { createInterface } from 'readline';
import type { FileHandle } from 'fs/promises';

interface config {
	file: FileHandle | undefined,
	maxLines: number,
	memory: unknown[],
	path: string,
	oldStart: number,
	start: number
}

export default class {
	private config: config;

	constructor(path: string, maxLines = 25) {
		this.config = {} as config;
		this.config.file = undefined;
		this.config.maxLines = maxLines;
		this.config.memory = [];
		this.config.path = path;
		this.config.oldStart = 0;
		this.config.start = 0;
		
		access(this.config.path, constants.R_OK)
			.catch(() => {
				throw new Error(`File not exist ${this.config.path}`);
			});
	}

	get lines(): unknown[] {
		return this.config.memory;
	}

	private push(el: any) {
		this.config.memory.push(el);
		if (this.config.memory.length > this.config.maxLines)
			this.config.memory.shift();
	}

	private async rl(start = 0): Promise<void> {
		return new Promise((res, rej) => {
			if (!this.config.file)
				rej();
			else {
				const rl = createInterface(
					this.config.file.createReadStream({ encoding: 'utf-8', start })
				);
				rl.on('line', (line) => this.push(line));
				rl.on('error', rej);
				rl.on('close', res);
			}
		});
	}

	async read(): Promise<unknown[]> {
		try {
			this.config.file = await open(this.config.path, 'r', 0o666);
			this.config.oldStart = this.config.start;
			this.config.start = (await this.config.file.stat()).size;
			await this.rl(this.config.oldStart);
		} catch (e: any) {
			throw new Error(e);
		} finally {
			await this.config.file?.close();
		}
		return this.config.memory;
	}
}
