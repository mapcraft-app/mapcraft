<template>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'quasar';
import { generateMeta } from 'src/meta';

//import { globalStore } from 'src/store/global';

export default defineComponent({
	name: 'App',
	setup () {
		useMeta(generateMeta());
		//const store = globalStore();

		//store.getPackData('hello');
	}
});
</script>
