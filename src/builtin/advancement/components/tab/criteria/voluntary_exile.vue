<template>
	<biome v-model="data.biome" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Biome from '../../interface/biome.vue';
import { voluntary_exile } from '../../../interfaces/1.17_1.19';
import { biome } from '../../../model';

export default defineComponent({
	name: 'TabVoluntaryExile',
	components: {
		Biome
	},
	props: {
		modelValue: {
			type: Object as PropType<voluntary_exile>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<voluntary_exile>({
			__at_root__: true,
			biome: props.modelValue.biome ?? {} as biome
		} as voluntary_exile);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
