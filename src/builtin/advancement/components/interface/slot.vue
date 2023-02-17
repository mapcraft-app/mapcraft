<template>
	<number-range-type v-model="data.empty" />
	<number-range-type v-model="data.full" />
	<number-range-type v-model="data.occupied" />
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import numberRangeType from '../type/numberRange.vue';
import { slot } from '../../model';

export default defineComponent({
	name: 'InterfaceSlot',
	components: {
		numberRangeType
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<slot | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<slot>({
			empty: props.modelValue?.empty ?? 0,
			full: props.modelValue?.full ?? 0,
			occupied: props.modelValue?.occupied ?? 0
		});

		onBeforeMount(() => {
			watch(data, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			data
		};
	}
});
</script>