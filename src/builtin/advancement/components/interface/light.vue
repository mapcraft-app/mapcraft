<template>
	<number-range-type v-model="data" :label="$capitalize($t('builtin.advancement.interface.biome.light'))" />
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import numberRangeType from '../type/numberRange.vue';
import { light, numberRange } from '../../model';

export default defineComponent({
	name: 'InterfaceLight',
	components: {
		numberRangeType
	},
	props: {
		modelValue: {
			type: Object as PropType<light | null>,
			required: false,
			default: {} as light
		},
		dense: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const get = (min = true) => {
			if (!props.modelValue)
				return 0;
			if (typeof props.modelValue.light === 'number') {
				return (min)
					? props.modelValue.light
					: 0;
			}
			return (min)
				? props.modelValue.light.min
				: props.modelValue.light.max;
		};

		const data = ref<numberRange>({
			min: get(),
			max: get(false)
		});

		onBeforeMount(() => {
			watch(data, (after) => {
				if (after) {
					if (!props.modelValue || typeof props.modelValue.light === 'number')
						emit('update:modelValue', { light: after.min });
					else {
						emit('update:modelValue', {
							light: {
								min: after.min,
								max: after.max
							}
						} as light);
					}
				}
			}, { deep: true });
		});
		
		return {
			data
		};
	}
});
</script>