<template>
	<h1>OPTIONS</h1>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
	setup () {
		const $q = useQuasar();
		
		return {
			toto: 'tutu'
		};
	}
});
</script>
