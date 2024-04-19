<template>
	<q-select
		v-model="color"
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
import { textColor } from '../../model';

export default defineComponent({
	name: 'SelectColor',
	props: {
		modelValue: {
			type: String as PropType<textColor | null>,
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
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.color')));
		const options: { value: string, label: string }[] = [
			{ value: 'black', label: capitalize(t('builtin.advancement.tab.display.colorList[0]')) },
			{ value: 'dark_blue', label: capitalize(t('builtin.advancement.tab.display.colorList[1]')) },
			{ value: 'dark_green', label: capitalize(t('builtin.advancement.tab.display.colorList[2]')) },
			{ value: 'dark_aqua', label: capitalize(t('builtin.advancement.tab.display.colorList[3]')) },
			{ value: 'dark_red', label: capitalize(t('builtin.advancement.tab.display.colorList[4]'))} ,
			{ value: 'dark_purple', label: capitalize(t('builtin.advancement.tab.display.colorList[5]')) },
			{ value: 'gold', label: capitalize(t('builtin.advancement.tab.display.colorList[6]')) },
			{ value: 'gray', label: capitalize(t('builtin.advancement.tab.display.colorList[7]')) },
			{ value: 'dark_gray', label: capitalize(t('builtin.advancement.tab.display.colorList[8]')) },
			{ value: 'blue', label: capitalize(t('builtin.advancement.tab.display.colorList[9]')) },
			{ value: 'green', label: capitalize(t('builtin.advancement.tab.display.colorList[10]')) },
			{ value: 'aqua', label: capitalize(t('builtin.advancement.tab.display.colorList[11]')) },
			{ value: 'red', label: capitalize(t('builtin.advancement.tab.display.colorList[12]')) },
			{ value: 'light_purple', label: capitalize(t('builtin.advancement.tab.display.colorList[13]')) },
			{ value: 'yellow', label: capitalize(t('builtin.advancement.tab.display.colorList[14]')) },
			{ value: 'white', label: capitalize(t('builtin.advancement.tab.display.colorList[15]')) }
		];
		const optionsList = ref<{ value: string, label: string }[]>(options);
		const color = ref<textColor | null>(props.modelValue ?? null);

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
			watch(color, (after) => {
				if (after)
					emit('update:modelValue', after);
			});
		});

		return {
			optionsList,
			color,
			stringLabel,
			filter
		};
	}
});
</script>
