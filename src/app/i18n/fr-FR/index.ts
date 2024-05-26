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
		banner: 'Ne fermer pas la fenêtre pendant la (les) mise(s) à jour',
		beforeRestart: 'Mapcraft redémarrera dans {n} secondes',
		data: 'Pack de données',
		resource: 'Pack de ressources',
		software: 'Logiciel',
		start: 'Démarrer la (les) mise(s) à jour',
		cancel: 'Annuler la (les) mise(s) à jour'
	},
	sql: {
		busy: 'La base de données est utilisée par un autre processus'
	},
	builtin: {} as Record<string, unknown>,
	plugin: {} as Record<string, unknown>,
	components,
	layouts,
	pages
};
