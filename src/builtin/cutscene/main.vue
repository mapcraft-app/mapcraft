<template>
	<h4>{{ $t('builtin.cutscene.menu.name') }}</h4>
	<p>{{ test }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'CutsceneBuiltin',
	setup () {
		return {
			test: window.cutscene.one()
		};
	}
});
</script>
