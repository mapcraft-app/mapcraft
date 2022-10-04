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
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/src/css/index.sass';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';

import App from './vue/App.vue';
import router from './router';
import messages from './i18n';

const i18n = createI18n({
	fallbackLocale: 'en-US',
	globalInjection: true,
	legacy: false,
	locale: 'en-US',
	messages
});
const pinia = createPinia();
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
app.use(i18n);
app.use(pinia);
app.use(router);
app.mount('#main-app');
