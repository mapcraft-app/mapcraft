<template>
	<interface-entity v-model="data.entity" />
	<interface-type v-model="data.killing_blow" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceEntity from '../../interface/entityPlayer.vue';
import InterfaceType from '../../interface/type.vue';
import { entity_killed_player } from '../../../conditions';
import { entity, type } from '../../../model';

export default defineComponent({
	name: 'TabEntityKilledPlayer',
	components: {
		InterfaceEntity,
		InterfaceType
	},
	props: {
		modelValue: {
			type: Object as PropType<entity_killed_player>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<entity_killed_player>({
			entity: props.modelValue.entity ?? {} as entity,
			killing_blow: props.modelValue.killing_blow ?? {} as type
		} as entity_killed_player);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
