import {
	Quasar,
	AppFullscreen,
	Loading,
	LocalStorage,
	SessionStorage,
	Meta,
	Notify,
	QSpinnerCube
} from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import { createApp } from 'vue';

import App from './vue/App.vue';

const app = createApp(App);

app.use(Quasar, {
	plugins: {
		AppFullscreen,
		Loading,
		LocalStorage,
		SessionStorage,
		Meta,
		Notify
	},
	config: {
		loading: {
			delay: 400,
			spinner: QSpinnerCube,
			spinnerSize: 80,
			spinnerColor: 'cyan-7'
		}
	}
});
app.mount('#main-app');
