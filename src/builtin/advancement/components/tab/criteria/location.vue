<template>
	<interface-biome v-model="data.biome" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceBiome from '../../interface/biome.vue';
import { location } from '../../../interfaces/1.17_1.19';
import { biome } from '../../../model';

export default defineComponent({
	name: 'TabLocation',
	components: {
		InterfaceBiome
	},
	props: {
		modelValue: {
			type: Object as PropType<location>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<location>({
			__at_root__: true,
			biome: props.modelValue.biome ?? {} as biome
		} as location);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
