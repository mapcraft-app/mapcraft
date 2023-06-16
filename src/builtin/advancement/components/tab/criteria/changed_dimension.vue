<template>
	<select-dimension v-model="data.from" :label="$capitalize($t('builtin.advancement.tab.changedDimension.from'))" />
	<select-dimension v-model="data.to" :label="$capitalize($t('builtin.advancement.tab.changedDimension.to'))" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import SelectDimension from '../../select/dimension.vue';
import { changed_dimension } from '../../../interfaces/1.17_1.19';

export default defineComponent({
	name: 'TabChangedDimension',
	components: {
		SelectDimension
	},
	props: {
		modelValue: {
			type: Object as PropType<changed_dimension>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<changed_dimension>({
			from: props.modelValue.from ?? null,
			to: props.modelValue.to ?? null
		});

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
