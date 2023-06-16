<template>
	<item v-model="data.item" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Item from '../../interface/item.vue';
import { shot_crossbow } from '../../../interfaces/1.17_1.19';
import { item } from '../../../model';

export default defineComponent({
	name: 'TabShotCrossbow',
	components: {
		Item
	},
	props: {
		modelValue: {
			type: Object as PropType<shot_crossbow>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<shot_crossbow>({
			item: props.modelValue.item ?? {} as item
		} as shot_crossbow);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
