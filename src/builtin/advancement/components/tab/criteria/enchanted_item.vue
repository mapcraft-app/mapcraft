<template>
	<interface-item v-model="data.item" />
	<type-number-range v-model="data.levels" :label="$capitalize($t('builtin.advancement.interface.entityPlayer.level'))" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceItem from '../../interface/item.vue';
import TypeNumberRange from '../../type/numberRange.vue';
import { enchanted_item } from '../../../interfaces/1.17_1.19';
import { item } from '../../../model';

export default defineComponent({
	name: 'TabEnchantedItem',
	components: {
		InterfaceItem,
		TypeNumberRange
	},
	props: {
		modelValue: {
			type: Object as PropType<enchanted_item>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<enchanted_item>({
			item: props.modelValue.item ?? {} as item,
			levels: props.modelValue.levels ?? 0
		} as enchanted_item);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
