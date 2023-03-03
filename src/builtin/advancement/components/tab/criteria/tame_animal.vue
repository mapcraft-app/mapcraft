<template>
	<entity-player v-model="data.entity" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import EntityPlayer from '../../interface/entityPlayer.vue';
import { tame_animal } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabTameAnimal',
	components: {
		EntityPlayer
	},
	props: {
		modelValue: {
			type: Object as PropType<tame_animal>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<tame_animal>({
			entity: props.modelValue.entity ?? {} as entity
		} as tame_animal);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
