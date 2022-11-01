import { configuration } from 'api/plugin';

export default {
	uuid: '16754741-d12b-42cb-ba32-34a9869ba474',
	name: 'test',
	description: 'ceci est un test',
	author: 'vex345',
	config: {
		back: 'index.ts',
		front: 'vue/app.vue',
		lang: ['en-US', 'fr-FR']
	},
	routes: [
		{
			name: 'main',
			path: '',
			component: import('./vue/app.vue')
		}
	]
} as configuration;
