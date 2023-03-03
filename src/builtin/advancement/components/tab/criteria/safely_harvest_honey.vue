<template>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			icon="crop_square"
			:label="$capitalize($t('builtin.advancement.select.block'))"
			class="q-ma-xs"
		>
			<block v-model="data.block" />
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			icon="category"
			:label="$capitalize($t('builtin.advancement.select.item'))"
			class="q-ma-xs"
		>
			<item v-model="data.item" />
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import Block from '../../interface/block.vue';
import Item from '../../interface/item.vue';
import { safely_harvest_honey } from '../../../conditions';
import { block, item } from '../../../model';

export default defineComponent({
	name: 'TabSafelyHarvestHoney',
	components: {
		Block,
		Item
	},
	props: {
		modelValue: {
			type: Object as PropType<safely_harvest_honey>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<safely_harvest_honey>({
			block: props.modelValue.block ?? {} as block,
			item: props.modelValue.item ?? {} as item
		} as safely_harvest_honey);

		onBeforeMount(() => {
			watch(data, (val) => emit('update:modelValue', val), { deep: true });
		});

		return {
			data
		};
	}
});
</script>
