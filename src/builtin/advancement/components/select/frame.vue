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
import { frameType } from '../../model';

export default defineComponent({
	name: 'SelectFrame',
	props: {
		modelValue: {
			type: String as PropType<frameType | null>,
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
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.frame')));
		const options = ['challenge', 'goal', 'task'];
		const optionsList = ref<string[]>(options);
		const color = ref<frameType | null>(props.modelValue ?? null);

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
			stringLabel,
			optionsList,
			color,
			filter
		};
	}
});
</script>