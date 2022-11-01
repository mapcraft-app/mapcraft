import type { RouteRecordRaw } from 'vue-router';

export default [
	{
		path: '',
		name: 'one',
		component: () => import('./plugin.vue')
	}
] as RouteRecordRaw[];
