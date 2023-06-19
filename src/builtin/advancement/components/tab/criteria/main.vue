<template>
	<q-btn
		outline color="green"
		icon="add" class="full-width"
		@click="addCriteria()"
	/>

	<q-card
		v-for="(criteria, i) of selectedAdvancement.child.data.criteria"
		:key="i"
		class="q-mt-sm"
		flat bordered square
	>
		<div
			class="row full-width no-wrap justify-between q-pa-xs"
			style="background-color: rgba(0, 0, 0, .05);"
		>
			<div class="row main-select ">
				<q-input
					v-model="selectedAdvancement.child.data.criteria[i].name"
					label="Criteria name"
					class="select"
				/>
				<q-select
					v-model="selectedAdvancement.child.data.criteria[i].trigger"
					:options="criterias"
					class="select"
					outlined square
					emit-value
					map-options
					@update:model-value="changeTrigger(i)"
				/>
			</div>
			<q-btn
				color="red" unelevated square
				outline icon="delete"
				@click="deleteCriteria(i)"
			/>
		</div>
		<div class="q-pa-xs">
			<allay-drop-item-on-block
				v-if="criteria.trigger === 'allay_drop_item_on_block'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<avoid-vibration
				v-else-if="criteria.trigger === 'avoid_vibration'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<bee-nest-destroyed
				v-else-if="criteria.trigger === 'bee_nest_destroyed'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<bred-animals
				v-else-if="criteria.trigger === 'bred_animals'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<brewed-potion
				v-else-if="criteria.trigger === 'brewed_potion'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<changed-dimension
				v-else-if="criteria.trigger === 'changed_dimension'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<channeled-lightning
				v-else-if="criteria.trigger === 'channeled_lightning'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<construct-beacon
				v-else-if="criteria.trigger === 'construct_beacon'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<consume-item
				v-else-if="criteria.trigger === 'consume_item'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<cured-zombie-villager
				v-else-if="criteria.trigger === 'cured_zombie_villager'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<effects-changed
				v-else-if="criteria.trigger === 'effects_changed'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<enchanted-item
				v-else-if="criteria.trigger === 'enchanted_item'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<enter-block
				v-else-if="criteria.trigger === 'enter_block'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<entity-hurt-player
				v-else-if="criteria.trigger === 'entity_hurt_player'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<entity-killed-player
				v-else-if="criteria.trigger === 'entity_killed_player'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<fall-from-height
				v-else-if="criteria.trigger === 'fall_from_height'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<filled-bucket
				v-else-if="criteria.trigger === 'filled_bucket'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<fishing-rod-hooked 
				v-else-if="criteria.trigger === 'fishing_rod_hooked'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<hero-of-the-village
				v-else-if="criteria.trigger === 'hero_of_the_village'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<div v-else-if="criteria.trigger === 'impossible'">
				{{ $capitalize($t('builtin.advancement.trigger.impossible')) }}
			</div>
			<inventory-changed
				v-else-if="criteria.trigger === 'inventory_changed'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<item-durability-changed
				v-else-if="criteria.trigger === 'item_durability_changed'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<item-used-on-block
				v-else-if="criteria.trigger === 'item_used_on_block'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<kill-mob-near-sculk-catalyst
				v-else-if="criteria.trigger === 'kill_mob_near_sculk_catalyst'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<killed-by-crossbow
				v-else-if="criteria.trigger === 'killed_by_crossbow'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<levitation
				v-else-if="criteria.trigger === 'levitation'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<lightning-strike
				v-else-if="criteria.trigger === 'lightning_strike'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<location
				v-else-if="criteria.trigger === 'location'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<nether-travel
				v-else-if="criteria.trigger === 'nether_travel'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<placed-block
				v-else-if="criteria.trigger === 'placed_block'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<player-generates-container-loot
				v-else-if="criteria.trigger === 'player_generates_container_loot'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<player-hurt-entity
				v-else-if="criteria.trigger === 'player_hurt_entity'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<player-interacted-with-entity
				v-else-if="criteria.trigger === 'player_interacted_with_entity'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<player-killed-entity
				v-else-if="criteria.trigger === 'player_killed_entity'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<recipe-crafted
				v-else-if="is_1_20 && criteria.trigger === 'recipe_crafted'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<recipe-unlocked
				v-else-if="criteria.trigger === 'recipe_unlocked'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<ride-entity-in-lava
				v-else-if="criteria.trigger === 'ride_entity_in_lava'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<shot-crossbow
				v-else-if="criteria.trigger === 'shot_crossbow'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<slept-in-bed
				v-else-if="criteria.trigger === 'slept_in_bed'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<slide-down-block
				v-else-if="criteria.trigger === 'slide_down_block'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<started-rinding
				v-else-if="criteria.trigger === 'started_riding'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<summoned-entity
				v-else-if="criteria.trigger === 'summoned_entity'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<tame-animal
				v-else-if="criteria.trigger === 'tame_animal'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<target-hit
				v-else-if="criteria.trigger === 'target_hit'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<thrown-item-picked-up-by-entity
				v-else-if="criteria.trigger === 'thrown_item_picked_up_by_entity'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<thrown-item-picked-up-by-player
				v-else-if="criteria.trigger === 'thrown_item_picked_up_by_player'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<div v-else-if="criteria.trigger === 'tick'">
				{{ $capitalize($t('builtin.advancement.trigger.tick')) }}
			</div>
			<used-ender-eye
				v-else-if="criteria.trigger === 'used_ender_eye'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<used-totem
				v-else-if="criteria.trigger === 'used_totem'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<using-item
				v-else-if="criteria.trigger === 'using_item'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<villager-trade
				v-else-if="criteria.trigger === 'villager_trade'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<voluntary-exile
				v-else-if="criteria.trigger === 'voluntary_exile'"
				v-model="selectedAdvancement.child.data.criteria[i].conditions"
			/>
			<template v-else>
				{{ $t('builtin.advancement.trigger.notFound') }}
			</template>
		</div>
	</q-card>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api/frontend';
