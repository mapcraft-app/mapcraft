import { defineStore } from 'pinia';
import { reactive } from 'vue';
import formatString from 'api/formatString';

export const mapStore = defineStore('map', () => {
	const info = reactive({
		icon: '',
		name: '',
		path: ''
	});
	const pack = reactive({
		data: window.env.pack.data,
		dataArgs: {},
		resource: window.env.pack.resource,
		resourceArgs: {}
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

	function setPackData(str: string, args: Record<string, string> = { name: info.name }) {
		pack.data = str;
		pack.dataArgs = args;
	}

	function setPackResource(str: string, args: Record<string, string> = { name: info.name }) {
		pack.resource = str;
		pack.resourceArgs = args;
	}

	function getPackData(args: Record<string, string> = pack.dataArgs) {
		return formatString(pack.data, args);
	};

	function getPackResource(args: Record<string, string> = pack.resourceArgs){
		return formatString(pack.resource, args);
	};

	return {
		info,
		pack,
		
		setIcon,
		setName,
		setPath,
		setPackData,
		setPackResource,
		
		getPackData,
		getPackResource
	};
});