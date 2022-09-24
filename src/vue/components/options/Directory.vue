<template>
	<q-input
		type="text"
		hint=""
	/>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';
import { globalStore } from 'src/store/global';

export default defineComponent({
	name: 'OptionsDirectory',
	setup () {
		const $q = useQuasar();

		return {

		};
	}
});
</script>