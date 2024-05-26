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
		banner: 'Do not close the window during update(s)',
		beforeRestart: 'Mapcraft will restart in {n} seconds',
		data: 'Data pack',
		resource: 'Resource pack',
		software: 'Software',
		start: 'Start update(s)',
		cancel: 'Cancel update(s)'
	},
	sql: {
		busy: 'Database is used by another process'
	},
	builtin: {} as Record<string, unknown>,
	plugin: {} as Record<string, unknown>,
	components,
	layouts,
	pages
};
