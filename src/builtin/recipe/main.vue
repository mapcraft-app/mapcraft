<template>
	<q-splitter
		v-model="splitter"
		:limits="[15,35]"
	>
		<template v-slot:before>
			<list @select="handleListSelection" />
		</template>
		<template v-slot:after>
			<q-tabs
				v-model="selectedRecipeType"
				dense
				infinite
				class="text-grey"
				active-color="primary"
				indicator-color="primary"
				align="justify"
			>
				<q-tab name="player">
					<q-img :src="$toPublic('imgs/minecraft/player.png')" />
				</q-tab>
				<q-tab name="crafting">
					<q-img :src="$toPublic('imgs/minecraft/block/crafting_table.webp')" />
				</q-tab>
				<q-tab name="minecraft:smelting">
					<q-img :src="$toPublic('imgs/minecraft/block/furnace.webp')" />
				</q-tab>
				<q-tab name="minecraft:blasting">
					<q-img :src="$toPublic('imgs/minecraft/block/blast_furnace.webp')" />
				</q-tab>
				<q-tab name="minecraft:campfire_cooking">
					<q-img :src="$toPublic('imgs/minecraft/block/campfire.webp')" />
				</q-tab>
				<q-tab name="minecraft:smoking">
					<q-img :src="$toPublic('imgs/minecraft/block/smoker.webp')" />
				</q-tab>
				<q-tab name="minecraft:stonecutting">
					<q-img :src="$toPublic('imgs/minecraft/block/stonecutter.webp')" />
				</q-tab>
				<q-tab name="minecraft:smithing">
					<q-img :src="$toPublic('imgs/minecraft/block/smithing_table.webp')" />
				</q-tab>
			</q-tabs>
			<q-tab-panels
				v-model="selectedRecipeType"
				class="tab transparent"
				animated
				@transition="reset()"
			>
				<q-tab-panel name="player" class="q-pa-none">
					<craft-player
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
				<q-tab-panel name="crafting" class="q-pa-none">
					<craft-table
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
				<q-tab-panel name="minecraft:smelting" class="q-pa-none">
					<furnace
						type="minecraft:smelting"
						:name="$capitalize($t('builtin.recipe.tabs.furnace'))"
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
				<q-tab-panel name="minecraft:blasting" class="q-pa-none">
					<furnace
						type="minecraft:blasting"
						:name="$capitalize($t('builtin.recipe.tabs.blast'))"
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
				<q-tab-panel name="minecraft:campfire_cooking" class="q-pa-none">
					<furnace
						type="minecraft:campfire_cooking"
						:name="$capitalize($t('builtin.recipe.tabs.campfire'))"
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
				<q-tab-panel name="minecraft:smoking" class="q-pa-none">
					<furnace
						type="minecraft:smoking"
						:name="$capitalize($t('builtin.recipe.tabs.smoker'))"
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
				<q-tab-panel name="minecraft:stonecutting" class="q-pa-none">
					<stonecutter
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
				<q-tab-panel name="minecraft:smithing" class="q-pa-none">
					<smithing
						:selection="selectionReturn"
						@open-dialog="openDialog"
						@create="creationSuccessNotif"
						@error="creationErrorNotif"
						@delete="deletion"
					/>
				</q-tab-panel>
			</q-tab-panels>
		</template>
	</q-splitter>
	<keep-alive>
		<dialog-item-selection
			:modal="openSelectionModal"
			@close="handleClose"
			@selected="handleSelection"
		/>
	</keep-alive>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { mapStore } from '@/store/map';
import { capitalize } from '@/app/plugins/app';
import {
	selectedRecipeType,
	selectedRecipeData,
	selectedRecipeName
} from './store';
import list from './components/list.vue';
import dialogItemSelection from './components/dialog.vue';
import craftPlayer from './components/craftPlayer.vue';
import craftTable from './components/craftTable.vue';
import furnace from './components/furnace.vue';
import smithing from './components/smithing.vue';
import stonecutter from './components/stonecutter.vue';

export default defineComponent({
	name: 'BuiltinRecipeMain',
	components: {
		list,
		dialogItemSelection,
		craftPlayer,
		craftTable,
		furnace,
		smithing,
		stonecutter
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const storeMap = mapStore();

		const splitter = ref<number>(30);
		const openSelectionModal = ref<boolean>(false);
		const saveModalData = ref<{ type: 'recipe' | 'result', id: number}>();
		const selectionReturn = ref<{
			type: 'block' | 'item',
			id: string,
			path: string, case: number
		}>();
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

		const handleListSelection = (recipe: any) => {
			window.recipe.file.read(recipe.path)
				.then((data) => JSON.parse(data))
				.then((data) => {
					selectedRecipeName.value = recipe.name;
					selectedRecipeType.value = window.recipe.read.type(data);
					selectedRecipeData.value = data;
				})
				.catch((e) => $q.notify({
					position: 'top-right',
					message: capitalize(e),
					icon: 'error',
					color: 'red-7'
				}));
		};

		const reset = () => {
			selectedRecipeName.value = null;
			selectedRecipeData.value = null;
		};

		const creationSuccessNotif = (name: string) => {
			$q.notify({
				position: 'top-right',
				message: capitalize(t('builtin.recipe.notify.create', { name })),
				icon: 'check_circle',
				color: 'green-7'
			});
		};

		const creationErrorNotif = (name: string) => {
			$q.notify({
				position: 'top-right',
				message: capitalize(t('builtin.recipe.notify.createError', { name })),
				icon: 'error',
				color: 'red-7'
			});
		};

		const deletion = (name: string) => {
			window.recipe.file.delete(name)
				.then(() => $q.notify({
					position: 'top-right',
					message: capitalize(t('builtin.recipe.notify.delete', { name })),
					icon: 'check_circle',
					color: 'green-7'
				}))
				.then(() => reset())
				.catch((e) => {
					window.log.error('delete', e);
					$q.notify({
						position: 'top-right',
						message: capitalize(t('builtin.recipe.notify.deleteError', { name })),
						icon: 'error',
						color: 'red-7'
					});
				});
		};

		onBeforeMount(() => window.recipe.init(storeMap.getMapPath(), storeMap.minecraftVersion));

		return {
			selectedRecipeType,
			selectedRecipeData,

			splitter,
			openSelectionModal,
			saveModalData,
			selectionReturn,
			handleClose,
			handleSelection,
			openDialog,

			handleListSelection,
			reset,

			creationSuccessNotif,
			creationErrorNotif,
			deletion
		};
	}
});
</script>

<style scoped>
.q-tab img {
	width: 3em;
}
.q-panel > div {
	height: unset;
}
.main {
	height: inherit;
}
.left {
	width: 30%;
	border-right: 1px solid #c1c1c1;
}
.right {
	width: 70%
}
.tab {
	height: calc(100% - 65px);
}
.transparent {
	background-color: transparent;
}
</style>
