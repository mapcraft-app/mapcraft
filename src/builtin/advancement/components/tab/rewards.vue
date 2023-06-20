<template>
	<div class="column">
		<q-input
			v-model.number="selectedAdvancement.child.data.rewards.experience"
			class="q-pa-sm"
			type="number"
			min="0"
			:label="$capitalize($t('builtin.advancement.tab.rewards.experience'))"
		/>
		<q-card square flat bordered class="q-pa-sm q-mb-sm">
			<div class="row justify-center q-mb-sm">
				<span class="text-h6 text-weight-regular">{{ $capitalize($t('builtin.advancement.tab.rewards.recipes')) }}</span>
			</div>
			<string-array v-model="selectedAdvancement.child.data.rewards.recipes" />
		</q-card>
		<q-card square flat bordered class="q-pa-sm">
			<div class="row justify-center q-mb-sm">
				<span class="text-h6 text-weight-regular">{{ $capitalize($t('builtin.advancement.tab.rewards.loot')) }}</span>
			</div>
			<string-array v-model="selectedAdvancement.child.data.rewards.loot" />
		</q-card>
		<q-input
			v-model="selectedAdvancement.child.data.rewards.function"
			class="q-pa-sm"
			:label="$capitalize($t('builtin.advancement.tab.rewards.function'))"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, watch } from 'vue';
import { selectedAdvancement } from '../../lib/handleAdv';
import type { rewards } from '../../model';
import StringArray from './stringArray.vue';

export default defineComponent({
	name: 'Rewards',
	components: {
		StringArray
	},
	setup () {
		onBeforeMount(() => {
			if (!selectedAdvancement.value.child.data.rewards)
				selectedAdvancement.value.child.data.rewards = {} as rewards;
			watch(selectedAdvancement.value.child.data.rewards, (newVal, oldVal) => {
				if (newVal.function !== oldVal.function) {
					if (newVal.function && !/^[a-z\d_\-.]+:/m.test(newVal.function))
						selectedAdvancement.value.child.data.rewards.function = `minecraft:${newVal.function}`;
					else
						selectedAdvancement.value.child.data.rewards.function = newVal.function;
				}
			}, { deep: true });
		});

		return {
			selectedAdvancement
		};
	}
});
</script>
