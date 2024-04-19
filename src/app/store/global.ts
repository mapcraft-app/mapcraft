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
	const plugin = ref<{ name: string, path: string } | null>(null);
	
	function setLang(val: string) {
		lang.value = val;
	};

	function setDarkMode(val: boolean) {
		darkMode.value = val;
	}

	watch(() => directory.game, () => {
		directory.save = window.mapcraft.module.path.resolve(directory.game, 'saves');
		directory.resource = window.mapcraft.module.path.resolve(directory.game, 'resourcepacks');
	});

	watch(directory, () => {
		window.mapcraft.updateConfig({
			game: directory.game,
			temp: directory.temp,
			resource_game: directory.resource,
			save_game: directory.save
		});
	});

	return {
		directory,
		darkMode,
		lang,
		plugin,
	
		setLang,
		setDarkMode,
	};
});
