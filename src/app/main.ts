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
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css';
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css';
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css';
import '@quasar/extras/animate/fadeIn.css';
import '@quasar/extras/animate/fadeOut.css';
import 'quasar/src/css/index.sass';
import './sass/css.sass';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import appPlugin from './plugins/app';

import App from './App.vue';
import router from '@/router/index';
import messages from '@/i18n/index';

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
		},
		notify: {
			color: 'light-blue-7',
			position: 'bottom',
			timeout: 3000
		}
	}
});
app.use(i18n);
app.use(pinia);
app.use(router);
app.use(appPlugin);
app.mount('#main-app');
