<template>
	<div>
		<q-input v-model="data.id" label="Id" />
		<q-input v-model="data.tag" label="Tag" />
		<type-state v-model="data.state" />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import typeState from '../type/state.vue';
import { fluid } from '../../model';

export default defineComponent({
	name: 'InterfaceFluid',
	components: {
		typeState
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<fluid | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<fluid>({
			id: props.modelValue?.id ?? null,
			state: props.modelValue?.state ?? null,
			tag: props.modelValue?.tag ?? null
		} as fluid);

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