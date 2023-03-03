<template>
	<div class="column q-gutter-sm">
		<block-item v-model="data.item" :block="false" :label="$capitalize($t('builtin.advancement.interface.item.item'))" />
		<q-input v-model="data.nbt" :label="$capitalize($t('builtin.advancement.interface.common.nbt'))" />
		<q-input v-model="data.tag" :label="$capitalize($t('builtin.advancement.interface.common.tag'))" />
		<number-range v-model="data.count" :label="$capitalize($t('builtin.advancement.interface.item.count'))" />
		<number-range v-model="data.durability" :label="$capitalize($t('builtin.advancement.interface.item.durability'))" />
		<div>
			<span>{{ $capitalize($t('builtin.advancement.interface.item.potion')) }}</span>
			<potion v-model="data.potion" />
		</div>
		<q-card bordered square flat class="q-pa-sm column align-center">
			<span class="text-center">{{ $capitalize($t('builtin.advancement.interface.item.enchantements')) }}</span>
			<enchantement v-model="data.enchantements" />
		</q-card>
		<q-card bordered square flat class="q-pa-sm column align-center">
			<span class="text-center">{{ $capitalize($t('builtin.advancement.interface.item.storedEnchantements')) }}</span>
			<enchantement v-model="data.stored_enchantements" />
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType ,ref, watch } from 'vue';
import blockItem from '../select/blockItem.vue';
import numberRange from '../type/numberRange.vue';
import potion from '../select/potion.vue';
import enchantement from './enchantement.vue';
import { item } from '../../model';

export default defineComponent({
	name: 'InterfaceItem',
	components: {
		blockItem,
		numberRange,
		potion,
		enchantement
	},
	props: {
		modelValue: {
			type: Object as PropType<item | null>,
			required: false,
			default: {} as item
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<item>({
			item: props.modelValue?.item ?? '',
			count: props.modelValue?.count ?? 0,
			durability: props.modelValue?.durability ?? 0,
			nbt: props.modelValue?.nbt ?? null,
			tag: props.modelValue?.tag ?? null,
			potion: props.modelValue?.potion ?? null,
			enchantements: props.modelValue?.enchantements ?? [],
			stored_enchantements: props.modelValue?.stored_enchantements ?? []
		} as item);
		
		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>