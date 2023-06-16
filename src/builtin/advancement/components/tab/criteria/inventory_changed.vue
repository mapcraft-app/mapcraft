<template>
	<div class="full-width text-center">
		<span class="text-h6 text-weight-light">{{ $capitalize($t('builtin.advancement.interface.item.items')) }}</span>
	</div>
	<q-list bordered class="q-mt-sm">
		<q-btn
			icon="add" class="full-width"
			unelevated outline color="green"
			@click="() => addItem()"
		/>
		<q-expansion-item
			v-for="(_i, index) of data.items"
			:key="index"
			expand-separator
			icon="category"
			:label="$capitalize($t('builtin.advancement.tab.inventoryChanged.item', { x: index + 1 }))"
			class="q-ma-xs"
		>
			<q-btn
				icon="remove" class="full-width q-ma-md"
				unelevated outline color="red"
				@click="() => removeItem(index)"
			/>
			<interface-item v-model="data.items[index]" />
		</q-expansion-item>
	</q-list>
	<q-separator class="q-mt-sm q-mb-sm" />
	<div class="full-width text-center">
		<span class="text-h6 text-weight-light">{{ $capitalize($t('builtin.advancement.interface.slot.slot')) }}</span>
	</div>
	<interface-slot v-model="data.slots" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceSlot from '../../interface/slot.vue';
import InterfaceItem from '../../interface/item.vue';
import { inventory_changed } from '../../../interfaces/1.17_1.19';
import { item, slot } from '../../../model';

export default defineComponent({
	name: 'TabInventoryChanged',
	components: {
		InterfaceSlot,
		InterfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<inventory_changed>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<inventory_changed>({
			items: [ ...props.modelValue.items ?? [] ] as item[],
			slots: props.modelValue.slots ?? {} as slot
		} as inventory_changed);

		const addItem = () => data.value.items.push({} as item);
		const removeItem = (id: number) => data.value.items.splice(id, 1);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data,
			addItem,
			removeItem
		};
	}
});
</script>
