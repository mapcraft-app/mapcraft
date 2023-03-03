<template>
	<div class="row justify-around">
		<type-number-range v-model="data.absolute" :label="$capitalize($t('builtin.advancement.interface.distance.absolute'))" />
		<type-number-range v-model="data.horizontal" :label="$capitalize($t('builtin.advancement.interface.distance.horizontal'))" />
	</div>
	<div class="column items-center q-pt-md">
		<type-number-range v-model="data.x" :label="$capitalize($t('builtin.advancement.interface.common.x'))" />
		<type-number-range v-model="data.y" :label="$capitalize($t('builtin.advancement.interface.common.y'))" />
		<type-number-range v-model="data.z" :label="$capitalize($t('builtin.advancement.interface.common.z'))" />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import TypeNumberRange from '../type/numberRange.vue';
import { distance } from '../../model';

export default defineComponent({
	name: 'InterfaceDistance',
	components: {
		TypeNumberRange
	},
	props: {
		modelValue: {
			type: Object as PropType<distance | null>,
			required: false,
			default: {} as distance
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<distance>({
			absolute: props.modelValue?.absolute ?? null,
			horizontal: props.modelValue?.horizontal ?? null,
			x: props.modelValue?.x ?? null,
			y: props.modelValue?.y ?? null,
			z: props.modelValue?.z ?? null
		} as distance);

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