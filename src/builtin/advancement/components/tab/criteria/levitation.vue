<template>
	<div class="row justify-around">
		<number-range v-model="data.duration" :label="$capitalize($t('builtin.advancement.interface.effect.duration'))" />
	</div>
	<div class="full-width text-center q-pt-sm">
		<span class="text-h6 text-weight-light">{{ $capitalize($t('builtin.advancement.interface.entityPlayer.distance')) }}</span>
	</div>
	<interface-distance v-model="data.distance" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceDistance from '../../interface/distance.vue';
import NumberRange from '../../type/numberRange.vue';
import { levitation } from '../../../interfaces/1.17_1.19';
import { distance } from '../../../model';

export default defineComponent({
	name: 'TabLevitation',
	components: {
		InterfaceDistance,
		NumberRange
	},
	props: {
		modelValue: {
			type: Object as PropType<levitation>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<levitation>({
			distance: props.modelValue.distance ?? {} as distance,
			duration: props.modelValue.duration ?? 0
		} as levitation);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
