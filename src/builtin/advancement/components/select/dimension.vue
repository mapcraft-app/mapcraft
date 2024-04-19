<template>
	<q-select
		v-model="dimension"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="optionsList"
		:label="stringLabel"
		emit-value
		map-options
		@filter="filter"
	/>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onBeforeMount, watch } from 'vue';
import { capitalize } from '@/app/plugins/app';
import { useI18n } from 'vue-i18n';
import { dimensionType } from '../../model';

export default defineComponent({
	name: 'SelectDimension',
	props: {
		modelValue: {
			type: String as PropType<dimensionType | null>,
			required: false,
			default: null
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
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.dimension')));
		const options: { label: string, value: string }[] = [
			{ label: capitalize(t('builtin.advancement.select.theEnd')), value: 'the_end' },
			{ label: capitalize(t('builtin.advancement.select.overworld')), value: 'overworld' },
			{ label: capitalize(t('builtin.advancement.select.theNether')), value: 'the_nether' },
		];
		const optionsList = ref<{ label: string, value: string }[]>(options);
		const dimension = ref<dimensionType | null>(props.modelValue ?? null);

		const filter = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					optionsList.value = options;
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					optionsList.value = options.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		onBeforeMount(() => {
			watch(dimension, (after) => {
				if (after)
					emit('update:modelValue', after);
			});
		});

		return {
			stringLabel,
			optionsList,
			dimension,
			filter
		};
	}
});
</script>
