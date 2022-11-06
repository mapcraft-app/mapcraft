import { createWebHistory, createRouter } from 'vue-router';
import routes from './routes';

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior: () => ({ left: 0, top: 0 })
});

router.beforeEach((to, from) => {
	console.log('to', to),
	console.log('from', from);
});

export default router;
