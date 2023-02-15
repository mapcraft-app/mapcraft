<template>
	<q-select
		v-model="color"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="optionsList"
		:label="$props.label"
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onBeforeMount, watch } from 'vue';
import { dimensionType } from '../../model';

export default defineComponent({
	name: 'SelectDimension',
	props: {
		modelValue: {
			type: [String, null] as PropType<dimensionType | null>,
			required: true
		},
		label: {
			type: String,
			required: false,
			default: 'Dimension'
		},
		dense: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const options = ['the_end', 'overworld', 'the_nether'];
		const optionsList = ref<string[]>(options);
		const color = ref<dimensionType | null>(props.modelValue ?? null);

		const filter = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					optionsList.value = options;
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					optionsList.value = options.filter((v) => v.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		onBeforeMount(() => {
			watch(color, (after) => {
				if (after)
					emit('update:modelValue', after);
			});
		});

		return {
			optionsList,
			color,
			filter
		};
	}
});
</script>