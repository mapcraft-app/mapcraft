<template>
	<interface-effect v-model="data.effects" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceEffect from '../../interface/effect.vue';
import { effects_changed } from '../../../conditions';
import { effect } from '../../../model';

export default defineComponent({
	name: 'TabEffectsChanged',
	components: {
		InterfaceEffect
	},
	props: {
		modelValue: {
			type: Object as PropType<effects_changed>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<effects_changed>({
			effects: props.modelValue.effects ?? {} as effect
		} as effects_changed);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
