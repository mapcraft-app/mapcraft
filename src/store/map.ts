import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const mapStore = defineStore('map', () => {
	const info = reactive({
		icon: '',
		name: '',
		path: '',
	});
	const path = reactive({
		datapack: {
			base: '', // mapcraft-data
			default: '' // mapcraft
		},
		resourcepack: ''
	});
	const minecraftVersion = ref<'1.17' | '1.17.1' | '1.17.2' | '1.18' | '1.18.1' | '1.18.2' | '1.19' | '1.19.1' | '1.19.2' | '1.19.3'>('1.19.3');

	function setIcon(str: string) {
		info.icon = str;
	}
	function setName(str: string) {
		info.name = str;
	}
	function setPath(str: string) {
		info.path = str;
	}

	function setMinecraftVersion(val: '1.17' | '1.17.1' | '1.17.2' | '1.18' | '1.18.1' | '1.18.2' | '1.19' | '1.19.1' | '1.19.2' | '1.19.3') {
		minecraftVersion.value = val;
	}

	function setMapPath(savePath: string, resourcePath: string, nameOfMap: string) {
		path.resourcepack = window.mapcraft.module.path.resolve(resourcePath, nameOfMap);
		path.datapack.base = window.mapcraft.module.path.resolve(savePath, nameOfMap, 'datapacks', 'mapcraft-data', 'data', 'mapcraft-data');
		path.datapack.default = window.mapcraft.module.path.resolve(savePath, nameOfMap, 'datapacks', 'mapcraft', 'data', 'mapcraft');
	}

	function getMapPath() {
		return JSON.parse(JSON.stringify(path));
	}

	return {
		info,
		path,
		minecraftVersion,

		setIcon,
		setName,
		setPath,

		setMapPath,
		getMapPath,

		setMinecraftVersion
	};
});