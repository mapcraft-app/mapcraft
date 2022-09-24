import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/Main.vue')
	},
	{
		path: '/map',
		component: () => import('layouts/Map.vue'),
		children: [
			{
				path: '',
				name: 'maps',
				component: () => import('pages/Map.vue')
			}
		]
	},
	{
		path: '/options',
		component: () => import('layouts/Main.vue'),
		children: [
			{
				path: '',
				name: 'options',
				component: () => import('pages/Options.vue')
			}
		]
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('layouts/Main.vue'),
		children: [
			{
				path: '',
				name: 'error',
				component: () => import('pages/Error.vue')
			}
		]
	}
];

export default routes;
