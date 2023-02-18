<template>
	<div class="row inline">
		<span class="text-h6">{{ $capitalize($t('builtin.advancement.interface.damage.dealt')) }}</span>
		<type-number-range v-model="data.dealt" />
	</div>
	<div class="row inline">
		<span class="text-h6">{{ $capitalize($t('builtin.advancement.interface.damage.taken')) }}</span>
		<type-number-range v-model="data.taken" />
	</div>
	<q-toggle v-model="data.blocked" />
	<interface-type v-model="data.type" />
	<interface-entity-player v-model="data.source_entity" />
</template>

<script lang="ts">
import { defineComponent, PropType, onBeforeMount, ref, watch } from 'vue';
import InterfaceEntityPlayer from './entityPlayer.vue';
import InterfaceType from './type.vue';
import TypeNumberRange from '../type/numberRange.vue';
import { damage } from '../../model';

export default defineComponent({
	name: 'InterfaceDamage',
	components: {
		InterfaceEntityPlayer,
		InterfaceType,
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