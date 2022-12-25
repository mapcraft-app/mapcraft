<template>
	<q-page style="height: calc(100vh - 79px);">
		<div class="row" style="height: inherit">
			<div style="width: 30%">
				<list-vue @select="handleListSelection" />
			</div>
			<div style="width: 70%">
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
					ref="tabsPanels"
					v-model="selectedTab"
					style="height: calc(100% - 65px);"
					animated
					transition-prev="fade"
					transition-next="fade"
					@vnode-updated="tabIsUpdate"
				>
					<q-tab-panel name="player" class="q-pa-none">
						<craft-player-vue
							:read="readPlayer"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationTable"
							@delete="deletion"
						/>
					</q-tab-panel>
					<q-tab-panel name="craft" class="q-pa-none">
						<craft-table-vue
							:read="readTable"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationTable"
							@delete="deletion"
						/>
					</q-tab-panel>
					<q-tab-panel name="furnace" class="q-pa-none">
						<furnace-vue
							name="Furnace"
							type="minecraft:smelting"
							:read="readFurnace"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationFurnace"
							@delete="deletion"
						/>
					</q-tab-panel>
					<q-tab-panel name="blast" class="q-pa-none">
						<furnace-vue
							name="Blast"
							type="minecraft:blasting"
							:read="readFurnace"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationFurnace"
							@delete="deletion"
						/>
					</q-tab-panel>
					<q-tab-panel name="campfire" class="q-pa-none">
						<furnace-vue
							name="Campfire"
							type="minecraft:campfire_cooking"
							:read="readFurnace"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationFurnace"
							@delete="deletion"
						/>
					</q-tab-panel>
					<q-tab-panel name="smoker" class="q-pa-none">
						<furnace-vue
							name="Smoker"
							type="minecraft:smoking"
							:read="readFurnace"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationFurnace"
							@delete="deletion"
						/>
					</q-tab-panel>
					<q-tab-panel name="stonecutter" class="q-pa-none">
						<stonecutter-vue
							:read="readStonecutter"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationStonecutter"
							@delete="deletion"
						/>
					</q-tab-panel>
					<q-tab-panel name="smithing" class="q-pa-none">
						<smithing-vue
							:read="readSmithing"
							:selection="selectionReturn"
							@open-dialog="openDialog"
							@create="creationSmithing"
							@delete="deletion"
						/>
					</q-tab-panel>
				</q-tab-panels>
			</div>
		</div>
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
import { defineComponent, onBeforeMount, ref, toRaw } from 'vue';
import { mapStore } from 'store/map';
import {
	tableGen,
	tabsName,
	furnaceGen,
	furnaceTable,
	smithingGen,
	stonecutterGen,
	resultTable,
	stonecutterTable,
	smithingTable
} from './interface';

import craftPlayerVue from './components/craftPlayer.vue';
import craftTableVue from './components/craftTable.vue';
import furnaceVue from './components/furnace.vue';
import listVue from './components/list.vue';
import dialogVue from './components/dialog.vue';
import smithingVue from './components/smithing.vue';
import stonecutterVue from './components/stonecutter.vue';
import { QTabPanels } from 'quasar';

interface selectedRecipe {
	name: string;
	type: tabsName;
	path: string;
}

export default defineComponent({
	name: 'CutsceneBuiltin',
	components: {
		craftPlayerVue,
		craftTableVue,
		furnaceVue,
		listVue,
		dialogVue,
		smithingVue,
		stonecutterVue
	},
	setup () {
		const tabsPanels = ref<QTabPanels | null>(null);
		const storeMap = mapStore();
		const selectedTab = ref<tabsName>('player');
		const selectedRecipe = ref<selectedRecipe | null>(null);

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

		//#region creation/deletion
		const creationTable = (d: tableGen) => {
			window.recipe.generate.table(d)
				.then((e) => console.log(e))
				.catch((e) => console.error(e));
		};

		const creationFurnace = (d: furnaceGen) => {
			window.recipe.generate.furnace(d)
				.then((e) => console.log(e))
				.catch((e) => console.error(e));
		};

		const creationStonecutter = (d: stonecutterGen) => {
			window.recipe.generate.stonecutter(d)
				.then((e) => console.log(e))
				.catch((e) => console.error(e));
		};

		const creationSmithing = (d: smithingGen) => {
			window.recipe.generate.smithing(d)
				.then((e) => console.log(e))
				.catch((e) => console.error(e));
		};

		const deletion = (name: string) => {
			console.log('delete', name);
		};
		//#endregion creation/deletion

		//#region Handle list
		const readSave = ref<{type: 'furnace' | 'stonecutter' | 'smithing' | 'table' | null, recipe: selectedRecipe, data: any} | null>(null);
		const readPlayer = ref<resultTable>();
		const readTable = ref<resultTable>();
		const readFurnace = ref<furnaceTable>();
		const readSmithing = ref<smithingTable>();
		const readStonecutter = ref<stonecutterTable>();

		const handleListSelection = (recipe: selectedRecipe) => {
			window.recipe.file.read(recipe.path)
				.then((data) => JSON.parse(data))
				.then((data) => {
					readSave.value = {
						type: window.recipe.read.type(data),
						recipe,
						data
					};
					selectedRecipe.value = recipe;
					if (selectedTab.value === recipe.type)
						tabIsUpdate();
					else
						selectedTab.value = recipe.type;
				})
				.catch((e) => console.error(e));
		};

		const tabIsUpdate = () => {
			if (readSave.value === null)
				return;
			if (readSave.value.type === 'furnace')
				readFurnace.value = window.recipe.read.furnace(readSave.value.recipe.name, toRaw(readSave.value.data));
			else if (readSave.value.type === 'smithing')
				readSmithing.value = window.recipe.read.smithing(readSave.value.recipe.name, toRaw(readSave.value.data));
			else if (readSave.value.type === 'stonecutter')
				readStonecutter.value = window.recipe.read.stonecutter(readSave.value.recipe.name, toRaw(readSave.value.data));
		 	else {
				// table
				const temp = window.recipe.read.table(readSave.value.recipe.name, toRaw(readSave.value.data));
				if (temp.cases.length === 10)
					readTable.value = temp;
				else
					readPlayer.value = temp;
			}
			readSave.value = null;
		};
		//#endregion Handle list

		onBeforeMount(() => window.recipe.init(storeMap.getMapPath(), storeMap.minecraftVersion));

		return {
			tabsPanels,
			selectedTab,
			selectedRecipe,

			//#region Block/Item Modal
			openSelectionModal,
			saveModalData,
			selectionReturn,

			handleClose,
			handleSelection,
			openDialog,
			//#endregion Block/Item Modal

			//#region creation/deletion
			creationTable,
			creationFurnace,
			creationStonecutter,
			creationSmithing,
			deletion,
			//#endregion creation/deletion

			//#region Handle list
			readSave,
			readPlayer,
			readTable,
			readFurnace,
			readSmithing,
			readStonecutter,

			handleListSelection,
			tabIsUpdate
			//#endregion Handle list
		};
	}
});
</script>

<style scoped>
.q-tab img {
	width: 3em;
}
</style>
