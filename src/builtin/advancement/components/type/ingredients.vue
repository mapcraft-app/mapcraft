<template>
	<div class="full-width column justify-center width">
		<span class="text-h6 text-center q-pb-sm">
			{{ $capitalize($t('builtin.advancement.tab.recipe_crafted.ingredients')) }}
		</span>
		<q-btn
			icon="add" color="green-7" outline
			class="max-width"
			@click="addIngredient"
		/>
		<template
			v-for="(_el, i) in ingredients"
			:key="i"
		>
			<q-card class="column full-width q-pa-xs q-mt-sm q-mb-sm">
				<q-btn
					outline color="red"
					icon="delete"
					class="full-width"
					@click="removeIngredient(i)"
				/>
				<number-range
					v-model="ingredients[i].count"
					:label="$capitalize($t('builtin.advancement.interface.item.count'))"
				/>
				<number-range
					v-model="ingredients[i].durability"
					:label="$capitalize($t('builtin.advancement.interface.item.durability'))"
				/>
				<q-input
					v-model="ingredients[i].tag"
					:label="$capitalize($t('builtin.advancement.interface.common.tag'))"
				/>
				<q-input
					v-model="ingredients[i].nbt"
					:label="$capitalize($t('builtin.advancement.interface.common.nbt'))"
				/>
				<potion
					v-model="ingredients[i].potion"
					:label="$capitalize($t('builtin.advancement.interface.item.potion'))"
				/>

				<span class="text-h6 text-center">
					{{ $capitalize($t('builtin.advancement.interface.item.enchantements')) }}
				</span>
				<div class="row wrap">
					<enchantement v-model="ingredients[i].enchantments" />
				</div>
			</q-card>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onBeforeMount } from 'vue';
import numberRange from '../type/numberRange.vue';
import potion from '../select/potion.vue';
import enchantement from '../interface/enchantement.vue';
import { ingredient } from '../../model';

export default defineComponent({
	name: 'TypeIngredients',
	components: {
		numberRange,
		potion,
		enchantement
	},
	props: {
		modelValue: {
			type: Object as PropType<ingredient[] | null>,
			required: false,
			default: null
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const ingredients = ref<ingredient[]>([]);

		if (props.modelValue)
			ingredients.value = [ ...props.modelValue];
		const addIngredient = () => ingredients.value.push({} as ingredient);
		const removeIngredient = (i: number) => ingredients.value.splice(i, 1);
		
		onBeforeMount(() => {
			watch(ingredients, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			ingredients,
			addIngredient,
			removeIngredient
		};
	}
});
</script>
