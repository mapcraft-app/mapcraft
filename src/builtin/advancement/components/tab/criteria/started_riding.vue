<template>
	<interface-entity v-model="data.player" :is-player="true" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';

import type { started_riding } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'TabStartedRiding',
	components: {
		interfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<started_riding>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<started_riding>({
			player: props.modelValue.player ?? null
		} as started_riding);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>