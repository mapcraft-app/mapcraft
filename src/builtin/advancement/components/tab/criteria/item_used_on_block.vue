<template>
	<q-list bordered class="q-mt-sm">
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
import InterfaceBiome from '../../interface/biome.vue';
import InterfaceItem from '../../interface/item.vue';
import { item_used_on_block } from '../../../conditions';
import { biome, item } from '../../../model';

export default defineComponent({
	name: 'TabItemUsedOnBlock',
	components: {
		InterfaceBiome,
		InterfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<item_used_on_block>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<item_used_on_block>({
			item: props.modelValue.item ?? {} as item,
			location: props.modelValue.location ?? {} as biome
		} as item_used_on_block);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
