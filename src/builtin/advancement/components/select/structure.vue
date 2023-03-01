<template>
	<q-select
		v-model="structure"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="optionsList.map((e) => e.name)"
		:label="stringLabel"
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onBeforeMount, watch } from 'vue';
import { capitalize } from 'app/src/vue/plugins/app';
import { useI18n } from 'vue-i18n';
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from 'app/src/store/map';

interface structures {
	name: string;
}

export default defineComponent({
	name: 'SelectStructure',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: true
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
		const { t } = useI18n();
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.structure')));
		const store = mapStore();
		const options = minecraft.get(store.minecraftVersion, 'structure') as structures[];
		const optionsList = ref<structures[]>(options);
		const structure = ref<string | null>(props.modelValue ?? null);

		const filter = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					optionsList.value = options;
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					optionsList.value = options.filter((v) => v.name.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		onBeforeMount(() => {
			watch(structure, (after) => {
				if (after)
					emit('update:modelValue', after);
			});
		});

		return {
			stringLabel,
			optionsList,
			structure,
			filter
		};
	}
});
</script>