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
			icon="radar"
			:label="$capitalize($t('builtin.advancement.tab.rideEntityInLava.startPosition'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.entity" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="radar"
			:label="$capitalize($t('builtin.advancement.interface.tab.entityPlayer.distance'))"
			class="q-ma-xs"
		>
			<interface-item v-model="data.item" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import interfaceItem from '../../interface/item.vue';

import type { thrown_item_picked_up_by_player } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'Tab',
	components: {
		interfaceEntity,
		interfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<thrown_item_picked_up_by_player>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<thrown_item_picked_up_by_player>({
			player: props.modelValue.player ?? null,
			entity: props.modelValue.entity ?? null,
			item: props.modelValue.item ?? null
		} as thrown_item_picked_up_by_player);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>