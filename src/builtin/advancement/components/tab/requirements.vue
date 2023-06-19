<template>
	<div class="column items-center">
		<template v-if="isCriteria">
			<q-btn
				color="green" outline icon="add"
				class="full-width"
				@click="() => addRequirement()"
			/>
			<template
				v-for="(_el, i) of selectedAdvancement.child.data.requirements"
				:key="i"
			>
				<div class="line row justify-around q-ma-sm q-pa-md">
					<q-btn
						square unelevated color="red"
						icon="remove" size="1em" padding=".1em"
						@click="() => removeRequirement(i)"
					/>
					<q-option-group
						v-model="selectedAdvancement.child.data.requirements[i]"
						:options="options"
						type="checkbox"
						inline
					/>
				</div>
				<q-badge v-if="selectedAdvancement.child.data.requirements.length - 1 > i" color="purple">
					{{ $t('builtin.advancement.tab.requirements.and').toUpperCase() }}
				</q-badge>
			</template>
		</template>
		<template v-else>
			<span class="full-width text-center">
				{{ $capitalize($t('builtin.advancement.tab.requirements.no')) }}</span>
		</template>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue';
import { selectedAdvancement } from '../../lib/handleAdv';

export default defineComponent({
	name: 'TabRequirements',
	setup () {
		const options = computed(() => selectedAdvancement.value.child.data.criteria.map((e) => ({ label: e.name, value: e.name })));
		const isCriteria = computed(() => selectedAdvancement.value.child.data.criteria && selectedAdvancement.value.child.data.criteria.length);

		const addRequirement = () => selectedAdvancement.value.child.data.requirements.push([]);
		const removeRequirement = (i: number) => selectedAdvancement.value.child.data.requirements.splice(i, 1);

		onBeforeMount(() => {
			if (!selectedAdvancement.value.child.data.requirements || !selectedAdvancement.value.child.data.requirements.length)
				selectedAdvancement.value.child.data.requirements = [];
		});

		return {
			selectedAdvancement,
			options,
			isCriteria,

			addRequirement,
			removeRequirement
		};
	}
});
</script>

<style scoped>
.line {
	position: relative;
	width: 100%;
	border: 1px solid rgba(150, 150, 150, .5);
}
.line > button {
	position: absolute;
	right: 0;
	top: 0;
	width: 25px;
}
</style>
