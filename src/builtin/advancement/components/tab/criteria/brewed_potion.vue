<template>
	<select-potion v-model="data.potion" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import SelectPotion from '../../select/potion.vue';
import { brewed_potion } from '../../../conditions';

export default defineComponent({
	name: 'TabBrewedPotion',
	components: {
		SelectPotion
	},
	props: {
		modelValue: {
			type: Object as PropType<brewed_potion>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<brewed_potion>({
			potion: props.modelValue.potion ?? 'empty'
		});

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
