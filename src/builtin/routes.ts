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
	}
] as RouteRecordRaw[];
