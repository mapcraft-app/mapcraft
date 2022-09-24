import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

window.localStorage.setItem('darkMode', `__q_bool|${Number(window.env.darkMode())}`);
window.localStorage.setItem('lang', `__q_strn|${window.env.lang()}`);

export const globalStore = defineStore('global', () => {
	const directory = reactive({
		app: window.env.directory.app,
		appData: window.env.directory.appData,
		game: window.env.directory.game,
		log: window.env.directory.log,
		save: window.env.directory.save,
		temp: window.env.directory.temp
	});
	const pack = reactive({
		data: window.env.pack.data,
		resource: window.env.pack.resource
	});
	const darkMode = ref<boolean>(window.env.darkMode());
	const lang = ref<string>(window.env.lang());

	function setLang(val: string) {
		lang.value = val;
	};
	function setDarkMode(val: boolean) {
		darkMode.value = val;
	}

	return {
		directory,
		pack,
		darkMode,
		lang,

		setLang,
		setDarkMode
	};
});
