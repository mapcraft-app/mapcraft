<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="holiday_village"
			:label="$capitalize($t('builtin.advancement.tab.villagerTrade.villager'))"
			class="q-ma-xs"
		>
			<entity v-model="data.villager" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="category"
			:label="$capitalize($t('builtin.advancement.select.item'))"
			class="q-ma-xs"
		>
			<item v-model="data.item" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Item from '../../interface/item.vue';
import Entity from '../../interface/entityPlayer.vue';
import { villager_trade } from '../../../conditions';
import { entity, item } from '../../../model';

export default defineComponent({
	name: 'TabVillagerTrade',
	components: {
		Item,
		Entity
	},
	props: {
		modelValue: {
			type: Object as PropType<villager_trade>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<villager_trade>({
			item: props.modelValue.item ?? {} as item,
			villager: props.modelValue.villager ?? {} as entity
		} as villager_trade);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
