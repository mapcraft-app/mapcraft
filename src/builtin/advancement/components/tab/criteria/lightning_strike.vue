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
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.tab.lightningStrike.lightning'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.lightning" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="person"
			:label="$capitalize($t('builtin.advancement.tab.lightningStrike.bystander'))"
			class="q-ma-xs"
		>
			<interface-entity v-model="data.bystander" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import type { lightning_strike } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'TabLightningStrike',
	components: {
		interfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<lightning_strike>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<lightning_strike>({
			player: props.modelValue.player ?? null,
			lightning: props.modelValue.lightning ?? null,
			bystander: props.modelValue.bystander ?? null
		} as lightning_strike);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>