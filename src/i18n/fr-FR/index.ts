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
		close: 'Fermer',
		logError: 'En attente du fichier log du jeu'
	},
	sql: {
		busy: 'La base de données est utilisée par un autre processus'
	},
	builtin: {} as Record<string, any>,
	plugin: {} as Record<string, any>,
	components,
	layouts,
	pages
};
