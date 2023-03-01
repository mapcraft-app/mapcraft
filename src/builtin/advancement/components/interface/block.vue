<template>
	<block-item v-model="data.block" :item="false" :label="$capitalize($t('builtin.advancement.interface.common.block'))"/>
	<q-input v-model="data.tag" :label="$capitalize($t('builtin.advancement.interface.common.tag'))" />
	<q-input v-model="data.nbt" :label="$capitalize($t('builtin.advancement.interface.common.nbt'))" />
	<div class="row justify-center q-pt-sm">
		<state v-model="data.state" />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import blockItem from '../select/blockItem.vue';
import state from '../type/state.vue';
import { block } from '../../model';

export default defineComponent({
	name: 'InterfaceBlock',
	components: {
		blockItem,
		state
	},
	props: {
		modelValue: {
			type: Object as PropType<block | null>,
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
		const data = ref<block>({
			block: props.modelValue?.block ?? null,
			tag: props.modelValue?.tag ?? null,
			nbt: props.modelValue?.nbt ?? null,
			state: props.modelValue?.state ?? null
		} as block);

		onBeforeMount(() => {
			watch(data, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});
		
		return {
			data
		};
	}
});
</script>