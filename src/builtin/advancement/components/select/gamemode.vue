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
import { capitalize } from 'app/src/vue/plugins/app';
import { useI18n } from 'vue-i18n';
import { gamemodeType } from '../../model';

export default defineComponent({
	name: 'SelectGamemode',
	props: {
		modelValue: {
			type: String as PropType<gamemodeType | null>,
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
		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.gamemode')));
		const options: { label: string, value: string }[] = [
			{ label: capitalize(t('builtin.advancement.select.gamemodes[0]')), value: 'adventure' },
			{ label: capitalize(t('builtin.advancement.select.gamemodes[1]')), value: 'creative' },
			{ label: capitalize(t('builtin.advancement.select.gamemodes[2]')), value: 'spectator' },
			{ label: capitalize(t('builtin.advancement.select.gamemodes[3]')), value: 'survival' },
		];
		const optionsList = ref<{ label: string, value: string }[]>(options);
		const color = ref<gamemodeType | null>(props.modelValue ?? null);

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
			stringLabel,
			optionsList,
			color,
			filter
		};
	}
});
</script>