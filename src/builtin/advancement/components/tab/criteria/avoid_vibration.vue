<template>
	<interface-entity v-model="data.player" :is-player="true" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import type { avoid_vibration } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'Tab',
	components: {
		interfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<avoid_vibration>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<avoid_vibration>({
			player: props.modelValue.player ?? null
		} as avoid_vibration);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>