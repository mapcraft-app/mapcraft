import { RouteRecordRaw } from 'vue-router';
import { normName } from 'builtin/index';

import helloPack from './hello/package.json';

export default [
	{
		path: normName(helloPack.name),
		component: () => import('builtin/hello/main.vue')
	}
] as RouteRecordRaw[];
