<template>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'quasar';
import { generateMeta } from 'src/meta';

export default defineComponent({
	name: 'App',
	setup () {
		useMeta(generateMeta());
	}
});
</script>
