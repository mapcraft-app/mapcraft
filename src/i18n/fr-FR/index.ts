import components from './components';
import layouts from './layouts';
import pages from './pages';

export default {
	app: {
		title: 'Mapcraft',
		dev: 'Outil de développement',
		fullscreen: 'Plein écran',
		minimize: 'Réduire',
		maximize: 'Maximiser',
		close: 'Fermer'
	},
	builtin: {} as Record<string, any>,
	components,
	layouts,
	pages
};
