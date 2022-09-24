import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import formatString from 'api/formatString';

export const mapStore = defineStore('map', () => {
	const name = ref('');
	const pack = reactive({
		data: window.env.pack.data,
		dataArgs: {},
		resource: window.env.pack.resource,
		resourceArgs: {}
	});

	function setName(str: string) {
		name.value = str;
	}

	function setPackData(str: string, args: Record<string, string> = { name: name.value }) {
		pack.data = str;
		pack.dataArgs = args;
	}

	function setPackResource(str: string, args: Record<string, string> = { name: name.value }) {
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
		name,
		pack,
		
		setName,
		setPackData,
		setPackResource,
		
		getPackData,
		getPackResource
	};
});