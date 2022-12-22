<template>
	<div class="row justify-evenly q-pt-sm q-pb-sm">
		<q-btn
			color="red-7" label="Delete recipe"
			@click="$emit('delete')"
		/>
		<q-btn
			color="green-7" label="Create recipe"
			@click="$emit('create')"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'OptionButton',
	emits: ['create', 'delete']
});
</script>