import { useI18n } from 'vue-i18n';
import { capitalize } from 'vue/plugins/app';
import { mapStore } from 'src/store/map';

import { selectedAdvancement } from '../../../lib/handleAdv';
import { criteria } from '../../../interfaces/1.20';
import { triggers } from '../../../model';

import AllayDropItemOnBlock from './allay_drop_item_on_block.vue';
import AvoidVibration from './avoid_vibration.vue';
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
import FallFromHeight from './fall_from_height.vue';
import FilledBucket from './filled_bucket.vue';
import FishingRodHooked from './fishing_rod_hooked.vue';
import HeroOfTheVillage from './hero_of_the_village.vue';
import InventoryChanged from './inventory_changed.vue';
import ItemDurabilityChanged from './item_durability_changed.vue';
import ItemUsedOnBlock from './item_used_on_block.vue';
import KillMobNearSculkCatalyst from './kill_mob_near_sculk_catalyst.vue';
import KilledByCrossbow from './killed_by_crossbow.vue';
import Levitation from './levitation.vue';
import LightningStrike from './lightning_strike.vue';
import Location from './location.vue';
import NetherTravel from './nether_travel.vue';
import PlacedBlock from './placed_block.vue';
import PlayerGeneratesContainerLoot from './player_generates_container_loot.vue';
import PlayerHurtEntity from './player_hurt_entity.vue';
import PlayerInteractedWithEntity from './player_interacted_with_entity.vue';
import PlayerKilledEntity from './player_killed_entity.vue';
import RecipeCrafted from './recipe_crafted.vue';
import RecipeUnlocked from './recipe_unlocked.vue';
import RideEntityInLava from './ride_entity_in_lava.vue';
import ShotCrossbow from './shot_crossbow.vue';
import SleptInBed from './slept_in_bed.vue';
import SlideDownBlock from './slide_down_block.vue';
import StartedRinding from './started_riding.vue';
import SummonedEntity from './summoned_entity.vue';
import TameAnimal from './tame_animal.vue';
import TargetHit from './target_hit.vue';
import ThrownItemPickedUpByEntity from './thrown_item_picked_up_by_entity.vue';
import ThrownItemPickedUpByPlayer from './thrown_item_picked_up_by_player.vue';
import UsedEnderEye from './used_ender_eye.vue';
import UsedTotem from './used_totem.vue';
import UsingItem from './using_item.vue';
import VillagerTrade from './villager_trade.vue';
import VoluntaryExile from './voluntary_exile.vue';

