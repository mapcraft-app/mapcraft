import { constants } from 'fs';
import { access, open } from 'fs/promises';
import { createInterface } from 'readline';
import type { FileHandle } from 'fs/promises';

export interface line {
	n: number,
	line: unknown
}

interface config {
	file: FileHandle | undefined,
	maxLines: number,
	memory: line[],
	oldEndNumber: number,
	path: string
}

export default class {
	private config: config;

	constructor(path: string, maxLines = Infinity) {
		this.config = {} as config;
		this.config.file = undefined;
		this.config.maxLines = maxLines;
		this.config.memory = [];
		this.config.oldEndNumber = 0;
		this.config.path = path;
		
		access(this.config.path, constants.R_OK)
			.catch(() => {
				throw new Error(`File not exist ${this.config.path}`);
			});
	}

	get lines(): line[] {
		return this.config.memory;
	}

	private push(n: number, line: unknown) {
		this.config.memory.push({ n, line });
		if (this.config.memory.length > this.config.maxLines)
			this.config.memory.shift();
	}

	private async rl(): Promise<void> {
		return new Promise((res, rej) => {
			let i = 0;

			if (!this.config.file)
				rej();
			else {
				const rl = createInterface({
					input: this.config.file.createReadStream({ encoding: 'utf-8' }),
					crlfDelay: Infinity
				});
				rl.on('line', (line) => this.push(i++, line));
				rl.on('error', rej);
				rl.on('close', res);
			}
		});
	}

	async read(diff = false): Promise<line[]> {
		try {
			this.config.oldEndNumber = this.config.memory.length
				? this.config.memory[this.config.memory.length - 1].n
				: 0;
			this.config.file = await open(this.config.path, 'r', 0o666);
			await this.rl();
		} catch (e: any) {
			throw new Error(e);
		} finally {
			await this.config.file?.close();
		}
		if (this.config.oldEndNumber >= this.config.memory[this.config.memory.length - 1].n || !diff)
			return [ ...this.config.memory ];
		else
			return this.diff();
	}

	diff(): line[] {
		if (this.config.memory[this.config.memory.length - 1].n > this.config.oldEndNumber) {
			for (const x in this.config.memory) {
				if (this.config.memory[x].n > this.config.oldEndNumber)
					return this.config.memory.slice(Number(x));
			}
		}
		return [ ...this.config.memory ];
	}
}
