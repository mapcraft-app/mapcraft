<template>
	<entity v-model="data.entity" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Entity from '../../interface/entityPlayer.vue';
import { summoned_entity } from '../../../conditions';
import { entity } from '../../../model';

export default defineComponent({
	name: 'TabSummonedEntity',
	components: {
		Entity
	},
	props: {
		modelValue: {
			type: Object as PropType<summoned_entity>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<summoned_entity>({
			entity: props.modelValue.entity ?? {} as entity
		} as summoned_entity);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
