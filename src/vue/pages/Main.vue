<template>
	<q-page>
		<span class="text-h1">Main page</span>
		<span>{{ hello }}</span>
		<editor />
	</q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Editor from 'components/editor/Editor.vue';

export default defineComponent({
	name: 'MainPage',
	components: {
		Editor
	},
	setup () {
		return {
			hello: 'world'
		};
	}
});
</script>
