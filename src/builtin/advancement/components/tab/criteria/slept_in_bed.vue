<template>
	<biome v-model="data.biome" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Biome from '../../interface/biome.vue';
import { slept_in_bed } from '../../../conditions';
import { biome } from '../../../model';

export default defineComponent({
	name: 'TabSleptInBed',
	components: {
		Biome
	},
	props: {
		modelValue: {
			type: Object as PropType<slept_in_bed>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<slept_in_bed>({
			__at_root__: true,
			biome: props.modelValue.biome ?? {} as biome
		} as slept_in_bed);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
