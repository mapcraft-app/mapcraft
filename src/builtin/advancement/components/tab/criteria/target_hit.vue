<template>
	<q-input
		v-model.number="data.signal_strength"
		:label="$capitalize($t('builtin.advancement.tab.targetHit.strength'))"
		type="number"
	/>
	<q-separator class="q-mt-md"/>
	<div class="full-width text-center">
		<span class="text-h6 text-weight-light">{{ $capitalize($t('builtin.advancement.select.entity')) }}</span>
	</div>
	<q-input v-model="data.projectile" label="Projectile" />
	<entity v-model="data.shooter" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Entity from '../../interface/entityPlayer.vue';
import { target_hit } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabTargetHit',
	components: {
		Entity
	},
	props: {
		modelValue: {
			type: Object as PropType<target_hit>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<target_hit>({
			signal_strength: props.modelValue.signal_strength ?? 0,
			projectile: props.modelValue.projectile ?? null,
			shooter: props.modelValue.shooter ?? {} as entity
		} as target_hit);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
