<template>
	<q-input
		v-model="data.loot_table"
		:label="$capitalize($t('builtin.advancement.select.loot'))"
	/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { player_generates_container_loot } from '../../../interfaces/1.17_1.19';

export default defineComponent({
	name: 'TabPlayerGeneratesContainerLoot',
	props: {
		modelValue: {
			type: Object as PropType<player_generates_container_loot>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<player_generates_container_loot>({
			loot_table: props.modelValue.loot_table ?? null
		} as player_generates_container_loot);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
