import { writeFile } from 'fs';

export class LogError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

class Log {
	private fileName: string;
	private num(n: number): string {
		return (n <= 9)
			? `0${n}`
			: String(n);
	}

	constructor() {
		this.fileName = `${process.env.LOG}/${process.env.DATE}.log`;
	}

	private write(type: string, data: string): void {
		const date = new Date();
		const printDate = `${date.getUTCFullYear()}-${this.num(date.getUTCMonth() + 1)}-${this.num(date.getUTCDate())} ${this.num(date.getUTCHours())}:${this.num(date.getUTCMinutes())}:${this.num(date.getUTCSeconds())}`;

		let ret = `[${type}]`;
		if (ret.length === 6) ret += `  ${printDate} - `;
		else ret += ` ${printDate} - `;
		ret += data;
		ret += '\n';

		writeFile(this.fileName, new Uint8Array(Buffer.from(ret)), {
			encoding: 'utf-8',
			flag: 'a'
		},
		(err) => {
			if (err)
				throw new LogError(`fs.writeFile failed - ${err.message}`); 
		});
	}

	debug(str: string): void {
		this.write('debug', str);
	}

	error(str: string): void {
		this.write('error', str);
	}
	
	info(str: string): void {
		this.write('info', str);
	}

	warn(str: string): void {
		this.write('warn', str);
	}
}

export default Log;
