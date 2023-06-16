<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.select.entity'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.player" :is-player="true" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="category"
			:label="$capitalize($t('builtin.advancement.interface.entityPlayer.distance'))"
			class="q-ma-xs"
		>
			<interface-distance v-model="data.distance" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="location_on"
			:label="$capitalize($t('builtin.advancement.trigger.location'))"
			class="q-ma-xs"
		>
			<interface-biome v-model="data.start_position" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceBiome from '../../interface/biome.vue';
import interfaceDistance from '../../interface/distance.vue';
import interfaceEntity from '../../interface/entityPlayer.vue';

import type { fall_from_height } from '../../../interfaces/1.20';
import type { biome } from '../../../model';

export default defineComponent({
	name: 'Tab',
	components: {
		interfaceBiome,
		interfaceDistance,
		interfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<fall_from_height>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<fall_from_height>({
			player: props.modelValue.player ?? null,
			start_position: props.modelValue.start_position ?? {} as biome,
			distance: props.modelValue.distance ?? null
		} as fall_from_height);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>