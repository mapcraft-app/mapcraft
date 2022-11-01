import { RouteRecordRaw } from 'vue-router';

import oneRoutes from 'plugins/one/routes';

const pluginPath: RouteRecordRaw[] = [];

pluginPath.push(...oneRoutes);
console.log(pluginPath);


const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/Main.vue'),
		children: [
			{
				path: '',
				name: 'main',
				component: () => import('pages/Main.vue'),
				children: [
					...oneRoutes
				]
			},
		]
	},
	{
		path: '/map',
		component: () => import('layouts/Map.vue'),
		children: [
			{
				path: '',
				name: 'map',
				component: () => import('pages/Map.vue')
			}
		]
	},
	{
		path: '/user',
		component: () => import('layouts/User.vue'),
		children: [
			{
				path: '',
				name: 'user',
				component: () => import('pages/User.vue')
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
