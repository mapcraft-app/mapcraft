import * as info from '../package.json';

export interface MetaData {
	title: string;
	titleTemplate(str: string): string; // eslint-disable-line no-unused-vars
}

const EMPTY = '___EMPTY___';
const upper = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
const generateMeta = (title?: string): MetaData => {
	const data = {} as MetaData;
	data.title = title || EMPTY;
	data.titleTemplate = (str: string): string =>
		(str !== EMPTY)
			? `${str} - ${upper(info.name)}`
			: upper(info.name);
	return data;
};

export { generateMeta };
