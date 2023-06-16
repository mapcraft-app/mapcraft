<template>
	<block-item v-model="data.block" :block="true" :item="false" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import BlockItem from '../../select/blockItem.vue';
import { slide_down_block } from '../../../interfaces/1.17_1.19';

export default defineComponent({
	name: 'TabSlideDownBlock',
	components: {
		BlockItem
	},
	props: {
		modelValue: {
			type: Object as PropType<slide_down_block>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<slide_down_block>({
			block: props.modelValue.block ?? null
		} as slide_down_block);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
