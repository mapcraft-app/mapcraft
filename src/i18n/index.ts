import en from './en-US';
import fr from './fr-FR';
import { builtinLang } from 'builtin/index';

const lang = {
	'en-US': en,
	'fr-FR': fr
};

for (const plugin of builtinLang) {
	if (Object.prototype.hasOwnProperty.call(plugin.data, 'en-US'))
		lang['en-US'].builtin[plugin.pluginName] = plugin.data['en-US'];
	if (Object.prototype.hasOwnProperty.call(plugin.data, 'fr-FR'))
		lang['fr-FR'].builtin[plugin.pluginName] = plugin.data['fr-FR'];
};

export default lang;
