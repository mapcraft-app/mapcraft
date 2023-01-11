<template>
	<div class="q-ma-md">
		<span class="text-h6 q-pb-sm">{{ name }}</span>
		<q-separator />
	</div>
	<div class="craft">
		<div class="craft_background">
			<div class="recipes_cases_furnace">
				<case-vue :data="recipeCases[0]" @remove="removeSelect(0)" @select="openSelect(0)" />
				<img class="craft_fire_and_cross" :src="$toPublic('imgs/minecraft/fire.png')"/>
				<div class="case-disabled"></div>
			</div>
			<img class="craft_arrow" :src="$toPublic('imgs/minecraft/arrow.png')"/>
			<case-vue :data="recipeCases[1]" @remove="removeSelect(1)" @select="openSelect(1)" />
		</div>
	</div>
	<option-furnace-vue
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
import { caseData, furnaceGen, furnaceTable, typeFurnace } from '../interface';

import caseVue from './case.vue';
import optionFurnaceVue from './optionFurnace.vue';
import optionButtonVue from './optionButton.vue';

interface options {
	experience: number,
	time: number,
	group: string | null,
	outputName: string | null
}

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
		read: {
			type: Object as PropType<furnaceTable>,
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
			{ type: 'block', id: '', path: '' }
		]);
		const isSelected = ref<boolean>(false);
		const options = ref<options>({
			experience: 0.0,
			time: 0.0,
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

		const changeOptions = (d: options) => {
			options.value.experience = d.experience;
			options.value.time = d.time;
			options.value.group = d.group;
			options.value.outputName = d.outputName;
		};

		const createRecipe = () => {
			emit('create', {
				type: props.type,
				recipe: recipeCases.value[0].id,
				result: recipeCases.value[1].id,
				options: {
					experience: options.value.experience,
					time: options.value.time,
					group: options.value.group,
					outputName: options.value.outputName,
				}
			} as furnaceGen);
		};
		const deleteRecipe = () => {
			emit('delete', options.value.outputName);
		};

		onMounted(() => {
			watch(() => props.read, (after) => {
				if (!after)
					return;
				recipeCases.value[0] = after.recipe;
				recipeCases.value[1] = after.result;
				changeOptions({
					experience: after.options.experience,
					time: after.options.time,
					group: after.options.group ?? null,
					outputName: after.options.outputName ?? null
				});
			});

			watch(() => props.selection, (after) => {
				if (after && isSelected.value) {
					isSelected.value = false;
					recipeCases.value[after.case] = after;
				}
			});
		});

		return {
			recipeCases,
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
