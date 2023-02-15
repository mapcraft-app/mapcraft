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
import { textColor } from '../../model';

export default defineComponent({
	name: 'SelectColor',
	props: {
		modelValue: {
			type: [String, null] as PropType<textColor | null>,
			required: true
		},
		label: {
			type: String,
			required: false,
			default: 'Color'
		},
		dense: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const options = ['black' ,'dark_blue' ,'dark_green' ,'dark_aqua' ,'dark_red' ,'dark_purple' ,'gold' ,'gray' ,'dark_gray' ,'blue' ,'green' ,'aqua' ,'red' ,'light_purple' ,'yellow' ,'white'];
		const optionsList = ref<string[]>(options);
		const color = ref<textColor | null>(props.modelValue ?? null);

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