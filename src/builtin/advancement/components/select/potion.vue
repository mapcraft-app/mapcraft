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
import { potionType } from '../../model';

export default defineComponent({
	name: 'SelectFrame',
	props: {
		modelValue: {
			type: [String, null] as PropType<potionType | null>,
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
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.potion')));
		const options = ['empty', 'mundane', 'thick', 'awkward', 'night vision', 'long night vision', 'invisibility', 'long invisibility', 'Leaping', 'Long Leaping', 'Strong Leaping', 'Fire Resistance', 'Long Fire Resistance', 'Swiftness', 'Long Swiftness', 'Strong Swiftness', 'long invisibility', 'Slowness', 'Long Slowness', 'Strong Slowness', 'Turtle Master', 'Long Turtle Master', 'Strong Turtle Master', 'Slowness', 'Slowness', 'Slowness', 'Slowness', 'Slowness', 'Slowness', 'Slowness', 'Slowness'];
		const optionsList = ref<string[]>(options);
		const color = ref<potionType | null>(props.modelValue ?? null);

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