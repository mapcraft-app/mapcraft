import components from './components';
import layouts from './layouts';
import pages from './pages';

export default {
	app: {
		title: 'Mapcraft',
		update: 'Update',
		dev: 'Dev tools',
		fullscreen: 'Fullscreen',
		minimize: 'Minimize',
		maximize: 'Maximize',
		close: 'Close',
		logError: 'Waiting for the game log file'
	},
	update: {
		data: 'Data pack',
		resource: 'Resource pack',
		software: 'Software',
		start: 'Start update(s)',
		cancel: 'Cancel update(s)'
	},
	sql: {
		busy: 'Database is used by another process'
	},
	builtin: {} as Record<string, any>,
	plugin: {} as Record<string, any>,
	components,
	layouts,
	pages
};
