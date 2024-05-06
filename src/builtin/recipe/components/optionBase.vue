<template>
	<div class="row justify-evenly q-ma-md">
		<div class="column justify-center items-center">
			<q-input
				v-model="$props.config.group"
				:label="$capitalize($t('builtin.recipe.options.group'))"
			/>
		</div>
		<div class="column justify-center items-center">
			<q-input
				v-model="$props.config.outputName"
				:label="$capitalize($t('builtin.recipe.options.name'))"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, type PropType } from 'vue';
import random from './random';

export default defineComponent({
	name: 'OptionFurnace',
	props: {
		config: {
			type: Object as PropType<any>,
			required: true
		}
	},
	setup (props) {
		onBeforeMount(() => {
			if (!props.config.outputName)
				props.config.outputName = random();
		});
	}
});
</script>
