<template>
	<div class="row inline">
		<span class="text-h6">Dealt</span>
		<type-number-range v-model="data.dealt" />
	</div>
	<div class="row inline">
		<span class="text-h6">Taken</span>
		<type-number-range v-model="data.taken" />
	</div>
	<q-toggle v-model="data.blocked" />
	type
	entity
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import TypeNumberRange from '../type/numberRange.vue';
import { damage } from '../../model';

export default defineComponent({
	name: 'InterfaceDamage',
	components: {
		TypeNumberRange
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<damage | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<damage>({
			dealt: props.modelValue?.dealt ?? 0,
			taken: props.modelValue?.taken ?? 0,
			blocked: props.modelValue?.blocked ?? null,
			type: props.modelValue?.type ?? null,
			source_entity: props.modelValue?.source_entity ?? null
		} as damage);

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