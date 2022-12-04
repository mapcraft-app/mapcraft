import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const mapStore = defineStore('map', () => {
	const info = reactive({
		icon: '',
		name: '',
		path: '',
	});

	function setIcon(str: string) {
		info.icon = str;
	}
	function setName(str: string) {
		info.name = str;
	}
	function setPath(str: string) {
		info.path = str;
	}

	return {
		info,
		setIcon,
		setName,
		setPath,
	};
});