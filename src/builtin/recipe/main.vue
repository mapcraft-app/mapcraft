<template>
	<q-page style="height: calc(100vh - 79px);">
		<q-tabs
			v-model="selectedTab"
			dense
			infinite
			class="text-grey q-pb-md"
			active-color="primary"
			indicator-color="primary"
			align="justify"
		>
			<q-tab name="player">
				<img src="imgs/minecraft/player.png" />
			</q-tab>
			<q-tab name="craft">
				<img src="imgs/minecraft/block/crafting_table.webp" />
			</q-tab>
			<q-tab name="furnace">
				<img src="imgs/minecraft/block/furnace.webp" />
			</q-tab>
			<q-tab name="blast">
				<img src="imgs/minecraft/block/blast_furnace.webp" />
			</q-tab>
			<q-tab name="campfire">
				<img src="imgs/minecraft/block/campfire.webp" />
			</q-tab>
			<q-tab name="smoker">
				<img src="imgs/minecraft/block/smoker.webp" />
			</q-tab>
			<q-tab name="stonecutter">
				<img src="imgs/minecraft/block/stonecutter.webp" />
			</q-tab>
			<q-tab name="smithing">
				<img src="imgs/minecraft/block/smithing_table.webp" />
			</q-tab>
		</q-tabs>
		<q-tab-panels v-model="selectedTab" animated style="height: 100%">
			<q-tab-panel name="player" class="q-pa-none">
				<craft-player-vue />
			</q-tab-panel>
			<q-tab-panel name="craft" class="q-pa-none">
				<craft-table-vue />
			</q-tab-panel>
			<q-tab-panel name="furnace" class="q-pa-none">
				<furnace-vue
					name="Furnace"
				/>
			</q-tab-panel>
			<q-tab-panel name="blast" class="q-pa-none">
				<furnace-vue
					name="Blast"
				/>
			</q-tab-panel>
			<q-tab-panel name="campfire" class="q-pa-none">
				<furnace-vue
					name="Campfire"
				/>
			</q-tab-panel>
			<q-tab-panel name="smoker" class="q-pa-none">
				<furnace-vue
					name="Smoker"
				/>
			</q-tab-panel>
			<q-tab-panel name="stonecutter" class="q-pa-none">
				<stonecutter-vue />
			</q-tab-panel>
			<q-tab-panel name="smithing" class="q-pa-none">
				<smithing-vue />
			</q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script lang="ts">
// import { useQuasar } from 'quasar';
// import { useI18n } from 'vue-i18n';
import { defineComponent, ref } from 'vue';
//import { mapStore } from 'store/map';
//import { capitalize } from 'app/src/vue/plugins/app';

import craftPlayerVue from './craftPlayer.vue';
import craftTableVue from './craftTable.vue';
import furnaceVue from './furnace.vue';
import smithingVue from './smithing.vue';
import stonecutterVue from './stonecutter.vue';

type Tabs = 'player' | 'craft' | 'furnace' | 'blast' | 'campfire' | 'smoker' | 'stonecutter' | 'smithing';

/**
 * shapeless, ingredients is using, and pattern & key is deleted
 * shape, ingredients is deleted, and pattern & key is using
 */
interface crafting {
	type: string,
	group: string,
	ingredients: string[],
	pattern: string[],
	key: Record<string, string>,
	result: {
		item: string,
		count: number,
	},
	isPlayer: boolean,
	exactPosition: boolean
}

/**
 * furnace: smelting
 * blast_furnace: blasting
 * campfire: campfire_cooking
 * smoker: smoking
 */
interface furnace {
	type: 'smelting' | 'blasting' | 'campfire_cooking' | 'smoking' | string,
	group: string,
	ingredient: string[],
	result: string,
	experience: number,
	cookingtime: number
}

interface stonecutter {
	ype: string,
	group: string,
	ingredient: {
		item: string
	},
	result: string,
	count: number
}

interface smithing {
	type: string,
	group: string,
	base: {
		item: string
	},
	addition: {
		item: string
	},
	result: {
		item: string
	}
}

export default defineComponent({
	name: 'CutsceneBuiltin',
	components: {
		craftPlayerVue,
		craftTableVue,
		furnaceVue,
		smithingVue,
		stonecutterVue
	},
	setup () {
		//const $q = useQuasar();
		//const { t } = useI18n();
		const selectedTab = ref<Tabs>('player');

		return {
			selectedTab
		};
	}
});
</script>

<style scoped>
.q-tab img {
	width: 3em;
}
</style>
