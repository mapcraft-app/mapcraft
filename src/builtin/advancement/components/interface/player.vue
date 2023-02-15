<template>
	<select-gamemode v-model="data.gamemode" />
	<q-input v-model="data.team" label="Team" />
	<div class="column items-center">
		<span class="text-body2 q-pt-sm">Level</span>
		<type-number-range v-model="data.level" />
	</div>
	<q-card bordered square flat class="q-pa-sm column justify-center items-center q-mt-sm q-mb-sm">
		<span class="text-center">Recipes</span>
		<type-recipe v-model="data.recipes" />
	</q-card>
	<q-card bordered square flat class="q-pa-sm column justify-center items-center q-mt-sm q-mb-sm">
		<span class="text-center">Advancements</span>
		<type-state v-model="data.advancements" />
	</q-card>
	<q-card bordered square flat class="q-pa-sm column justify-center items-center q-mt-sm q-mb-sm">
		<span class="text-center">Stats</span>
		<type-stats v-model="data.stats" />
	</q-card>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			label="Targeted Entity"
		>
			<div class="column q-pa-sm">
				<interface-entity v-model="data.targeted_entity" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Looking At"
		>
			<div class="column q-pa-sm">
				<interface-entity v-model="data.looking_at" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Vehicle"
		>
			<div class="column q-pa-sm">
				<interface-entity v-model="data.vehicle" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Stepping On"
		>
			<div class="column q-pa-sm">
				<interface-biome v-model="data.stepping_on" />
			</div>
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceBiome from './biome.vue';
import InterfaceEntity from './entity.vue';
import SelectGamemode from '../select/gamemode.vue';
import TypeNumberRange from '../type/numberRange.vue';
import TypeRecipe from '../type/recipe.vue';
import TypeState from '../type/state.vue';
import TypeStats from '../type/stats.vue';
import { player } from '../../model';

export default defineComponent({
	name: 'InterfacePlayer',
	components: {
		InterfaceBiome,
		SelectGamemode,
		InterfaceEntity,
		TypeNumberRange,
		TypeRecipe,
		TypeState,
		TypeStats
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<player | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<player>({
			gamemode: props.modelValue?.gamemode ?? null,
			team: props.modelValue?.team ?? null,
			level: props.modelValue?.level ?? null,
			recipes: props.modelValue?.recipes ?? null,
			advancements: props.modelValue?.advancements ?? null,
			stats: props.modelValue?.stats ?? null,
			targeted_entity: props.modelValue?.targeted_entity ?? null,
			looking_at: props.modelValue?.looking_at ?? null,
			vehicle: props.modelValue?.vehicle ?? null,
			stepping_on: props.modelValue?.stepping_on ?? null
		} as player);
		
		/*const addEntity = () => {
			const component = Vue.extend()
		};*/

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

<style scoped>

</style>
