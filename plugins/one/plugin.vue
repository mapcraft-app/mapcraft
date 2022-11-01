<template>
	<h1 class="test">Hello {{ one }}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PluginOne',
	setup () {
		console.log('hello from frontend of plugin one');
		return {
			one: 'two'
		};
	}
});
</script>

<style scoped>
.test {
	color: #179368;
}
</style>
