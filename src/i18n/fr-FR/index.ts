import components from './components';
import layouts from './layouts';
import pages from './pages';

export default {
	app: {
		title: 'Mapcraft',
		update: 'Mise à jour',
		dev: 'Outil de développement',
		fullscreen: 'Plein écran',
		minimize: 'Réduire',
		maximize: 'Maximiser',
		close: 'Fermer',
		logError: 'En attente du fichier log du jeu'
	},
	update: {
		data: 'Pack de données',
		resource: 'Pack de ressources',
		software: 'Logiciel',
		start: 'Démarrer la (les) mise(s) à jour',
		cancel: 'Annuler la (les) mise(s) à jour'
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
