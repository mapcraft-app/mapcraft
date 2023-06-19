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
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import interfaceItem from '../../interface/item.vue';

import type { using_item } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'TabUsingItem',
	components: {
		interfaceEntity,
		interfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<using_item>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<using_item>({
			player: props.modelValue.player ?? null,
			item: props.modelValue.item ?? null
		} as using_item);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>