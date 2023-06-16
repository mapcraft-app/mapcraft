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
	</q-list>
	<q-input
		v-model="data.recipe_id"
		:label="$capitalize($t('builtin.advancement.interface.entityPlayer.player'))"
		class="q-ma-xs"
	/>
	
	<q-separator />
	
	<span class="text-h6">{{ $capitalize($t('builtin.advancement.tab.recipe_crafted.ingredients')) }}</span>
	<div v-if="data.ingredients" class="flex">
		<q-card
			v-for="(el, i) in data.ingredients"
			:key="i"
		>
			<q-input
				v-model="data.ingredients[i].tag"
				:label="$capitalize($t('builtin.advancement.interface.common.tag'))"
			/>
			<number-range
				v-model="data.ingredients[i].count"
				:label="$capitalize($t('builtin.advancement.interface.item.count'))"
			/>
			<number-range
				v-model="data.ingredients[i].durability"
				:label="$capitalize($t('builtin.advancement.interface.item.durability'))"
			/>
			<potion
				v-model="data.ingredients[i].potion"
				:label="$capitalize($t('builtin.advancement.interface.item.potion'))"
			/>
			<q-input
				v-model="data.ingredients[i].nbt"
				:label="$capitalize($t('builtin.advancement.interface.common.nbt'))"
			/>

			<span class="text-h6">
				{{ $capitalize($t('builtin.advancement.interface.item.enchantements')) }}
			</span>

			<enchantement v-model="data.ingredients[i].enchantments" />
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import numberRange from '../../type/numberRange.vue';
import potion from '../../select/potion.vue';
import enchantement from '../../interface/enchantement.vue';

import type { recipe_crafted } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'Tab',
	components: {
		interfaceEntity,
		numberRange,
		potion,
		enchantement
	},
	props: {
		modelValue: {
			type: Object as PropType<recipe_crafted>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<recipe_crafted>({
			player: props.modelValue.player ?? null,
			recipe_id: props.modelValue.recipe_id ?? '',
			ingredients: props.modelValue.ingredients ?? []
		} as recipe_crafted);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>