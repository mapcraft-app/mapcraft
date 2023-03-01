<template>
	<q-select
		v-model="stats"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="optionsList"
		:label="stringLabel"
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onBeforeMount, watch } from 'vue';
import { capitalize } from 'app/src/vue/plugins/app';
import { useI18n } from 'vue-i18n';
import { statsType } from '../../model';

export default defineComponent({
	name: 'SelectStats',
	props: {
		modelValue: {
			type: String as PropType<statsType | null>,
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
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.stats')));
		const options = ['minecraft:broken', 'minecraft:crafted', 'minecraft:custom', 'minecraft:dropped', 'minecraft:killed', 'minecraft:killed_by', 'minecraft:mined', 'minecraft:picked_up', 'minecraft:used'];
		const optionsList = ref<string[]>(options);
		const stats = ref<statsType | null>(props.modelValue ?? null);

		const filter = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					optionsList.value = options;
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					optionsList.value = options.filter((v) => v.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		onBeforeMount(() => {
			watch(stats, (after) => {
				if (after)
					emit('update:modelValue', after);
			});
		});

		return {
			stringLabel,
			optionsList,
			stats,
			filter
		};
	}
});
</script>