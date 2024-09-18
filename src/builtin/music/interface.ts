export type category =
	'none' | 'ambient' | 'block' | 'hostile' | 'master' | 'music' |
	'neutral' | 'player' | 'record' | 'voice' | 'weather';

export type type = 'event' | 'file';

export interface sounds {
	attenuation_distance?: number,
	name: string,
	pitch?: number,
	preload?: boolean,
	stream?: boolean,
	type?: type,
	volume?: number,
	weight?: number
}

export interface sound {
	category: category,
	id: number,
	name: string,
	replace?: boolean,
	sounds: sounds[],
	subtitle?: string
}
