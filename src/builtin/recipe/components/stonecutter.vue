<template>
	<div class="q-ma-md">
		<span class="text-h6 q-pb-sm">Stonecutter</span>
		<q-separator />
	</div>
	<div class="craft">
		<div class="craft_background">
			<case-vue :data="recipeCases[0]" @remove="removeSelect(0)" @select="openSelect(0)" />
			<img class="craft_arrow" src="imgs/minecraft/arrow.png"/>
			<div class="craft_result">
				<case-vue :data="recipeCases[1]" @remove="removeSelect(1)" @select="openSelect(1)" />
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
	<optionButtonVue
		@create="createRecipe"
		@delete="deleteRecipe"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import random from './random';
import type { PropType } from 'vue';
import { caseData, stonecutterGen } from '../interface';

import caseVue from './case.vue';
import optionButtonVue from './optionButton.vue';

interface options {
	group: string | null,
	outputName: string | null
}

export default defineComponent({
	name: 'Stonecutter',
	components: { caseVue, optionButtonVue },
	props: {
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
		const count = ref<number>(0);
		const isSelected = ref<boolean>(false);
		const options = ref<options>({
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
			options.value.group = d.group;
			options.value.outputName = d.outputName;
		};

		const createRecipe = () => {
			emit('create', {
				recipe: recipeCases.value[0].id,
				result: recipeCases.value[1].id,
				count: count.value,
				group: options.value.group,
				outputName: options.value.outputName
			} as stonecutterGen);
		};
		const deleteRecipe = () => {
			emit('delete', options.value.outputName);
		};

		onMounted(() => {
			watch(() => props.selection, (after) => {
				if (after && isSelected.value) {
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
