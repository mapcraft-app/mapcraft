<template>
	<q-select
		v-model="potion"
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
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from 'store/map';
import { potionType } from '../../model';
import { potions } from 'mapcraft-api/dist/types/src/minecraft/interface';
import { getter, setter } from '../../lib/regMinecraft';

export default defineComponent({
	name: 'SelectFrame',
	props: {
		modelValue: {
			type: String as PropType<potionType | null>,
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
		const store = mapStore();
		const { t } = useI18n();

		const stringLabel = ref<string>(props.label ?? capitalize(t('builtin.advancement.select.potion')));
		const options: { value: string, label: string }[] = [];
		(minecraft.get(store.minecraftVersion, 'potion') as potions[]).map((e) => {
			options.push({ value: e.name, label: e.name.replaceAll('_', ' ') });
			if (e.long)
				options.push({ value: e.long, label: e.long.replaceAll('_', ' ') });
			if (e.strong)
				options.push({ value: e.strong, label: e.strong.replaceAll('_', ' ') });
		});
		const optionsList = ref<{ value: string, label: string }[]>(options);
		const potion = ref<potionType | null>(setter(props.modelValue) as potionType |null);

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
			watch(potion, (after) => {
				if (after)
					emit('update:modelValue', getter(after));
			});
		});

		return {
			stringLabel,
			optionsList,
			potion,
			filter
		};
	}
});
</script>