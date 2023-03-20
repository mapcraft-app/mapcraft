import { globalStore } from 'store/global';

export default (data: { name: string, path: string } | null = null): string => {
	const __store__ = globalStore();
	const route = (data)
		? `/${data.path}`
		: '/';
	if (__store__)
		__store__.plugin = data;
	window.log.info(`[PLUGIN] ${data
		? data.name
		: '/'} is selected`
	);
	return route;
};
