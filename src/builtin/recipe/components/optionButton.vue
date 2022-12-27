<template>
	<div class="row justify-evenly q-pt-sm q-pb-sm">
		<q-btn
			color="red-7" :label="$capitalize($t('builtin.recipe.options.buttons.delete'))"
			@click="$emit('delete')"
		/>
		<q-btn
			color="green-7" :label="$capitalize($t('builtin.recipe.options.buttons.create'))"
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
