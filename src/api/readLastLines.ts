import { constants, accessSync, createReadStream } from 'fs';
import { createInterface } from 'readline';
import type { ReadStream } from 'fs';

export interface line {
	n: number,
	line: string
}

interface config {
	file: ReadStream | null,
	maxLines: number,
	memory: line[],
	oldEndNumber: number,
	path: string
}

export default class {
	private config: config;

	constructor(path: string, nLines = Infinity) {
		this.config = {} as config;
		this.config.file = null;
		this.config.maxLines = nLines;
		this.config.memory = new Array(0);
		this.config.oldEndNumber = 0;
		this.config.path = path;

		if (nLines <= 0 || nLines >= Infinity)
			throw new Error(`The number of lines read must be between 1 and Infinity, current ${nLines}`);
		try {
			accessSync(this.config.path, constants.R_OK);
		} catch {
			throw new Error(`File not exist ${this.config.path}`);
		}
	}

	/**
	 * Get array of lines with index
	 */
	get lines(): line[] {
		return [ ...this.config.memory ];
	}

	/**
	 * Read the file and retrieve its last lines
	 * @returns Array of lines with index
	 */
	read(diff = false): Promise<line[]> {
		return new Promise((res, rej) => {
			let nLine = 0;
			const push = (line: string) => {
				if (nLine === 0) {
					this.config.oldEndNumber = (this.config.memory.length > 0)
						? this.config.memory[this.config.memory.length - 1].n
						: 0;
					this.config.memory.length = 0;
				}
				this.config.memory.push({
					n: ++nLine,
					line
				});
				if (this.config.memory.length >= this.config.maxLines)
					this.config.memory.shift();
			};

			if (!this.config.file) {
				this.config.file = createReadStream(
					this.config.path,
					{
						flags: 'r',
						encoding: 'utf-8',
						start: 0
					}
				);
			}
			createInterface({ input: this.config.file })
				.on('line', (line) => push(line))
				.on('error', (e) => {
					this.config.file?.destroy();
					this.config.file = null;
					return rej(e);
				})
				.on('close', () => {
					this.config.file?.destroy();
					this.config.file = null;
					if (diff)
						return res(this.diff());
					return res(this.config.memory);
				});
		});
	}

	/**
	 * Get the difference between the lines of the old request and the new ones
	 * @returns Array of lines with index
	 */
	diff(): line[] {
		if (
			this.config.memory.length > 0
			&& this.config.memory[this.config.memory.length - 1].n > this.config.oldEndNumber
		) {
			for (const x in this.config.memory) {
				if (this.config.memory[x].n > this.config.oldEndNumber)
					return this.config.memory.slice(Number(x));
			}
		}
		return [ ...this.config.memory ];
	}
}
