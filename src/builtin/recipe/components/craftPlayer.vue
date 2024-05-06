<template>
	<div class="q-ma-md">
		<span class="text-h6 q-pb-sm">{{ $capitalize($t('builtin.recipe.tabs.player')) }}</span>
		<q-separator />
	</div>
	<div class="craft">
		<div class="craft_background">
			<div class="recipes_cases_2x2">
				<template v-for="i in 4" :key="i">
					<case-vue 
						:data="recipe.cases[i - 1]"
						@remove="removeSelect(i - 1)"
						@select="openSelect(i - 1)"
					/>
				</template>
			</div>
			<img class="craft_arrow" :src="$toPublic('imgs/minecraft/arrow.png')"/>
			<div class="craft_result">
				<case-vue
					:data="recipe.cases[4]"
					@remove="removeSelect(4)"
					@select="openSelect(4)"
				/>
				<q-input
					v-model.number="recipe.result.count"
					input-class="input-reduce"
					square filled dense
					class="input" type="number" value="1"
					min="1" max="64" step="1"
				/>
			</div>
		</div>
	</div>
	<option-table-vue :config="recipe.options" />
	<optionButtonVue
		@create="createRecipe"
		@delete="deleteRecipe"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRaw, watch, type PropType } from 'vue';
import { selectedRecipeData, selectedRecipeName } from '../store';
import { resultTable } from '../interface';

import caseVue from './case.vue';
import optionButtonVue from './optionButton.vue';
import optionTableVue from './optionTable.vue';

export default defineComponent({
	name: 'CraftPlayer',
	components: { caseVue, optionButtonVue, optionTableVue },
	props: {
		selection: {
			type: Object as PropType<{ type: 'block' | 'item', id: string, path: string, case: number }>,
			default: undefined,
			required: false
		}
	},
	emits: ['openDialog', 'create', 'error', 'delete'],
	setup (props, { emit }) {
		const recipe = ref<resultTable>({
			cases: [],
			result: {
				item: {} as any,
				count: 0
			},
			options: {
				exact: false
			}
		});

		const readData = () => {
			if (
				!selectedRecipeData.value
				|| !['player'].includes((selectedRecipeData.value as any).type)
			)
				return;
			try {
				recipe.value = window.recipe.read.table(
					selectedRecipeName.value as string,
					toRaw(selectedRecipeData.value)
				);
			} catch {
				recipe.value = {
					cases: [],
					result: {
						item: {} as any,
						count: 0
					},
					options: {
						exact: false
					}
				};
			}
		};

		const removeSelect = (id: number) => {
			if (recipe.value)
				recipe.value.cases[id] = { type: 'block', id: '', path: '' };
		};

		const openSelect = (id: number) => emit('openDialog', { type: 'recipe', id });

		const createRecipe = () => window.recipe.generate.table({
			recipes: recipe.value.cases.slice(0, 4).map((e) => e.id),
			result: recipe.value.cases[4].id,
			count: recipe.value.result.count,
			options: {
				shapeless: (recipe.value.options.exact === false),
				exactPosition: (recipe.value.options.exact === true),
				group: recipe.value.options.group ?? null,
				outputName: recipe.value.options.outputName ?? null
			}
		})
			.then(() => emit('create', recipe.value.options.outputName))
			.catch((e) => {
				window.log.error('table', e);
				emit('error', recipe.value.options.outputName);
			});

		const deleteRecipe = () => emit('delete', recipe.value.options.outputName);

		onMounted(() => {
			readData();
			watch(() => selectedRecipeName.value, () => readData());
			watch(() => props.selection, (after) => {
				if (after)
					recipe.value.cases[after.case] = after;
			});
		});

		return {
			selectedRecipeData,
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
	z-index:auto;
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
.recipes_cases_2x2 {
	display: flex;
	width: 9em;
	flex-direction: row;
	flex-wrap: wrap;
	align-content: center;
}
.case-disabled {
	background-color: #4e4e4e;
	width: 4em;
	height: 4em;
	margin: 0.15em;
	text-align: center;
}
.case {
	position: relative;
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
