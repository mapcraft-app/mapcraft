/*import { createReadStream } from 'fs';
import { createInterface } from 'readline';

export default (path: string, maxLine: number): Promise<string> => {
	const stdin = createReadStream(path);

	return new Promise((res, rej) => {
		const rl = createInterface(stdin);
		let lastLine = '';

		rl.on('line', (line) => {
			lastLine = line;
		});
		rl.on('error', rej);
		rl.on('close', () => res(lastLine));
	});
};*/
/*
import { access, open } from 'fs/promises';
import type { FileHandle } from 'fs/promises';

interface config {
	fh: FileHandle,
	start: number,
	end: number
}

class arr {
	private length: number;
	public memory: any[];
	private x: number;
	
	constructor(length: number) {
		this.length = length;
		this.memory = Array(length);
		this.x = 0;
	}

	push(el: any) {
		if (this.x < this.length)
			this.memory[this.x++] = el;
		if (this.x >= this.length)
			this.x = 0;
	}
}

export default async (
	path: string,
	maxLine: number
): Promise<Buffer> => {
	const config: config = {} as config;
	const data = new arr(maxLine);

	try {
		await access(path);
		config.fh = await open(path, 'r', 0o666);
		config.start = (await config.fh.stat()).size;
	} catch {
		throw new Error(`File not exist ${path}`);
	}


	return Buffer.from('');
};
*/

import { access, open } from 'fs/promises';
import type { FileHandle } from 'fs/promises';
import { constants } from 'fs';

interface config {
	file: FileHandle | undefined,
	maxLines: number,
	memory: unknown[],
	i: number,
	path: string,
	start: number
}

export default class {
	private config: config;

	constructor(path: string, maxLines = 25) {
		this.config = {} as config;
		this.config.path = path;
		this.config.maxLines = maxLines;
		this.config.memory = Array(length);
		this.config.i = 0;
		this.config.file = undefined;
	}

	get lines(): unknown[] {
		return this.config.memory;
	}

	private push(el: any) {
		if (this.config.i < this.config.maxLines)
			this.config.memory[this.config.i++] = el;
		if (this.config.i >= this.config.maxLines)
			this.config.i = 0;
	}

	async read(): Promise<unknown[]> {
		if (!this.config.file) {
			try {
				await access(this.config.path, constants.R_OK);
				this.config.file = await open(this.config.path, 'r', 0o666);
				this.config.start = (await this.config.file.stat()).size;
			} catch {
				throw new Error(`File not exist ${this.config.path}`);
			}
			for await (const line of this.config.file.readLines())
				this.push(line);
		} else {
			for await (const line of this.config.file.readLines({ start: this.config.start }))
				this.push(line);
			this.config.start = (await this.config.file.stat()).size;
		}
		return this.config.memory;
	}
}
