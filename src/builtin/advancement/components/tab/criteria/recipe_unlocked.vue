<template>
	<q-input
		v-model="data.recipe"
		:label="$capitalize($t('builtin.advancement.type.recipe'))"
	/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';

import { recipe_unlocked } from '../../../conditions';

export default defineComponent({
	name: 'TabRecipeUnlocked',
	components: {

	},
	props: {
		modelValue: {
			type: Object as PropType<recipe_unlocked>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<recipe_unlocked>({
			recipe: props.modelValue.recipe ?? null
		} as recipe_unlocked);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
