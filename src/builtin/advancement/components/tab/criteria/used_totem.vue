<template>
	<item v-model="data.item" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Item from '../../interface/item.vue';
import { used_totem } from '../../../conditions';
import { item } from '../../../model';

export default defineComponent({
	name: 'TabUsedTotem',
	components: {
		Item
	},
	props: {
		modelValue: {
			type: Object as PropType<used_totem>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<used_totem>({
			item: props.modelValue.item ?? {} as item
		} as used_totem);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
