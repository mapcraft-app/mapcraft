<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.tab.villagerTrade.villager'))"
			class="q-pa-xs"
		>
			<interface-entity v-model="data.villager" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.tab.curedZombieVillager.zombie'))"
			class="q-pa-xs"
		>
			<interface-entity v-model="data.zombie" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceEntity from '../../interface/entityPlayer.vue';
import { cured_zombie_villager } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabCuredZombieVillager',
	components: {
		InterfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<cured_zombie_villager>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<cured_zombie_villager>({
			villager: props.modelValue.villager ?? {} as entity,
			zombie: props.modelValue.zombie ?? {} as entity
		} as cured_zombie_villager);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
