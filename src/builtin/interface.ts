import { shellModel } from '@/electron/api/shell/interface';

export interface info {
	private: boolean;
	name: string;
	icon: string;
	description: string;
	license: string;
	version: string;
	author: {
		email: string;
		name: string;
	};
	repository: {
		type: string;
		url: string;
	};
	keywords: string[];
}

export interface list {
	name: string;
	path: string;
	icon: string; // https://fonts.google.com/icons
	description: string;
	author: { email: string; name: string; };
	keywords: string[];
	shell: shellModel | shellModel[] | undefined
}

export interface lang {
	pluginName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>
}

export interface envInterface {
	datapack: {
		base: string;
		default: string;
	},
	resourcepack: string;
}
