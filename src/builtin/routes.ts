import { RouteRecordRaw } from 'vue-router';
import { builtinList } from 'app/src/builtin/front';

const getNormName = (name: string): string | null => {
	const __name = name.toLowerCase();
	for (const built of builtinList) {
		if (built.name.toLowerCase() === __name)
			return built.path;
	}
	return null;
};

export default [
	{
		path: getNormName('cutscene'),
		component: () => import('builtin/cutscene/main.vue')
	},
	{
		path: getNormName('music'),
		component: () => import('builtin/music/main.vue')
	},
	{
		path: getNormName('recipe'),
		component: () => import('builtin/recipe/main.vue')
	},
	{
		path: getNormName('trigger'),
		component: () => import('builtin/trigger/main.vue')
	},
	{
		path: getNormName('utility'),
		component: () => import('builtin/utility/main.vue')
	}
] as RouteRecordRaw[];
