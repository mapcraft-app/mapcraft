<template>
	<div class="row inline">
		<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.distance.absolute')) }}</span>
		<type-number-range v-model="data.absolute" />
	</div>
	<div class="row inline">
		<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.distance.horizontal')) }}</span>
		<type-number-range v-model="data.horizontal" />
	</div>
	<div class="row inline">
		<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.common.x')) }}</span>
		<type-number-range v-model="data.x" />
	</div>
	<div class="row inline">
		<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.common.y')) }}</span>
		<type-number-range v-model="data.y" />
	</div>
	<div class="row inline">
		<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.common.z')) }}</span>
		<type-number-range v-model="data.z" />
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
			required: true
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