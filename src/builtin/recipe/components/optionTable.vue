<template>
	<div class="row justify-evenly q-ma-md">
		<div class="row justify-center items-center q-pr-sm">
			<span class="text-body1">{{ $capitalize($t('builtin.recipe.options.table.shapeless')) }}</span>
			<q-toggle
				v-model="$props.config.exact"
				size="xl"
				color="primary"
				class="q-pl-xs q-pr-xs"
			/>
			<span class="text-body1">{{ $capitalize($t('builtin.recipe.options.table.exact')) }}</span>
		</div>
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
	name: 'OptionTable',
	props: {
		config: {
			type: Object as PropType<{
				exact: boolean,
				group?: string | undefined,
				outputName?: string | undefined
			}>,
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
