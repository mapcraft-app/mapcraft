<template>
	<div class="q-pa-md row items-start q-gutter-md">
		<q-card
			v-for="(el, i) in effectArray"
			:key="String(i)"
			style="width: 100%; max-width: 250px"
		>
			<q-card-section class="row reverse no-padding">
				<q-btn
					flat round color="red"
					icon="clear" size="1em"
					class="q-ma-sm"
					@click="removeEffect(i)"
				/>
			</q-card-section>
			<q-card-section class="column justify-center align-center no-padding">
				<q-select
					v-model="el.id"
					:options="effectsList"
					label="Enchantement"
					class="q-pa-sm"
				/>
				<span class="text-h6">Amplifier</span>
				<type-number-range v-model="el.amplifier" class="q-pa-sm" />
				<span class="text-h6">Duration</span>
				<type-number-range v-model="el.duration" class="q-pa-sm" />
			</q-card-section>
		</q-card>
		<q-card style="width: 100%; max-width: 250px">
			<q-card-section class="row q-pa-sm">
				<q-btn
					color="primary" icon="add"
					style="width: 100%"
					@click="addEffect"
				/>
			</q-card-section>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api';
import { mapStore } from 'app/src/store/map';
import TypeNumberRange from '../type/numberRange.vue';
import { effect, numberRange } from '../../model';

interface effectMinecraft {
	name: string;
}

interface effectElement {
	id: string, 
	amplifier: number | numberRange,
	duration: number | numberRange
}

export default defineComponent({
	name: 'InterfaceEffect',
	components: {
		TypeNumberRange
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<effect | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const store = mapStore();

		const effects = minecraft.get(store.minecraftVersion, 'effect') as effectMinecraft[];
		const effectsList = ref<string[]>(effects.map((e) => e.name));
		
		const effectArray = ref<effectElement[]>([]);
		if (props.modelValue) {
			for (const el in props.modelValue) {
				effectArray.value.push({
					id: el,
					amplifier: props.modelValue[el].amplifier,
					duration: props.modelValue[el].duration
				});
			}
		}

		const addEffect = () => {
			effectArray.value.push({
				id: '',
				amplifier: 0,
				duration: 0
			});
		};

		const removeEffect = (i: number) => effectArray.value.splice(i, 1);

		const filter = (val: string, update: any) => {
			if (val === '') {
				update(() => {
					effectsList.value = effects.map((e) => e.name);
				});
			} else {
				update(() => {
					const needle = val.toLowerCase();
					effectsList.value = effects.filter((v) => v.name.toLowerCase().indexOf(needle) > -1).map((e) => e.name);
				});
			}
		};

		onBeforeMount(() => {
			watch(effectArray, (after) => {
				if (after) {
					const ret: effect = {};
					for (const key in after)
						ret[key] = { amplifier: after[key].amplifier , duration: after[key].duration};
					emit('update:modelValue', ret);
				}
			});
		});

		return {
			effectsList,
			effectArray,

			addEffect,
			removeEffect,
			filter
		};
	}
});
</script>