import components from './components';
import layouts from './layouts';
import pages from './pages';

export default {
	app: {
		title: 'Mapcraft',
		dev: 'Dev tools',
		fullscreen: 'Fullscreen',
		minimize: 'Minimize',
		maximize: 'Maximize',
		close: 'Close'
	},
	sql: {
		busy: 'Database is used by another process'
	},
	builtin: {} as Record<string, any>,
	components,
	layouts,
	pages
};
