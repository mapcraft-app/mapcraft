<template>
	<q-select
		v-model="color"
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
import { textColor } from '../../model';

export default defineComponent({
	name: 'SelectColor',
	props: {
		modelValue: {
			type: String as PropType<textColor | null>,
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
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.color')));

		const options = ['black' ,'dark_blue' ,'dark_green' ,'dark_aqua' ,'dark_red' ,'dark_purpl;e' ,'gold' ,'gray' ,'dark_gray' ,'blue' ,'green' ,'aqua' ,'red' ,'light_purple' ,'yellow' ,'white'];
		const optionsList = ref<string[]>(options);
		const color = ref<textColor | null>(props.modelValue ?? null);

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