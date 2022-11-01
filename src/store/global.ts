import { defineStore } from 'pinia';
import { ref, reactive, watch } from 'vue';

window.localStorage.setItem('darkMode', `__q_bool|${Number(window.env.darkMode())}`);
window.localStorage.setItem('lang', `__q_strn|${window.env.lang()}`);

export const globalStore = defineStore('global', () => {
	const directory = reactive({
		app: window.env.directory.app,
		appData: window.env.directory.appData,
		game: window.env.directory.game,
		log: window.env.directory.log,
		save: window.env.directory.save,
		resource: window.env.directory.resource,
		temp: window.env.directory.temp
	});
	const darkMode = ref<boolean>(window.env.darkMode());
	const lang = ref<string>(window.env.lang());
	
	function setLang(val: string) {
		lang.value = val;
	};

	function setDarkMode(val: boolean) {
		darkMode.value = val;
	}

	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	watch(() => directory.game, (_game) => {
		directory.save = window.path.resolve(directory.game, 'saves');
		directory.resource = window.path.resolve(directory.game, 'resourcepacks');
	});

	return {
		directory,
		darkMode,
		lang,
		setLang,
		setDarkMode,
	};
});
