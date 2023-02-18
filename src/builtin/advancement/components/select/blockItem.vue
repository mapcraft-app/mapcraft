<template>
	<q-select
		v-model="select"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="list"
		:label="$props.label"
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { capitalize } from 'app/src/vue/plugins/app';
import { useI18n } from 'vue-i18n';
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from 'app/src/store/map';

interface block {
	name: string;
}

interface items {
	name: string;
}

export default defineComponent({
	name: 'SelectBlockItem',
	props: {
		modelValue: {
			type: [String, null] as PropType<string | null>,
			required: true
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
			default: capitalize(useI18n().t('builtin.advancement.select.item'))
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
			const retBlock = minecraft.get(store.minecraftVersion, 'block') as block[];
			const retItem = minecraft.get(store.minecraftVersion, 'item') as items[];
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