<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.select.entity'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.entity" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="category"
			:label="$capitalize($t('builtin.advancement.select.item'))"
			class="q-ma-xs"
		>
			<interface-item v-model="data.item" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="phishing"
			:label="$capitalize($t('builtin.advancement.tab.fishingRodHooked.rod'))"
			class="q-ma-xs"
		>
			<interface-item v-model="data.rod" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceEntity from '../../interface/entityPlayer.vue';
import InterfaceItem from '../../interface/item.vue';
import { fishing_rod_hooked } from '../../../interfaces/1.17_1.19';
import { entity, item } from '../../../model';

export default defineComponent({
	name: 'TabFishingRodHooked',
	components: {
		InterfaceEntity,
		InterfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<fishing_rod_hooked>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<fishing_rod_hooked>({
			entity: props.modelValue.entity ?? {} as entity,
			item: props.modelValue.item ?? {} as item,
			rod: props.modelValue.rod ?? {} as item
		} as fishing_rod_hooked);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
