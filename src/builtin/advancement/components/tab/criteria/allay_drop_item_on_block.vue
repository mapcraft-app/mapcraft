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
			icon="category"
			:label="$capitalize($t('builtin.advancement.interface.item.item'))"
			class="q-ma-xs"
		>
			<interface-item v-model="data.item" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="location_on"
			:label="$capitalize($t('builtin.advancement.trigger.location'))"
			class="q-ma-xs"
		>
			<interface-biome v-model="data.location" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import interfaceItem from '../../interface/item.vue';
import interfaceBiome from '../../interface/biome.vue';

import type { biome, item } from '../../../model';
import type { allay_drop_item_on_block } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'Tab',
	components: {
		interfaceEntity,
		interfaceItem,
		interfaceBiome
	},
	props: {
		modelValue: {
			type: Object as PropType<allay_drop_item_on_block>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<allay_drop_item_on_block>({
			player: props.modelValue.player ?? null,
			item: props.modelValue.item ?? {} as item,
			location: props.modelValue.location ?? {} as biome
		} as allay_drop_item_on_block);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>