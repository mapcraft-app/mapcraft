<template>
	<div>
		<block-item v-model="value.block" />
		
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch, PropType } from 'vue';
import blockItem from '../select/blockItem.vue';
import { block } from '../../model';

export default defineComponent({
	name: 'Interface',
	components: {
		blockItem
	},
	props: {
		modelValue: {
			type: Object as PropType<block>,
			required: true
		},
		dense: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const value = ref<block>(props.modelValue);
		
		onBeforeMount(() => {
			watch(value, (after) => {
				if (after)
					emit('update:modelValue', after);
			});
		});

		return {
			value
		};
	}
});
</script>