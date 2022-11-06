import helloPack from './hello/package.json';
import helloLang from './hello/lang';

export interface builtinFormat {
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

export const builtinList: {
	name: string;
	path: string;
	icon: string; // https://fonts.google.com/icons
	description: string;
	author: { email: string; name: string; };
	keywords: string[];
}[] = [];
export const builtinLang: {
	pluginName: string,
	data: Record<string, any>
}[] = [];

export const normName = (str: string): string => str.toLowerCase().normalize().replace(/[_*.\s]+/, '_');
const addBuiltin = (d: builtinFormat, lang: Record<string, any>) => {
	builtinList.push({
		name: d.name,
		path: normName(d.name),
		icon: d.icon,
		description: d.description,
		author: d.author,
		keywords: d.keywords
	});
	builtinLang.push({
		pluginName: normName(d.name),
		data: lang
	});
};

addBuiltin(helloPack, helloLang);
