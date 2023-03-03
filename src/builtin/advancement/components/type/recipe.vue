<template>
	<div class="column items-start width">
		<q-btn
			icon="add" color="green-7" outline
			class="max-width"
			@click="addRecipe"
		/>
		<div
			v-for="(el, i) in recipes"
			:key="i"
			class="row inline"
		>
			<q-input v-model="el.key" dense :label="$capitalize($t('builtin.advancement.type.recipe'))" class="q-pr-sm"/>
			<q-toggle v-model="el.value" class="q-pr-sm" />
			<q-btn flat color="red" icon="delete" @click="removeRecipe(i)"/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onBeforeMount } from 'vue';
import { recipe } from '../../model';

interface recipeInterface {
	key: string,
	value: boolean
}

export default defineComponent({
	name: 'TypeRecipe',
	props: {
		modelValue: {
			type: Object as PropType<recipe | null>,
			required: false,
			default: null
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const recipes = ref<recipeInterface[]>([]);
		if (props.modelValue) {
			for (const key in props.modelValue)
				recipes.value.push({ key, value: props.modelValue[key] });
		}

		const addRecipe = () => recipes.value.push({ key: '', value: false });

		const removeRecipe = (i: number) => recipes.value.splice(i, 1);
		
		onBeforeMount(() => {
			watch(recipes, (after) => {
				if (after) {
					const ret: recipe = {};
					for (const el of recipes.value) {
						if (el.key)
							ret[el.key] = el.value ?? false;
					}
					emit('update:modelValue', ret);
				}
			}, { deep: true });
		});

		return {
			recipes,

			addRecipe,
			removeRecipe
		};
	}
});
</script>

<style scoped>
.width {
	width: 390px;
}
.max-width {
	width: 100%;
}
</style>