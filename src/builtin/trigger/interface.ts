export interface triggerInterface {
	id: number;
	name: string;
	onlyOnce: number;
	x1: number;
	y1: number;
	z1: number;
	x2: number;
	y2: number;
	z2: number;
}

export interface createTrigger {
	name?: string;
	onlyOnce: number;
	x1: number;
	y1: number;
	z1: number;
	x2: number;
	y2: number;
	z2: number;
}
