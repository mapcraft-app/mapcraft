<template>
	<select-entity v-model="data.type" label="Type" />
	<q-input v-model="data.nbt" label="Nbt" />
	<q-card bordered square flat class="q-pa-sm column align-center q-mt-sm q-mb-sm">
		<span class="text-center">Flags</span>
		<div class="row justify-evenly">
			<q-checkbox
				v-model="data.flags.is_baby"
				left-label
				label="Is baby ?"
			/>
			<q-separator horizontal />
			<q-checkbox
				v-model="data.flags.is_on_fire"
				left-label
				label="Is on fire ?"
			/>
			<q-checkbox
				v-model="data.flags.is_sneaking"
				left-label
				label="Is sneaking ?"
			/>
			<q-checkbox
				v-model="data.flags.is_sprinting"
				left-label
				label="Is sprinting ?"
			/>
			<q-checkbox
				v-model="data.flags.is_swimming"
				left-label
				label="Is swimming ?"
			/>
		</div>
	</q-card>
	<q-list bordered class="q-mt-sm">
		<q-expansion-item
			expand-separator
			label="Distance"
		>
			<div class="column items-center q-pa-sm">
				<interface-distance v-model="data.distance" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Effect"
		>
			<div class="column q-pa-sm">
				<interface-effect v-model="data.effects" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Location"
		>
			<div class="column q-pa-sm">
				<interface-biome v-model="data.location" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Equipement"
		>
			<div class="column q-pa-sm">
				<interface-equipement v-model="data.equipement" />
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Passenger"
			@click="createEntity('passenger')"
		>
			<div class="q-pa-sm">
				<interface-entity
					v-if="data.passenger !== null"
					v-model="data.passenger"
				/>
			</div>
		</q-expansion-item>
		<q-expansion-item
			expand-separator
			label="Player"
		>
			<div class="q-pa-sm">
				<interface-player v-model="data.player" />
			</div>
		</q-expansion-item>
	</q-list>
	<q-card bordered square flat class="q-pa-sm column align-center q-mt-sm">
		<span class="text-center">Lightning Bolt</span>
		<q-input
			v-model.number="data.lightning_bolt.blocks_set_on_fire"
			type="number"
			label="Blocks Set On Fire"
		/>
		<q-list class="q-mt-sm">
			<q-expansion-item
				label="Entity Struck"
				@click="createEntity('struck')"
			>
				<div class="q-pa-sm">
					<interface-entity
						v-if="data.lightning_bolt.entity_struck !== null"
						v-model="data.lightning_bolt.entity_struck"
					/>
				</div>
			</q-expansion-item>
		</q-list>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import SelectEntity from '../select/entity.vue';
import InterfaceBiome from './biome.vue';
import InterfaceDistance from './distance.vue';
// import InterfacePlayer from './player.vue';
import InterfaceEffect from './effect.vue';
import InterfaceEquipement from './equipement.vue';

import { entity } from '../../model';

export default defineComponent({
	name: 'InterfaceEntity',
	components: {
		SelectEntity,
		InterfaceBiome,
		InterfaceDistance,
		//InterfacePlayer,
		InterfaceEffect,
		InterfaceEquipement
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<entity | null>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const data = ref<entity>({
			type: props.modelValue?.type ?? null,
			nbt: props.modelValue?.nbt ?? null,
			distance: props.modelValue?.distance ?? null,
			effects: props.modelValue?.effects ?? null,
			location: props.modelValue?.location ?? null,
			equipement: props.modelValue?.equipement ?? null,
			passenger: props.modelValue?.passenger ?? null,
			player: props.modelValue?.player ?? null,
			flags: {
				is_baby: (props.modelValue?.flags)
					? props.modelValue.flags.is_baby
					: false,
				is_on_fire: (props.modelValue?.flags)
					? props.modelValue.flags.is_on_fire
					: false,
				is_sneaking: (props.modelValue?.flags)
					? props.modelValue.flags.is_sneaking
					: false,
				is_sprinting: (props.modelValue?.flags)
					? props.modelValue.flags.is_sprinting
					: false,
				is_swimming:( props.modelValue?.flags)
					? props.modelValue.flags.is_swimming
					: false,
			},
			lightning_bolt: {
				blocks_set_on_fire: (props.modelValue?.lightning_bolt)
					? props.modelValue.lightning_bolt.blocks_set_on_fire
					: null,
				entity_struck: (props.modelValue?.lightning_bolt)
					? props.modelValue.lightning_bolt.entity_struck
					: null,
			}
		} as entity);

		const createEntity = (d: 'passenger' | 'struck') => {
			if (d === 'passenger') {
				if (data.value.passenger === null)
					data.value.passenger = {} as entity;
			} else {
				if (data.value.lightning_bolt.entity_struck === null)
					data.value.lightning_bolt.entity_struck = {} as entity;
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

			createEntity
		};
	}
});
</script>

<style scoped>

</style>
