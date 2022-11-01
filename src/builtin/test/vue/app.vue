<template>
	<h1>{{ $t('plugin.test.hello') }} world from {{ one }}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Test',
	setup () {
		return {
			one: 'two'
		};
	}
});
</script>