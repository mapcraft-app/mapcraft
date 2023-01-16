<template>
	<q-select
		v-model="color"
		use-input
		input-debounce="250"
		:dense="$props.dense ?? true"
		:options="optionsList"
		:label="$props.label"
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onBeforeMount, watch } from 'vue';
import { frameType } from '../../model';

export default defineComponent({
	name: 'SelectFrame',
	props: {
		modelValue: {
			type: [String, null] as PropType<frameType | null>,
			required: true
		},
		label: {
			type: String,
			required: false,
			default: 'Frame'
		},
		dense: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const options = ['challenge', 'task', 'goal'];
		const optionsList = ref<string[]>(options);
		const color = ref<frameType | null>(props.modelValue ?? null);

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