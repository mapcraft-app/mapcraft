<template>
	<div class="column q-gutter-sm">
		<block-item v-model="data.item" :block="false" label="Item" />
		<q-input v-model="data.nbt" label="Nbt" />
		<q-input v-model="data.tag" label="Tag" />
		<div>
			<span>Count</span>
			<number-range v-model="data.count" />
		</div>
		<div>
			<span>Durability</span>
			<number-range v-model="data.durability" />
		</div>
		<div>
			<span>Potion</span>
			<potion v-model="data.potion" />
		</div>
		<q-card bordered square flat class="q-pa-sm column align-center">
			<span class="text-center">Enchantements</span>
			<enchantement v-model="data.enchantements" />
		</q-card>
		<q-card bordered square flat class="q-pa-sm column align-center">
			<span class="text-center">Stored enchantements</span>
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
			type: [Object, null] as PropType<item | null>,
			required: true
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
			enchantements: props.modelValue?.enchantements ?? null,
			stored_enchantements: props.modelValue?.stored_enchantements ?? null
		} as item);
		
		onBeforeMount(() => {
			watch(data, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			data
		};
	}
});
</script>