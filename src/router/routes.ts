import { RouteRecordRaw } from 'vue-router';
import builtinRoutes from 'builtin/routes';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/Main.vue'),
		children: [
			{
				path: '',
				component: () => import('pages/Main.vue')
			},
			...builtinRoutes
		]
	},
	{
		path: '/map',
		component: () => import('layouts/Map.vue'),
		children: [
			{
				path: '',
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
				component: () => import('pages/Options.vue')
			}
		]
	},
	{
		path: '/update',
		component: () => import('layouts/Update.vue'),
		children: [
			{
				path: '',
				component: () => import('pages/Update.vue')
			}
		]
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('layouts/Main.vue'),
		children: [
			{
				path: '',
				component: () => import('pages/Error.vue')
			}
		]
	}
];

export default routes;
