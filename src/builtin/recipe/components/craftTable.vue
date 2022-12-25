<template>
	<div class="q-ma-md">
		<span class="text-h6 q-pb-sm">Crafting table</span>
		<q-separator />
	</div>
	<div class="craft">
		<div class="craft_background">
			<div class="recipes_cases_3x3">
				<template v-for="i in 9" :key="i">
					<case-vue :data="recipeCases[i - 1]" @remove="removeSelect(i - 1)" @select="openSelect(i - 1)" />
				</template>
			</div>
			<img class="craft_arrow" src="imgs/minecraft/arrow.png"/>
			<div class="craft_result">
				<case-vue :data="recipeCases[9]" @remove="removeSelect(9)" @select="openSelect(9)" />
				<q-input
					v-model.number="count"
					input-class="input-reduce"
					square filled dense
					class="input" type="number" value="1"
					min="1" max="64" step="1"
				/>
			</div>
		</div>
	</div>
	<option-table-vue
		:config="options"
		@change="changeOptions"
	/>
	<optionButtonVue
		@create="createRecipe"
		@delete="deleteRecipe"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import random from './random';
import type { PropType } from 'vue';
import { caseData, resultTable } from '../interface';
import caseVue from './case.vue';
import optionButtonVue from './optionButton.vue';
import optionTableVue from './optionTable.vue';

export default defineComponent({
	name: 'CraftTable',
	components: { caseVue, optionButtonVue, optionTableVue },
	props: {
		read: {
			type: Object as PropType<resultTable>,
			default: undefined,
			required: false
		},
		selection: {
			type: Object as PropType<{ type: 'block' | 'item', id: string, path: string, case: number }>,
			default: undefined,
			required: false
		}
	},
	emits: ['openDialog', 'create', 'delete'],
	setup (props, { emit }) {
		const recipeCases = ref<(caseData)[]>([
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' },
			{ type: 'block', id: '', path: '' }
		]);
		const count = ref<number>(0);
		const isSelected = ref<boolean>(false);
		const options = ref<{ shapeless: boolean, exactPosition: boolean, group: string | null, outputName: string | null }>({
			shapeless: false,
			exactPosition: false,
			group: null,
			outputName: random()
		});

		const removeSelect = (id: number) => {
			recipeCases.value[id] = { type: 'block', id: '', path: '' };
		};

		const openSelect = (id: number) => {
			isSelected.value = true;
			emit('openDialog', { type: 'recipe', id });
		};

		const changeOptions = (d: { shapeless: boolean, exactPosition: boolean, group: string | null, outputName: string | null }) => {
			options.value.exactPosition = d.exactPosition;
			options.value.group = d.group;
			options.value.outputName = d.outputName;
			options.value.shapeless = d.shapeless;
		};

		const createRecipe = () => {
			emit('create', {
				recipes: recipeCases.value.slice(0, 9).map((e) => e.id),
				result: recipeCases.value[9].id,
				count: count.value,
				options: {
					shapeless: options.value.shapeless,
					exactPosition: options.value.exactPosition,
					group: options.value.group,
					outputName: options.value.outputName
				}
			});
		};

		const deleteRecipe = () => {
			emit('delete', options.value.outputName);
		};

		onMounted(() => {
			watch(() => props.read, (after) => {
				if (!after)
					return;
				recipeCases.value = after.cases;
				count.value = after.result.count;
				changeOptions({
					shapeless: false,
					exactPosition: after.options.exact,
					group: after.options.group ?? null,
					outputName: after.options.outputName ?? null
				});
			});

			watch(() => props.selection, (after) => {
				if (after && isSelected.value) {
					console.log(after);
					isSelected.value = false;
					recipeCases.value[after.case] = after;
				}
			});
		});

		return {
			recipeCases,
			count,
			isSelected,
			options,

			removeSelect,
			openSelect,
			changeOptions,
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
.q-field__control {
	padding: 0 4px !important;
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
.recipes_cases_3x3 {
	display: flex;
	width: 13em;
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
