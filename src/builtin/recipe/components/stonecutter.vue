<template>
	<div class="q-ma-md">
		<span class="text-h6 q-pb-sm">
			{{ $capitalize($t('builtin.recipe.tabs.stonecutter')) }}
		</span>
		<q-separator />
	</div>
	<div class="craft">
		<div class="craft_background">
			<case-vue
				:data="recipe.recipe"
				@remove="removeSelect('recipe')"
				@select="openSelect('recipe')"
			/>
			<img
				class="craft_arrow"
				:src="$toPublic('imgs/minecraft/arrow.png')"
			/>
			<div class="craft_result">
				<case-vue
					:data="recipe.result"
					@remove="removeSelect('result')"
					@select="openSelect('result')"
				/>
				<q-input
					v-model.number="recipe.count"
					input-class="input-reduce"
					square filled dense
					class="input" type="number" value="1"
					min="1" max="64" step="1"
				/>
			</div>
		</div>
	</div>
	<option-base :config="recipe" />
	<optionButtonVue
		@create="createRecipe"
		@delete="deleteRecipe"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRaw, watch } from 'vue';
import type { PropType } from 'vue';
import { caseData, stonecutterTable } from '../interface';
import caseVue from './case.vue';
import optionButtonVue from './optionButton.vue';
import optionBase from './optionBase.vue';
import { selectedRecipeData, selectedRecipeName } from '../store';

export default defineComponent({
	name: 'Stonecutter',
	components: { caseVue, optionButtonVue, optionBase },
	props: {
		read: {
			type: Object as PropType<stonecutterTable>,
			default: undefined,
			required: false
		},
		selection: {
			type: Object as PropType<{ type: 'block' | 'item', id: string, path: string, case: number }>,
			default: undefined,
			required: false
		}
	},
	emits: ['openDialog', 'create', 'error', 'delete'],
	setup (props, { emit }) {
		const recipe = ref<stonecutterTable>({
			recipe: {} as caseData,
			result: {} as caseData,
			count: 0
		});
		
		const removeSelect = (id: string) => {
			(recipe.value as Record<string, any>)[id] = { type: 'block', id: '', path: '' };
		};

		const openSelect = (id: string) => emit('openDialog', { type: 'recipe', id });

		const readData = () => {
			if (
				!selectedRecipeData.value
				|| (selectedRecipeData.value as any).type !== 'minecraft:stonecutting'
			)
				return;
			try {
				recipe.value = window.recipe.read.stonecutter(
					selectedRecipeName.value as string,
					toRaw(selectedRecipeData.value)
				);
			} catch {
				recipe.value = {
					recipe: {} as caseData,
					result: {} as caseData,
					count: 0
				};
			}
		};

		const createRecipe = () => window.recipe.generate.stonecutter({
			recipe: recipe.value.recipe.id,
			result: recipe.value.result.id,
			count: recipe.value.count,
			group: recipe.value.group,
			outputName: recipe.value.outputName
		})
			.then(() => emit('create', recipe.value.outputName))
			.catch((e) => {
				window.log.error('table', e);
				emit('error', recipe.value.outputName);
			});

		const deleteRecipe = () => emit('delete', recipe.value.outputName);

		onMounted(() => {
			readData();
			watch(() => selectedRecipeName.value, () => readData());
			watch(() => props.selection, (after) => {
				if (after)
					(recipe.value as Record<string, any>)[after.case] = after;
			});
		});

		return {
			recipe,
			removeSelect,
			openSelect,
			createRecipe,
			deleteRecipe
		};
	}
});
</script>

<style scoped>
.input {
	position: absolute;
	width: 4em;
	margin-top: 4.5em;
}
.craft {
	display: flex;
	justify-content: center;
}
.craft_background {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	background-color: #c6c7c6;
	height: 250px;
	margin: 0 5em;
	max-width: 480px;
	min-width: 480px;
	border: 5px inset;
}
.case-disabled {
	background-color: #4e4e4e;
	width: 4em;
	height: 4em;
	margin: 0.15em;
	text-align: center;
}
.case {
	background-color: #8c8a8c;
	width: 4em;
	height: 4em;
	margin: 0.15em;
	text-align: center;
	cursor: pointer;
}
.case img {
	position: relative;
	max-width: 4em;
	max-height: 4em;
	transform: translateY(-50%);
	top: 50%;
}
.case:hover {
	background-color: rgba(24, 26, 27, 0.5);
}
.craft_arrow {
	width: 5em;
	height: 5em;
	image-rendering: -webkit-crisp-edges;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
	image-rendering: pixelated;
	-ms-interpolation-mode: nearest-neighbor;
}
.craft_result {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
}
</style>
