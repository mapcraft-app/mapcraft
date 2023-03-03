<template>
	<block v-model="data.block" :block="true" :item="false"/>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="category"
			:label="$capitalize($t('builtin.advancement.interface.item.item'))"
			class="q-ma-xs"
		>
			<item v-model="data.item" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="location_on"
			:label="$capitalize($t('builtin.advancement.trigger.location'))"
			class="q-ma-xs"
		>
			<biome v-model="data.location" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Item from '../../interface/item.vue';
import Biome from '../../interface/biome.vue';
import Block from '../../select/blockItem.vue';
import { placed_block } from '../../../conditions';
import { biome, item } from '../../../model';

export default defineComponent({
	name: 'TabPlacedBlock',
	components: {
		Item,
		Biome,
		Block
	},
	props: {
		modelValue: {
			type: Object as PropType<placed_block>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<placed_block>({
			item: props.modelValue.item ?? {} as item,
			location: props.modelValue.location ?? {} as biome,
			block: props.modelValue.block ?? null
		} as placed_block);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