export default defineComponent({
	name: 'TabCriteria',
	components: {
		AllayDropItemOnBlock,
		AvoidVibration,
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
		FallFromHeight,
		FilledBucket,
		FishingRodHooked,
		HeroOfTheVillage,
		InventoryChanged,
		ItemDurabilityChanged,
		ItemUsedOnBlock,
		KillMobNearSculkCatalyst,
		KilledByCrossbow,
		Levitation,
		LightningStrike,
		Location,
		NetherTravel,
		PlacedBlock,
		PlayerGeneratesContainerLoot,
		PlayerHurtEntity,
		PlayerInteractedWithEntity,
		PlayerKilledEntity,
		RecipeCrafted,
		RecipeUnlocked,
		RideEntityInLava,
		ShotCrossbow,
		SleptInBed,
		SlideDownBlock,
		StartedRinding,
		SummonedEntity,
		TameAnimal,
		TargetHit,
		ThrownItemPickedUpByEntity,
		ThrownItemPickedUpByPlayer,
		UsedEnderEye,
		UsedTotem,
		UsingItem,
		VillagerTrade,
		VoluntaryExile
	},
	setup () {
		const store = mapStore();
		const { t, locale } = useI18n();
		const criterias = ref<{ value: string, label: string }[]>([]);

		const generateCriteriaList = () => {
			criterias.value = [
				{ value: 'allay_drop_item_on_block', label: capitalize(t('builtin.advancement.trigger.allayDropItemOnBlock')) },
				{ value: 'avoid_vibration', label: capitalize(t('builtin.advancement.trigger.avoidVibration')) },
				{ value: 'bee_nest_destroyed', label: capitalize(t('builtin.advancement.trigger.beeNestDestroyed')) },
				{ value: 'bred_animals', label: capitalize(t('builtin.advancement.trigger.bredAnimals')) },
				{ value: 'brewed_potion', label: capitalize(t('builtin.advancement.trigger.brewedPotion')) },
				{ value: 'changed_dimension', label: capitalize(t('builtin.advancement.trigger.changedDimension')) },
				{ value: 'channeled_lightning', label: capitalize(t('builtin.advancement.trigger.channeledLightning')) },
				{ value: 'construct_beacon', label: capitalize(t('builtin.advancement.trigger.constructBeacon')) },
				{ value: 'consume_item', label: capitalize(t('builtin.advancement.trigger.consumeItem')) },
				{ value: 'cured_zombie_villager', label: capitalize(t('builtin.advancement.trigger.curedZombieVillager')) },
				{ value: 'effects_changed', label: capitalize(t('builtin.advancement.trigger.effectsChanged')) },
				{ value: 'enchanted_item', label: capitalize(t('builtin.advancement.trigger.enchantedItem')) },
				{ value: 'enter_block', label: capitalize(t('builtin.advancement.trigger.enterBlock')) },
				{ value: 'entity_hurt_player', label: capitalize(t('builtin.advancement.trigger.entityHurtPlayer')) },
				{ value: 'entity_killed_player', label: capitalize(t('builtin.advancement.trigger.entityKilledPlayer')) },
				{ value: 'fall_from_height', label: capitalize(t('builtin.advancement.trigger.fallFromHeight')) },
				{ value: 'filled_bucket', label: capitalize(t('builtin.advancement.trigger.filledBucket')) },
				{ value: 'fishing_rod_hooked', label: capitalize(t('builtin.advancement.trigger.fishingRodHooked')) },
				{ value: 'hero_of_the_village', label: capitalize(t('builtin.advancement.trigger.heroOfTheVillage')) },
				{ value: 'impossible', label: capitalize(t('builtin.advancement.trigger.impossible')) },
				{ value: 'inventory_changed', label: capitalize(t('builtin.advancement.trigger.inventoryChanged')) },
				{ value: 'item_durability_changed', label: capitalize(t('builtin.advancement.trigger.itemDurabilityChanged')) },
				{ value: 'item_used_on_block', label: capitalize(t('builtin.advancement.trigger.itemUsedOnBlock')) },
				{ value: 'kill_mob_near_sculk_catalyst', label: capitalize(t('builtin.advancement.trigger.killMobNearSculkCatalyst')) },
				{ value: 'killed_by_crossbow', label: capitalize(t('builtin.advancement.trigger.killedByCrossbow')) },
				{ value: 'levitation', label: capitalize(t('builtin.advancement.trigger.levitation')) },
				{ value: 'lightning_strike', label: capitalize(t('builtin.advancement.trigger.lightningStrike')) },
				{ value: 'location', label: capitalize(t('builtin.advancement.trigger.location')) },
				{ value: 'nether_travel', label: capitalize(t('builtin.advancement.trigger.netherTravel')) },
				{ value: 'placed_block', label: capitalize(t('builtin.advancement.trigger.placedBlock')) },
				{ value: 'player_generates_container_loot', label: capitalize(t('builtin.advancement.trigger.playerGeneratesContainerLoot')) },
				{ value: 'player_hurt_entity', label: capitalize(t('builtin.advancement.trigger.playerHurtEntity')) },
				{ value: 'player_interacted_with_entity', label: capitalize(t('builtin.advancement.trigger.playerInteractedWithEntity')) },
				{ value: 'player_killed_entity', label: capitalize(t('builtin.advancement.trigger.playerKilledEntity')) },
				{ value: 'recipe_crafted', label: capitalize(t('builtin.advancement.trigger.recipeCrafted')) },
				{ value: 'recipe_unlocked', label: capitalize(t('builtin.advancement.trigger.recipeUnlocked')) },
				{ value: 'ride_entity_in_lava', label: capitalize(t('builtin.advancement.trigger.rideEntityInLava')) },
				{ value: 'safely_harvest_honey', label: capitalize(t('builtin.advancement.trigger.safelyHarvestHoney')) },
				{ value: 'shot_crossbow', label: capitalize(t('builtin.advancement.trigger.shotCrossbow')) },
				{ value: 'slept_in_bed', label: capitalize(t('builtin.advancement.trigger.sleptInBed')) },
				{ value: 'slide_down_block', label: capitalize(t('builtin.advancement.trigger.slideDownBlock')) },
				{ value: 'started_rinding', label: capitalize(t('builtin.advancement.trigger.startedRinding')) },
				{ value: 'summoned_entity', label: capitalize(t('builtin.advancement.trigger.summonedEntity')) },
				{ value: 'tame_animal', label: capitalize(t('builtin.advancement.trigger.tameAnimal')) },
				{ value: 'target_hit', label: capitalize(t('builtin.advancement.trigger.targetHit')) },
				{ value: 'thrown_item_picked_up_by_entity', label: capitalize(t('builtin.advancement.trigger.thrownItemPickedUpByEntity')) },
				{ value: 'thrown_item_picked_up_by_player', label: capitalize(t('builtin.advancement.trigger.thrownItemPickedUpByPlayer')) },
				{ value: 'tick', label: capitalize(t('builtin.advancement.trigger.tick')) },
				{ value: 'used_ender_eye', label: capitalize(t('builtin.advancement.trigger.usedEnderEye')) },
				{ value: 'used_totem', label: capitalize(t('builtin.advancement.trigger.usedTotem')) },
				{ value: 'using_item', label: capitalize(t('builtin.advancement.trigger.usingItem')) },
				{ value: 'villager_trade', label: capitalize(t('builtin.advancement.trigger.villagerTrade')) },
				{ value: 'voluntary_exile', label: capitalize(t('builtin.advancement.trigger.voluntaryExile')) }
			];
		};

		const getTrad = (c: criteria) => c.toLowerCase().replace(/([-_][a-z])/g, (group: string) =>
			group
				.toUpperCase()
				.replace('-', '')
				.replace('_', '')
		);
		const generateRandomName = () => {
			return `default_${[ ...crypto.getRandomValues(new Uint8Array(8)) ]
				.map((e) =>('0' + e.toString(16)).slice(-2))
				.join('')}`;
		};

		const addCriteria = () => {
			selectedAdvancement.value.child.data.criteria.push({
				name: generateRandomName(),
				trigger: null,
				conditions: null,
			} as triggers);
		};
		const changeTrigger = (index: number) => {
			selectedAdvancement.value.child.data.criteria[index].conditions = {} as unknown;
		};
		const deleteCriteria = (index: number) => {
			selectedAdvancement.value.child.data.criteria.splice(index, 1);
		};

		const is_1_20 = computed(() => minecraft.semverCompare(store.minecraftVersion, '1.20') >= 0);

		onBeforeMount(() => {
			generateCriteriaList();
			for (let i = 0; i < selectedAdvancement.value.child.data.criteria.length; i++) {
				if (!Object.prototype.hasOwnProperty.call(selectedAdvancement.value.child.data.criteria[i], 'conditions'))
					selectedAdvancement.value.child.data.criteria[i].conditions = {} as any;
			}

			watch(locale, () => generateCriteriaList());
		});

		return {
			selectedAdvancement,
			criterias,

			getTrad,
			generateRandomName,

			addCriteria,
			changeTrigger,
			deleteCriteria,

			is_1_20
		};
	}
});
</script>

<style scoped>
.main-select {
	width: 70%;
}
.select {
	width: 50%;
}
</style>
