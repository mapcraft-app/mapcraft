<template>
	<div class="q-ma-md">
		<span class="text-h6 q-pb-sm">
			{{ name }}
		</span>
		<q-separator />
	</div>
	<div class="craft">
		<div class="craft_background">
			<div class="recipes_cases_furnace">
				<case-vue
					:data="recipe.recipe"
					@remove="removeSelect('recipe')"
					@select="openSelect('recipe')"
				/>
				<img
					class="craft_fire_and_cross"
					:src="$toPublic('imgs/minecraft/fire.png')"
				/>
				<div class="case-disabled"></div>
			</div>
			<img class="craft_arrow" :src="$toPublic('imgs/minecraft/arrow.png')" />
			<case-vue
				:data="recipe.result"
				@remove="removeSelect('result')"
				@select="openSelect('result')"
			/>
		</div>
	</div>
	<option-furnace-vue :config="recipe.options" />
	<optionButtonVue
		@create="createRecipe"
		@delete="deleteRecipe"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRaw, watch, type PropType } from 'vue';
import { selectedRecipeData, selectedRecipeName } from '../store';
import type { caseData, furnaceTable, typeFurnace } from '../interface';
import caseVue from './case.vue';
import optionFurnaceVue from './optionFurnace.vue';
import optionButtonVue from './optionButton.vue';

export default defineComponent({
	name: 'Furnace',
	components: { caseVue, optionFurnaceVue, optionButtonVue },
	props: {
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String as PropType<typeFurnace>,
			required: true
		},
		selection: {
			type: Object as PropType<{
				type: 'block' | 'item',
				id: string,
				path: string,
				case: number
			}>,
			default: undefined,
			required: false
		}
	},
	emits: ['openDialog', 'create', 'error', 'delete'],
	setup (props, { emit }) {
		const recipe = ref<furnaceTable>({
			recipe: {} as caseData,
			result: {} as caseData,
			options: {
				experience: 0,
				time: 0
			}
		});

		const removeSelect = (id: string) => {
			(recipe.value as Record<string, any>)[id] = { type: 'block', id: '', path: '' };
		};

		const openSelect = (id: string) => emit('openDialog', { type: 'recipe', id });

		const readData = () => {
			if (
				!selectedRecipeData.value
				|| (selectedRecipeData.value as any).type !== props.type
			)
				return;
			try {
				recipe.value = window.recipe.read.furnace(
					selectedRecipeName.value as string,
					toRaw(selectedRecipeData.value)
				);
			} catch {
				recipe.value = {
					recipe: {} as caseData,
					result: {} as caseData,
					options: {
						experience: 0,
						time: 0
					}
				};
			}
		};

		const createRecipe = () => window.recipe.generate.furnace({
			type: props.type,
			recipe: recipe.value.recipe.id,
			result: recipe.value.result.id,
			options: {
				experience: recipe.value.options.experience,
				time: recipe.value.options.time,
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
.recipes_cases_furnace {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
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
.craft_fire_and_cross {
	width: 3em;
	height: 3em;
	margin-top: .5em;
	margin-bottom: .5em;
	image-rendering: -webkit-crisp-edges;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
	image-rendering: pixelated;
	-ms-interpolation-mode: nearest-neighbor;
}
</style>
