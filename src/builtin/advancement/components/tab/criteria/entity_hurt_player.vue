<template>
	<interface-damage v-model="data.damage" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceDamage from '../../interface/damage.vue';
import { entity_hurt_player } from '../../../interfaces/1.17_1.19';
import { damage } from '../../../model';

export default defineComponent({
	name: 'TabEntityHurtPlayer',
	components: {
		InterfaceDamage
	},
	props: {
		modelValue: {
			type: Object as PropType<entity_hurt_player>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<entity_hurt_player>({
			damage: props.modelValue.damage ?? {} as damage
		} as entity_hurt_player);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
