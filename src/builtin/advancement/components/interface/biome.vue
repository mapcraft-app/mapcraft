<template>
	<div class="column q-gutter-sm">
		<q-select
			v-model="data.biome"
			use-input
			input-debounce="250"
			:options="biomesList.map((e) => e.id)"
			:label="$capitalize($t('builtin.advancement.interface.common.biome'))"
			@filter="filterBiome"
		/>
		<q-card bordered square flat class="q-pa-sm column align-center">
			<span class="text-center">{{ $capitalize($t('builtin.advancement.interface.biome.block')) }}</span>
			<block v-model="data.block" />
		</q-card>
		<q-card bordered square flat class="q-pa-sm column align-center">
			<span class="text-center">{{ $capitalize($t('builtin.advancement.interface.biome.fluid')) }}</span>
			<fluid v-model="data.fluid" />
		</q-card>
		<dimension v-model="data.dimension" />
		<structure v-model="data.feature" :label="$capitalize($t('builtin.advancement.interface.biome.feature'))" />
		<q-toggle v-model="data.smokey" color="primary" :label="$capitalize($t('builtin.advancement.interface.biome.smokey'))" />
		<q-card bordered square flat class="q-pa-sm q-gutter-sm column align-center">
			<span class="text-center">{{ $capitalize($t('builtin.advancement.interface.biome.position')) }}</span>
			<div class="row inline justify-center items-center">
				<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.common.x')) }}</span>
				<number-range v-model="data.position.x" />
			</div>
			<div class="row inline justify-center items-center">
				<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.common.y')) }}</span>
				<number-range v-model="data.position.y" />
			</div>
			<div class="row inline justify-center items-center">
				<span class="text-h6 q-pr-md">{{ $capitalize($t('builtin.advancement.interface.common.z')) }}</span>
				<number-range v-model="data.position.z" />
			</div>
		</q-card>
		<q-card bordered square flat class="q-pa-sm column align-center">
			<span class="text-center">{{ $capitalize($t('builtin.advancement.interface.biome.light')) }}</span>
			<div class="row justify-center q-pt-sm">
				<light v-model="data.light" />
			</div>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from 'app/src/store/map';
import { biome as biomeInterface } from '../../model';

import block from './block.vue';
import fluid from './fluid.vue';
import light from './light.vue';
import structure from '../select/structure.vue';
import dimension from '../select/dimension.vue';
import numberRange from '../type/numberRange.vue';

interface biome {
	id: string;
	type: string;
}

export default defineComponent({
	name: 'InterfaceBiome',
	components: {
		block,
		fluid,
		light,
		structure,
		dimension,
		numberRange
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<biomeInterface | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const store = mapStore();
		const biomes = minecraft.get(store.minecraftVersion, 'biome') as biome[];

		const data = ref<biomeInterface>({
			biome: props.modelValue?.biome ?? null,
			block: props.modelValue?.block ?? null,
			fluid: props.modelValue?.fluid ?? null,
			dimension: props.modelValue?.dimension ?? null,
			feature: props.modelValue?.feature ?? null,
			smokey: props.modelValue?.smokey ?? null,
			position: {
				x: props.modelValue?.position?.x ?? null,
				y: props.modelValue?.position?.y ?? null,
				z: props.modelValue?.position?.z ?? null
			},
			light: props.modelValue?.light ?? null
		} as biomeInterface);
		const biomesList = ref<biome[]>(biomes);

		const filterBiome = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					biomesList.value = biomes;
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					biomesList.value = biomes.filter((v) => v.id.toLowerCase().indexOf(needle) > -1);
				});
			}
		};

		onBeforeMount(() => {
			watch(data, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			data,
			biomesList,

			filterBiome
		};
	}
});
</script>
