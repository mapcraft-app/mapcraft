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
		<q-tab-panels
			v-model="selectedTab"
			animated
			transition-prev="fade"
			transition-next="fade"
		>
			<q-tab-panel name="player" class="q-pa-none">
				<craft-player-vue
					:selection="selectionReturn"
					@open-dialog="openDialog"
					@create="creation"
					@delete="deletion"
				/>
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
		<keep-alive>
			<dialog-vue
				:modal="openSelectionModal"
				@close="handleClose"
				@selected="handleSelection"
			/>
		</keep-alive>
	</q-page>
</template>

<script lang="ts">
// import { useQuasar } from 'quasar';
// import { useI18n } from 'vue-i18n';
//import { mapStore } from 'store/map';
//import { capitalize } from 'app/src/vue/plugins/app';
import { defineComponent, ref, onBeforeMount } from 'vue';
import { mapStore } from 'store/map';
import { tableGen, tabsName } from './interface';

import craftPlayerVue from './components/craftPlayer.vue';
import craftTableVue from './components/craftTable.vue';
import furnaceVue from './components/furnace.vue';
import dialogVue from './components/dialog.vue';
import smithingVue from './components/smithing.vue';
import stonecutterVue from './components/stonecutter.vue';

export default defineComponent({
	name: 'CutsceneBuiltin',
	components: {
		craftPlayerVue,
		craftTableVue,
		furnaceVue,
		dialogVue,
		smithingVue,
		stonecutterVue
	},
	setup () {
		const storeMap = mapStore();
		//const $q = useQuasar();
		//const { t } = useI18n();
		const selectedTab = ref<tabsName>('player');

		//#region Block/Item Modal
		const openSelectionModal = ref<boolean>(false);
		const saveModalData = ref<{ type: 'recipe' | 'result', id: number}>();
		const selectionReturn = ref<{ type: 'block' | 'item', id: string, path: string, case: number }>();

		const handleClose = () => {
			openSelectionModal.value = false;
		};

		const handleSelection = (data: { type: 'block' | 'item', path: string, selected: string }) => {
			openSelectionModal.value = false;
			if (!saveModalData.value)
				return;
			selectionReturn.value = {
				type: data.type,
				id: data.selected,
				path: data.path,
				case: saveModalData.value.id
			};
		};
		
		const openDialog = (data: { type: 'recipe' | 'result', id: number}) => {
			saveModalData.value = data;
			openSelectionModal.value = true;
		};
		//#endregion Handle modal

		//#region Creation/Deletion
		const creation = (d: tableGen) => {
			window.recipe.generate.table(d)
				.then((e) => console.log(e))
				.catch((e) => console.error(e));
		};

		const deletion = (name: tableGen) => {
			console.log('delete', name);
		};
		//#endregion Creation/Deletion

		onBeforeMount(() => window.recipe.init(storeMap.getMapPath(), storeMap.minecraftVersion));

		return {
			selectedTab,
			//#region Block/Item Modal
			openSelectionModal,
			saveModalData,
			selectionReturn,

			handleClose,
			handleSelection,
			openDialog,
			//#endregion Block/Item Modal

			//#region Creation/Deletion
			creation,
			deletion
			//#endregion Creation/Deletion
		};
	}
});
</script>

<style scoped>
.q-tab img {
	width: 3em;
}
</style>
