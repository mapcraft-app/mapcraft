<template>
	<interface-item v-model="data.item" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceItem from '../../interface/item.vue';
import { consume_item } from '../../../conditions';
import { item } from '../../../model';

export default defineComponent({
	name: 'TabConsumeItem',
	components: {
		InterfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<consume_item>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<consume_item>({
			item: props.modelValue.item ?? {} as item
		} as consume_item);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
