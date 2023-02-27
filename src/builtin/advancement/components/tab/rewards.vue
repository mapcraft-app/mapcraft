<template>
	<div class="column">
		<q-input
			v-model.number="$props.modelValue.experience"
			class="q-pa-sm"
			type="number"
			min="0"
			label="Experience"
		/>
		<q-card square flat bordered class="q-pa-sm q-mb-sm">
			<div class="row justify-center q-mb-sm">
				<span class="text-h6 text-weight-regular">Recipes</span>
			</div>
			<string-array v-model="$props.modelValue.recipes" />
		</q-card>
		<q-card square flat bordered class="q-pa-sm">
			<div class="row justify-center q-mb-sm">
				<span class="text-h6 text-weight-regular">Loot tables</span>
			</div>
			<string-array v-model="$props.modelValue.loot" />
		</q-card>
		<q-input
			v-model="$props.modelValue.function"
			class="q-pa-sm"
			label="Function"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, watch } from 'vue';
import StringArray from './stringArray.vue';
import { rewards } from '../../model';

export default defineComponent({
	name: 'Rewards',
	components: {
		StringArray
	},
	props: {
		modelValue: {
			type: Object as PropType<rewards>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		onBeforeMount(() => {
			watch(props.modelValue, (val) => emit('update:modelValue', val), { deep: true });
		});
	}
});
</script>

<style scoped>

</style>
