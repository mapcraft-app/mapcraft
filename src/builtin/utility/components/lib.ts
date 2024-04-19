import { capitalize } from '@/app/plugins/app';
import type { QVueGlobals } from 'quasar';
import type { ComposerTranslation } from 'vue-i18n';

export type tabsType = 'blocks' | 'items' | 'entity' | 'tags';
export interface list {
	id: string,
	name: string,
	path: string | undefined
};

export interface tagEl {
	href: string | undefined,
	tag: string | undefined,
	type: tabsType,
	name: string
}

export interface tags {
	id: string,
	tag: string,
	els: tagEl[]
};

export const copyToClipboard = (
	$q: QVueGlobals,
	t: ComposerTranslation,
	e: string
): void => {
	window.mapcraft.clipboard.writeText(e);
	$q.notify({
		message: capitalize(t('builtin.utility.copy')),
		icon: 'content_paste',
		color: 'teal-7',
		timeout: 1000
	});
};

export const repUnderscore = (e: string): string => e.replaceAll('_', ' ');
