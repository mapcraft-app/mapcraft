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
import { gamemodeType } from '../../model';

export default defineComponent({
	name: 'SelectGamemode',
	props: {
		modelValue: {
			type: [String, null] as PropType<gamemodeType | null>,
			required: true
		},
		label: {
			type: String,
			required: false,
			default: 'Gamemode'
		},
		dense: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const options = ['adventure', 'creative', 'spectator', 'survival'];
		const optionsList = ref<string[]>(options);
		const color = ref<gamemodeType | null>(props.modelValue ?? null);

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