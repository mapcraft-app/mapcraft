<template>
	<select-block-item
		v-model="data.block"
		:block="true" :item="false"
		:label="$capitalize($t('builtin.advancement.interface.common.block'))"
		class="q-mb-sm"
	/>
	<div class="full-width column items-center">
		<span class="text-h6 text-width-medium">{{ $capitalize($t('builtin.advancement.interface.common.state')) }}</span>
		<state-type v-model="data.state" />
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import SelectBlockItem from '../../select/blockItem.vue';
import StateType from '../../type/state.vue';
import { enter_block } from '../../../conditions';
import { state } from '../../../model';

export default defineComponent({
	name: 'TabEnterBlock',
	components: {
		SelectBlockItem,
		StateType
	},
	props: {
		modelValue: {
			type: Object as PropType<enter_block>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<enter_block>({
			state: props.modelValue.state ?? {} as state,
			block: props.modelValue.block ?? null
		} as enter_block);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
