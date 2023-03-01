<template>
	<select-block-item
		v-model="data.block"
		:item="false"
		:block="true"
		label="Block"
	/>
	<q-input
		v-model.number="data.num_bees_inside"
		type="number"
		min="0"
		label="Number of bee inside"
	/>
	<span class="text-h6 text-weight-regular">Item</span>
	<interface-item v-model="data.item" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import SelectBlockItem from '../../select/blockItem.vue';
import InterfaceItem from '../../interface/item.vue';
import { bee_nest_destroyed } from '../../../conditions';
import { item } from '../../../model';

export default defineComponent({
	name: 'TabBeeNestDestroyed',
	components: {
		SelectBlockItem,
		InterfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<bee_nest_destroyed>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<bee_nest_destroyed>({
			block: props.modelValue.block ?? '',
			item: props.modelValue.item ?? {} as item,
			num_bees_inside: props.modelValue.num_bees_inside ?? null
		} as bee_nest_destroyed);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
