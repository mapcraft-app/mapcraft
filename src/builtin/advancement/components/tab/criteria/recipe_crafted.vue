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
		:label="$capitalize($t('builtin.advancement.tab.recipe_crafted.recipeId'))"
		class="q-ma-xs"
	/>
	<type-ingredients v-model="data.ingredients" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import interfaceEntity from '../../interface/entityPlayer.vue';
import typeIngredients from '../../type/ingredients.vue';

import type { recipe_crafted } from '../../../interfaces/1.20';

export default defineComponent({
	name: 'TabRecipeCrafted',
	components: {
		interfaceEntity,
		typeIngredients
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