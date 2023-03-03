<template>
	<div class="q-pa-md row items-start q-gutter-md">
		<q-card
			v-for="(el, i) in enchantementsArray"
			:key="String(i)"
			style="width: 100%; max-width: 250px"
		>
			<q-card-section class="row reverse no-padding">
				<q-btn
					flat round color="red"
					icon="clear" size="1em"
					class="q-ma-sm"
					@click="removeEnchantement(i)"
				/>
			</q-card-section>
			<q-card-section class="column justify-center align-center no-padding">
				<q-select
					v-model="el.enchantment"
					:options="enchantementList.map((e) => e.id)"
					:label="$capitalize($t('builtin.advancement.interface.common.enchantement'))"
					class="q-pa-sm"
				/>
				<number-range
					v-model="el.levels"
					:min="getVal(el.enchantment)"
					:max="getVal(el.enchantment, false)"
					:label="$capitalize($t('builtin.advancement.interface.entityPlayer.level'))"
					class="q-pa-sm"
				/>
			</q-card-section>
		</q-card>
		<q-card style="width: 100%; max-width: 250px">
			<q-card-section class="row q-pa-sm">
				<q-btn
					color="primary" icon="add"
					style="width: 100%"
					@click="addEnchantement"
				/>
			</q-card-section>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api';
import { mapStore } from 'app/src/store/map';
import { enchantement } from '../../model';
import numberRange from '../type/numberRange.vue';

interface enchants {
	id: string,
	description: string,
	level: [ number, number ]
}

export default defineComponent({
	name: 'InterfaceEnchantement',
	components: {
		numberRange
	},
	props: {
		modelValue: {
			type: Array as PropType<enchantement[] | null>,
			required: false,
			default: [] as enchantement[]
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const store = mapStore();
		const selectedEnchantement = ref<string | null>(null);
		const enchantementList = ref<enchants[]>([]);
		const enchantementsArray = ref<enchantement[]>(props.modelValue ?? []);

		const addEnchantement = () => {
			enchantementsArray.value.push({
				levels: {
					min: 0,
					max: 0,
				},
				enchantment: ''
			} as enchantement);
		};

		const removeEnchantement = (i: number) => enchantementsArray.value.splice(i, 1);

		const getVal = (type: string, min = true) => {
			for (const i in enchantementList.value) {
				if (enchantementList.value[i].id === type) {
					return (min)
						? enchantementList.value[i].level[0]
						: enchantementList.value[i].level[1];
				}
			}
			return 1;
		};

		onBeforeMount(() => {
			const ret = minecraft.get(store.minecraftVersion, 'enchantement') as enchants[];
			if (ret)
				enchantementList.value = ret;

			watch(enchantementsArray, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			selectedEnchantement,
			enchantementList,
			enchantementsArray,

			addEnchantement,
			removeEnchantement,
			getVal
		};
	}
});
</script>