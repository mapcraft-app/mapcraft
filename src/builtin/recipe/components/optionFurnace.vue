<template>
	<div class="row justify-evenly q-ma-md">
		<div class="column justify-center items-center">
			<q-input
				v-model.number="$props.config.experience"
				:label="$capitalize($t('builtin.recipe.options.furnace.experience'))"
				type="number"
				step="0.1" min="0"
				class="max-width"
			/>
		</div>
		<div class="column justify-center items-center">
			<q-input
				v-model.number="$props.config.time"
				:label="$capitalize($t('builtin.recipe.options.furnace.time'))"
				type="number"
				step="0.1" min="0"
				class="max-width"
			>
				<template v-slot:append>
					<span>s</span>
				</template>
			</q-input>
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
	name: 'OptionFurnace',
	props: {
		config: {
			type: Object as PropType<{
				experience: number,
				time: number,
				group?: string,
				outputName?: string
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
