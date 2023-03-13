<template>
	<q-select
		v-model="select"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="list"
		:label="label ?? item ? $capitalize($t('builtin.advancement.select.item')) : $capitalize($t('builtin.advancement.select.block'))"
		emit-value
		map-options
		:error="$props.error"
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from 'app/src/store/map';
import { getter, setter } from '../../lib/regMinecraft';

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
		},
		error: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const store = mapStore();
		const select = ref<string | null>(setter(props.modelValue));
		const elementsList: { label: string, value: string }[] = [];
		const list = ref<{ label: string, value: string }[]>([]);

		const filter = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					list.value = elementsList;
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					list.value = elementsList.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		onBeforeMount(() => {
			if (props.block) {
				(minecraft.get(store.minecraftVersion, 'block') as { name: string }[]).forEach((e) => {
					elementsList.push({ label: e.name.replaceAll('_', ' '), value: e.name });
				});
			}
			if (props.item) {
				(minecraft.get(store.minecraftVersion, 'item') as { name: string }[]).forEach((e) => {
					elementsList.push({ label: e.name.replaceAll('_', ' '), value: e.name });
				});
			}
			list.value = elementsList;
			watch(select, (after) => {
				if (after)
					emit('update:modelValue', getter(after));
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