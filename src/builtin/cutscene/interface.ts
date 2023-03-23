export type end = 'origin' | 'last' | 'custom';

export type transition = 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear';

export interface cutscenePointInterface {
	cutsceneId: number;
	point: number;
	x: number;
	y: number;
	z: number;
	rx: number;
	ry: number;
	duration: number;
	transition: transition
}

export interface cutsceneInterface {
	id: number;
	name: string;
	tag: string;
	duration: number;
	description: string;
	position: string;
}

export interface bezier {
	transition: transition,
	points: number[]
}

export interface cutscene {
	cutscene: cutsceneInterface,
	points: cutscenePointInterface[],
	option: {
		end: end,
		point: cutscenePointInterface
	}
}
