<template>
	<div class="row justify-around">
		<number-range v-model="data.delta" :label="$capitalize($t('builtin.advancement.interface.item.delta'))" />
		<number-range v-model="data.durability" :label="$capitalize($t('builtin.advancement.interface.item.durability'))" />
	</div>
	<q-separator class="q-mt-sm q-mb-sm" />
	<div class="full-width text-center">
		<span class="text-h6 text-weight-light">{{ $capitalize($t('builtin.advancement.interface.item.items')) }}</span>
	</div>
	<interface-item v-model="data.item" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import NumberRange from '../../type/numberRange.vue';
import InterfaceItem from '../../interface/item.vue';
import { item_durability_changed } from '../../../interfaces/1.17_1.19';
import { item } from '../../../model';

export default defineComponent({
	name: 'TabItemDurabilityChanged',
	components: {
		NumberRange,
		InterfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<item_durability_changed>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<item_durability_changed>({
			delta: props.modelValue.delta ?? 0,
			durability: props.modelValue.durability ?? 0,
			item: props.modelValue.item ?? {} as item
		} as item_durability_changed);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
