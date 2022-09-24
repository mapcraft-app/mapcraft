export class ProcessError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class WindowError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class IpcError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class MapcraftError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}
