<template>
	<div class="q-pa-md row items-start q-gutter-md">
		<q-card
			v-for="(el, i) in enchantements"
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
					label="Enchantement"
					class="q-pa-sm"
				/>
				<number-range
					v-model="el.levels"
					:min="getVal(el.enchantment)"
					:max="getVal(el.enchantment, false)"
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
	name: 'Enchantement',
	components: {
		numberRange
	},
	props: {
		modelValue: {
			type: Array as PropType<enchantement[]>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const store = mapStore();
		const id = ref<number>(0);
		const selectedEnchantement = ref<string | null>(null);
		const enchantementList = ref<enchants[]>([]);
		const enchantements = ref<enchantement[]>(props.modelValue);

		const addEnchantement = () => {
			enchantements.value.push({
				levels: {
					min: 0,
					max: 0,
				},
				enchantment: ''
			} as enchantement);
		};

		const removeEnchantement = (i: number) => {
			enchantements.value.splice(i, 1);
		};

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

			watch(enchantements, (after) => {
				if (after)
					emit('update:modelValue', after);
			});

			watch(selectedEnchantement, (after) => {
				if (after) {
					for (const i in enchantementList.value) {
						if (enchantementList.value[i].id === after) {
							id.value = Number(i);
							return;
						}
					}
				}
			});
		});

		return {
			id,
			selectedEnchantement,
			enchantementList,
			enchantements,

			addEnchantement,
			removeEnchantement,
			getVal
		};
	}
});
</script>