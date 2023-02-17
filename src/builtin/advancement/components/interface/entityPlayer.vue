<!-- This component is complex because of the concept of infinite objects related to the advancement format -->
<template>
	<template v-if="!isPlayer">
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
				@click="createPlayer()"
			>
				<div class="q-pa-sm">
					<interface-entity
						v-if="data.player !== null"
						v-model="data.player"
						:is-player="true"
					/>
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
	<template v-else>
		<select-gamemode v-model="data.gamemode" />
		<q-input v-model="data.team" label="Team" />
		<div class="column items-center">
			<span class="text-body2 q-pt-sm">Level</span>
			<type-number-range v-model="data.level" />
		</div>
		<q-card bordered square flat class="q-pa-sm column justify-center items-center q-mt-sm q-mb-sm">
			<span class="text-center">Recipes</span>
			<type-recipe v-model="data.recipes" />
		</q-card>
		<q-card bordered square flat class="q-pa-sm column justify-center items-center q-mt-sm q-mb-sm">
			<span class="text-center">Advancements</span>
			<type-state v-model="data.advancements" />
		</q-card>
		<q-card bordered square flat class="q-pa-sm column justify-center items-center q-mt-sm q-mb-sm">
			<span class="text-center">Stats</span>
			<type-stats v-model="data.stats" />
		</q-card>
		<q-list bordered class="q-mt-sm">
			<q-expansion-item
				expand-separator
				label="Targeted Entity"
			>
				<div class="column q-pa-sm">
					<interface-entity v-model="data.targeted_entity" />
				</div>
			</q-expansion-item>
			<q-expansion-item
				expand-separator
				label="Looking At"
			>
				<div class="column q-pa-sm">
					<interface-entity v-model="data.looking_at" />
				</div>
			</q-expansion-item>
			<q-expansion-item
				expand-separator
				label="Vehicle"
			>
				<div class="column q-pa-sm">
					<interface-entity v-model="data.vehicle" />
				</div>
			</q-expansion-item>
			<q-expansion-item
				expand-separator
				label="Stepping On"
			>
				<div class="column q-pa-sm">
					<interface-biome v-model="data.stepping_on" />
				</div>
			</q-expansion-item>
		</q-list>
	</template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref, watch } from 'vue';
import SelectEntity from '../select/entity.vue';
import InterfaceBiome from './biome.vue';
import InterfaceDistance from './distance.vue';
import InterfaceEffect from './effect.vue';
import InterfaceEquipement from './equipement.vue';
import SelectGamemode from '../select/gamemode.vue';
import TypeNumberRange from '../type/numberRange.vue';
import TypeRecipe from '../type/recipe.vue';
import TypeState from '../type/state.vue';
import TypeStats from '../type/stats.vue';
import { entity, player } from '../../model';

export default defineComponent({
	name: 'InterfaceEntity',
	components: {
		SelectEntity,
		InterfaceBiome,
		InterfaceDistance,
		InterfaceEffect,
		InterfaceEquipement,
		SelectGamemode,
		TypeNumberRange,
		TypeRecipe,
		TypeState,
		TypeStats
	},
	props: {
		modelValue: {
			type: [Object, null] as PropType<entity | player | any>,
			required: true
		},
		isPlayer: {
			type: Boolean as PropType<boolean>,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		let data = ref<any>();

		if (!props.isPlayer) {
			data.value = {
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
						? props.modelValue?.flags.is_baby
						: false,
					is_on_fire: (props.modelValue?.flags)
						? props.modelValue?.flags.is_on_fire
						: false,
					is_sneaking: (props.modelValue?.flags)
						? props.modelValue?.flags.is_sneaking
						: false,
					is_sprinting: (props.modelValue?.flags)
						? props.modelValue?.flags.is_sprinting
						: false,
					is_swimming:( props.modelValue?.flags)
						? props.modelValue?.flags.is_swimming
						: false,
				},
				lightning_bolt: {
					blocks_set_on_fire: (props.modelValue?.lightning_bolt)
						? props.modelValue?.lightning_bolt.blocks_set_on_fire
						: null,
					entity_struck: (props.modelValue?.lightning_bolt)
						? props.modelValue?.lightning_bolt.entity_struck
						: null,
				}
			} as entity;
		} else {
			data.value = {
				gamemode: props.modelValue?.gamemode ?? null,
				team: props.modelValue?.team ?? null,
				level: props.modelValue?.level ?? null,
				recipes: props.modelValue?.recipes ?? null,
				advancements: props.modelValue?.advancements ?? null,
				stats: props.modelValue?.stats ?? null,
				targeted_entity: props.modelValue?.targeted_entity ?? null,
				looking_at: props.modelValue?.looking_at ?? null,
				vehicle: props.modelValue?.vehicle ?? null,
				stepping_on: props.modelValue?.stepping_on ?? null
			} as player;
		}

		const createEntity = (d: 'passenger' | 'struck') => {
			if (d === 'passenger') {
				if (data.value.passenger === null)
					data.value.passenger = {} as entity;
			} else {
				if (data.value.lightning_bolt.entity_struck === null)
					data.value.lightning_bolt.entity_struck = {} as entity;
			}
		};

		const createPlayer = () => {
			data.value.player = {} as player;
		};

		onBeforeMount(() => {
			watch(data, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			data,
			createEntity,
			createPlayer
		};
	}
});
</script>
