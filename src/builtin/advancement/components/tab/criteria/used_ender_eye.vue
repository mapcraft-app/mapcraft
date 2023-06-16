<template>
	<number-range
		v-model="data.distance"
		:label="$capitalize($t('builtin.advancement.interface.entityPlayer.distance'))"
	/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import NumberRange from '../../type/numberRange.vue';
import { used_ender_eye } from '../../../interfaces/1.17_1.19';

export default defineComponent({
	name: 'TabUsedEnderEye',
	components: {
		NumberRange
	},
	props: {
		modelValue: {
			type: Object as PropType<used_ender_eye>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<used_ender_eye>({
			distance: props.modelValue.distance ?? 0
		} as used_ender_eye);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
