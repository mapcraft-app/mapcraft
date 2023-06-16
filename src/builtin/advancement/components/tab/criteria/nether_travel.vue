<template>
	<interface-distance v-model="data.distance" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceDistance from '../../interface/distance.vue';
import { nether_travel } from '../../../interfaces/1.17_1.19';
import { distance } from '../../../model';

export default defineComponent({
	name: 'TabNetherTravel',
	components: {
		InterfaceDistance
	},
	props: {
		modelValue: {
			type: Object as PropType<nether_travel>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<nether_travel>({
			distance: props.modelValue.distance ?? {} as distance
		} as nether_travel);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
