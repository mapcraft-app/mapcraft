<template>
	<q-select
		v-model="biome"
		use-input
		input-debounce="250"
		:dense="$props.dense"
		:options="optionsList"
		:label="$capitalize($t('builtin.advancement.interface.biome.biome'))"
		emit-value
		map-options
		@filter="filter"
	/>
</template>

<script lang="ts">
import { minecraft } from 'mapcraft-api/frontend';
import { defineComponent, PropType, ref, onBeforeMount, watch } from 'vue';
import { mapStore } from '@/store/map';
import { getter, setter } from '../../lib/regMinecraft';

export default defineComponent({
	name: 'SelectBiome',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: null
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

		const options: { label: string, value: string }[] = (minecraft.get(store.minecraftVersion, 'biome') as { id: string, type: string }[]).map((e) => ({ label: e.id.replaceAll('_', ' '), value: e.id }));
		const optionsList = ref<{ label: string, value: string }[]>(options);
		const biome = ref<string | null>(setter(props.modelValue));

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
			watch(biome, (after) => {
				if (after)
					emit('update:modelValue', getter(after));
			});
		});

		return {
			optionsList,
			biome,
			filter
		};
	}
});
</script>
@/app/store/map
