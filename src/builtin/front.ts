import { info, list, lang } from './interface';
import { shellModel } from 'electron/api/shell/interface';

import cutscenePack from './cutscene/package.json';
import cutsceneLang from './cutscene/lang';
import cutsceneShell from './cutscene/shell';

export const builtinList: list[] = [];
export const builtinLang: lang[] = [];
export const normName = (str: string): string => str.toLowerCase().normalize().replace(/[_*.\s]+/, '_');
export const addBuiltin = (d: info, lang: Record<string, any>, sh: shellModel | shellModel[]): void => {
	builtinList.push({
		name: d.name,
		path: normName(d.name),
		icon: d.icon,
		description: d.description,
		author: d.author,
		keywords: d.keywords,
		shell: sh
	});
	builtinLang.push({
		pluginName: normName(d.name),
		data: lang
	});
};

addBuiltin(cutscenePack, cutsceneLang, cutsceneShell);
