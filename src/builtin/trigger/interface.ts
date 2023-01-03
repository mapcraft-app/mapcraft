export interface envInterface {
	datapack: {
		base: string;
		default: string;
	},
	resourcepack: string;
}

export interface triggerInterface {
	id: number;
	name: string;
	x1: number;
	y1: number;
	z1: number;
	x2: number;
	y2: number;
	z2: number;
}

export interface createTrigger {
	name?: string;
	x1: number;
	y1: number;
	z1: number;
	x2: number;
	y2: number;
	z2: number;
}
