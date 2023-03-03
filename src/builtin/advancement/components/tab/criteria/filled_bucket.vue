<template>
	<interface-item v-model="data.item" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceItem from '../../interface/item.vue';
import { filled_bucket } from '../../../conditions';
import { item } from '../../../model';

export default defineComponent({
	name: 'TabFilledBucket',
	components: {
		InterfaceItem
	},
	props: {
		modelValue: {
			type: Object as PropType<filled_bucket>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<filled_bucket>({
			item: props.modelValue.item ?? {} as item
		} as filled_bucket);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
