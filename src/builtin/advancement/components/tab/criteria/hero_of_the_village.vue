<template>
	<interface-biome v-model="data.biome" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceBiome from '../../interface/biome.vue';
import { hero_of_the_village } from '../../../conditions';
import { biome } from '../../../model';

export default defineComponent({
	name: 'TabHeroOfTheVillage',
	components: {
		InterfaceBiome
	},
	props: {
		modelValue: {
			type: Object as PropType<hero_of_the_village>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<hero_of_the_village>({
			__at_root__: true,
			biome: props.modelValue.biome ?? {} as biome
		} as hero_of_the_village);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
