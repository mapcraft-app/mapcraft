<template>
	<q-select
		v-model="select"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="list"
		:label="label ?? item ? $capitalize($t('builtin.advancement.select.item')) : $capitalize($t('builtin.advancement.select.block'))"
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from 'app/src/store/map';

export default defineComponent({
	name: 'SelectBlockItem',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		},
		item: {
			type: Boolean,
			required: false,
			default: true
		},
		block: {
			type: Boolean,
			required: false,
			default: true
		},
		label: {
			type: String,
			required: false,
			default: undefined
		},
		dense: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const store = mapStore();
		const select = ref<string | null>(props.modelValue ?? null);
		const elementsList = ref<string[]>([]);
		const list = ref<string[]>([]);

		const filter = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					list.value = elementsList.value;
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					list.value = elementsList.value.filter((v) => v.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		onBeforeMount(() => {
			const retBlock = minecraft.get(store.minecraftVersion, 'block') as { name: string }[];
			const retItem = minecraft.get(store.minecraftVersion, 'item') as { name: string }[];
			if (retBlock && props.block)
				elementsList.value = [ ...elementsList.value, ...retBlock.map((e) => e.name) ];
			if (retItem && props.item)
				elementsList.value = [ ...elementsList.value, ...retItem.map((e) => e.name) ];
			list.value = elementsList.value;
			watch(select, (after) => {
				if (after)
					emit('update:modelValue', after);
			});
		});

		return {
			select,
			elementsList,
			list,
			filter
		};
	}
});
</script>