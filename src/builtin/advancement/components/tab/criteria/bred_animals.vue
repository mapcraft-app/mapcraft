<template>
	<interface-entity v-model="data.child" />
	<interface-entity v-model="data.parent" />
	<interface-entity v-model="data.partner" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import InterfaceEntity from '../../interface/entityPlayer.vue';
import { bred_animals } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabBredAnimals',
	components: {
		InterfaceEntity
	},
	props: {
		modelValue: {
			type: Object as PropType<bred_animals>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<bred_animals>({
			child: props.modelValue.child ?? {} as entity,
			parent: props.modelValue.parent ?? {} as entity,
			partner: props.modelValue.partner ?? {} as entity
		});

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val));
		});

		return {
			data
		};
	}
});
</script>
