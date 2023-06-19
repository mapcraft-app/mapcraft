<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.interface.entityPlayer.player'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.player" :is-player="true" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="location_on"
			:label="$capitalize($t('builtin.advancement.tab.rideEntityInLava.startPosition'))"
			class="q-ma-xs"
		>
			<interface-biome v-model="data.start_position" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="straighten"
			:label="$capitalize($t('builtin.advancement.interface.entityPlayer.distance'))"
			class="q-ma-xs"
		>
			<interface-distance v-model="data.distance" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import interfaceDistance from '../../interface/distance.vue';
import interfaceBiome from '../../interface/biome.vue';

import type { ride_entity_in_lava } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'TabRideEntityInLava',
	components: {
		interfaceEntity,
		interfaceDistance,
		interfaceBiome,
	},
	props: {
		modelValue: {
			type: Object as PropType<ride_entity_in_lava>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<ride_entity_in_lava>({
			player: props.modelValue.player ?? null,
			start_position: props.modelValue.start_position,
			distance: props.modelValue.distance ?? null
		} as ride_entity_in_lava);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>