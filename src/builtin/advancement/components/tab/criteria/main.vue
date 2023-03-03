<template>
	<template
		v-for="(criteria, i) of $props.modelValue"
		:key="i"
	>
		<div class="full-width flex justify-between no-wrap q-mb-xs">
			<div></div>
			<span class="text-h6 text-weight-light">
				{{ $t(`builtin.advancement.trigger.${getTrad(criteria.trigger)}`) }}
			</span>
			<q-btn
				color="red" unelevated square
				outline icon="delete"
			/>
		</div>
		<q-separator class="q-mb-sm" />
		<bee-nest-destroyed
			v-if="criteria.trigger === 'bee_nest_destroyed'"
			v-model="$props.modelValue[i].conditions"
		/>
		<bred-animals
			v-else-if="criteria.trigger === 'bred_animals'"
			v-model="$props.modelValue[i].conditions"
		/>
		<brewed-potion
			v-else-if="criteria.trigger === 'brewed_potion'"
			v-model="$props.modelValue[i].conditions"
		/>
		<changed-dimension
			v-else-if="criteria.trigger === 'changed_dimension'"
			v-model="$props.modelValue[i].conditions"
		/>
		<channeled-lightning
			v-else-if="criteria.trigger === 'channeled_lightning'"
			v-model="$props.modelValue[i].conditions"
		/>
		<construct-beacon
			v-else-if="criteria.trigger === 'construct_beacon'"
			v-model="$props.modelValue[i].conditions"
		/>
		<consume-item
			v-else-if="criteria.trigger === 'consume_item'"
			v-model="$props.modelValue[i].conditions"
		/>
		<cured-zombie-villager
			v-else-if="criteria.trigger === 'cured_zombie_villager'"
			v-model="$props.modelValue[i].conditions"
		/>
		<effects-changed
			v-else-if="criteria.trigger === 'effects_changed'"
			v-model="$props.modelValue[i].conditions"
		/>
		<enchanted-item
			v-else-if="criteria.trigger === 'enchanted_item'"
			v-model="$props.modelValue[i].conditions"
		/>
		<enter-block
			v-else-if="criteria.trigger === 'enter_block'"
			v-model="$props.modelValue[i].conditions"
		/>
		<entity-hurt-player
			v-else-if="criteria.trigger === 'entity_hurt_player'"
			v-model="$props.modelValue[i].conditions"
		/>
		<entity-killed-player
			v-else-if="criteria.trigger === 'entity_killed_player'"
			v-model="$props.modelValue[i].conditions"
		/>
		<filled-bucket
			v-else-if="criteria.trigger === 'filled_bucket'"
			v-model="$props.modelValue[i].conditions"
		/>
		<fishing-rod-hooked 
			v-else-if="criteria.trigger === 'fishing_rod_hooked'"
			v-model="$props.modelValue[i].conditions"
		/>
		<hero-of-the-village
			v-else-if="criteria.trigger === 'hero_of_the_village'"
			v-model="$props.modelValue[i].conditions"
		/>
		<div v-else-if="criteria.trigger === 'impossible'">
			impossible
		</div>
		<inventory-changed
			v-else-if="criteria.trigger === 'inventory_changed'"
			v-model="$props.modelValue[i].conditions"
		/>
		<item-durability-changed
			v-else-if="criteria.trigger === 'item_durability_changed'"
			v-model="$props.modelValue[i].conditions"
		/>
		<item-used-on-block
			v-else-if="criteria.trigger === 'item_used_on_block'"
			v-model="$props.modelValue[i].conditions"
		/>
		<killed-by-crossbow
			v-else-if="criteria.trigger === 'killed_by_crossbow'"
			v-model="$props.modelValue[i].conditions"
		/>
		<template v-else>
			<span>Not found</span>
		</template>
	</template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, watch } from 'vue';
import { criteria } from '../../../conditions';
import { trigger } from '../../../model';

import BeeNestDestroyed from './bee_nest_destroyed.vue';
import BredAnimals from './bred_animals.vue';
import BrewedPotion from './brewed_potion.vue';
import ChangedDimension from './changed_dimension.vue';
import ChanneledLightning from './channeled_lightning.vue';
import ConstructBeacon from './construct_beacon.vue';
import ConsumeItem from './consume_item.vue';
import CuredZombieVillager from './cured_zombie_villager.vue';
import EffectsChanged from './effects_changed.vue';
import EnchantedItem from './enchanted_item.vue';
import EnterBlock from './enter_block.vue';
import EntityHurtPlayer from './entity_hurt_player.vue';
import EntityKilledPlayer from './entity_killed_player.vue';
import FilledBucket from './filled_bucket.vue';
import FishingRodHooked from './fishing_rod_hooked.vue';
import HeroOfTheVillage from './hero_of_the_village.vue';
import InventoryChanged from './inventory_changed.vue';
import ItemDurabilityChanged from './item_durability_changed.vue';
import ItemUsedOnBlock from './item_used_on_block.vue';
import KilledByCrossbow from './killed_by_crossbow.vue';

export default defineComponent({
	name: 'TabCriteria',
	components: {
		BeeNestDestroyed,
		BredAnimals,
		BrewedPotion,
		ChangedDimension,
		ChanneledLightning,
		ConstructBeacon,
		ConsumeItem,
		CuredZombieVillager,
		EffectsChanged,
		EnchantedItem,
		EnterBlock,
		EntityHurtPlayer,
		EntityKilledPlayer,
		FilledBucket,
		FishingRodHooked,
		HeroOfTheVillage,
		InventoryChanged,
		ItemDurabilityChanged,
		ItemUsedOnBlock,
		KilledByCrossbow
	},
	props: {
		modelValue: {
			type: Object as PropType<Record<criteria, trigger>>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const getTrad = (c: criteria) => c.toLowerCase().replace(/([-_][a-z])/g, group =>
			group
				.toUpperCase()
				.replace('-', '')
				.replace('_', '')
		);

		onBeforeMount(() => {
			watch(props.modelValue, (val) => emit('update:modelValue', val));
		});

		return {
			getTrad
		};
	}
});
</script>

<style scoped>
</style>
