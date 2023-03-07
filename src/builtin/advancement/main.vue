<template>
	<q-splitter
		v-model="splitter" horizontal
		separator-style="background-color: rgba(0,0,0,0)"
		style="height:100%"
		:limits="[20, 90]"
	>
		<template v-slot:before>
			<div class="main">
				<div class="list">
					<q-list separator>
						<q-item
							v-for="(adv, index) of advancementsList"
							:key="adv.id"
							v-ripple
							clickable
							:class="(index === indexAdv) ? 'select-adv': ''"
							@click="selectAdvancement(index)"
						>
							<q-item-section>{{ adv.name }}</q-item-section>
						</q-item>
					</q-list>
				</div>
				<div class="tree">
					<template v-if="indexAdv >= 0">
						<div class="top">
							<q-input v-model="advancementsList[indexAdv].name" label="Name" class="input" />
							<div>
								<q-btn square color="green" icon="save" unelevated />
								<q-btn square color="orange" icon="settings" unelevated />
								<q-btn square color="red" icon="delete" unelevated />
							</div>
						</div>
						<div class="bottom column">
							<graph-row
								:id="idOfRoot"
								v-model="advancementsList[indexAdv].data"
								root
							/>
							<graph-tree
								v-if="advancementsList[indexAdv].data.children?.length"
								:id="idOfRoot"
								v-model="advancementsList[indexAdv].data.children"
								:line="['empty']"
							/>
						</div>
					</template>
				</div>
			</div>
		</template>
		<template v-slot:after>
			<div v-if="selectedAdvancement" class="edit">
				<div class="left-menu">
					<q-tabs
						v-model="tab"
						class="text-teal q-pa-sm"
						vertical
					>
						<q-tab v-if="selectedAdvancement.isRoot" name="root" icon="tag" label="Root" />
						<q-tab name="title" icon="title" label="Display" />
						<q-tab name="criteria" icon="list" label="Criteria" />
						<q-tab name="requirements" icon="checklist" label="Requirements" />
						<q-tab name="rewards" icon="star" label="Rewards" />
					</q-tabs>
				</div>
				<div v-if="Object.keys(selectedAdvancement).length" class="def">
					<q-tab-panels
						:key="selectedAdvancement.child.id"
						v-model="tab"
						animated
						transition-prev="fade"
						transition-next="fade"
						style="background-color: rgba(0,0,0,0);"
						
					>
						<q-tab-panel v-if="selectedAdvancement.isRoot" name="root">
							<tab-root v-model="advancementsList[indexAdv].background" />
						</q-tab-panel>
						<q-tab-panel name="title">
							<tab-display @update="titleSave()" />
						</q-tab-panel>
						<q-tab-panel name="criteria">
							<tab-criteria />
						</q-tab-panel>
						<q-tab-panel name="requirements">
							<tab-requirements />
						</q-tab-panel>
						<q-tab-panel name="rewards">
							<tab-rewards />
						</q-tab-panel>
					</q-tab-panels>
				</div>
			</div>
		</template>
	</q-splitter>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { capitalize } from 'vue/plugins/app';
import { mapStore } from 'store/map';
import { getChild, saveChild, selectedAdvancement } from './lib/getChild';
import { main } from './model';
import { selectedNode, selectedNodeId, resetStore } from './store';

import GraphRow from './components/graph/row.vue';
import GraphTree from './components/graph/tree.vue';
import TabRoot from './components/tab/root.vue';
import TabDisplay from './components/tab/display/display.vue';
import TabCriteria from './components/tab/criteria/main.vue';
import TabRequirements from './components/tab/requirements.vue';
import TabRewards from './components/tab/rewards.vue';

export default defineComponent({
	name: 'Advancement',
	components: {
		GraphRow,
		GraphTree,
		TabRoot,
		TabDisplay,
		TabCriteria,
		TabRequirements,
		TabRewards
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const store = mapStore();
		const idOfRoot = 0;
		const advancementsList = ref<main[]>([]);
		const indexAdv = ref<number>(-1);
		const tab = ref<'root' | 'title' | 'criteria' | 'requirements' | 'rewards'>('root');
		let autosaveInterval: NodeJS.Timer; // eslint-disable-line no-undef

		const selectAdvancement = (index: number) => {
			indexAdv.value = index;
			selectedNodeId.value = -1;
		};

		//#region Save
		const save = async (autosave = false, notif = true) => {
			if (selectedAdvancement.value.child.id !== '__DEFINE__') {
				saveChild(advancementsList.value[indexAdv.value]);
				if (notif) {
					$q.notify({
						group: false,
						timeout: 2500,
						spinner: false,
						position: 'top-right',
						icon: 'task_alt',
						color: 'green-7',
						message: autosave
							? capitalize(t('builtin.advancement.main.autosave.end'))
							: capitalize(t('builtin.advancement.main.save.end'))
					});
				}
			}
		};
		const titleSave = () => save(false, false);
		//#endregion Save

		onBeforeMount(() => {
			resetStore();
			window.advancement.init(store.getMapPath(), store.minecraftVersion);
			advancementsList.value = window.advancement.getList();
			autosaveInterval = setInterval(() => save(true), 300000 /* 5min */);

			watch(selectedNode, (node) => {
				if (!node)
					return;
				if (Object.keys(selectedAdvancement.value).length)
					save();
				getChild(advancementsList.value[indexAdv.value], node);
				if (!selectedAdvancement.value.isRoot && tab.value === 'root')
					tab.value = 'title';
			});
		});

		onBeforeUnmount(() => {
			clearInterval(autosaveInterval);
			save(true);
		});

		return {
			splitter: ref(50),
			idOfRoot,
			advancementsList,
			indexAdv,
			selectedAdvancement,
			tab,

			titleSave,
			selectAdvancement
		};
	}
});
</script>

<style scoped>
.main {
	display: flex;
  height: 100%;
}
.edit {
	display: flex;
	flex-wrap: nowrap;
	flex-direction: row;
}
.edit div.left-menu {
	width: fit-content;
	position: sticky;
	top: 0;
	height: fit-content;
}
.def {
	width: -webkit-fill-available;
}
.list {
	width: 20vw;
	overflow: auto;
	border-right: 1px solid rgba(150, 150, 150, .5);
	border-bottom: 1px solid rgba(150, 150, 150, .5);
}
.tree {
	width: 80vw;
	border-bottom: 1px solid rgba(150, 150, 150, .5);
}
.top {
	display: inline-flex;
	flex-wrap: nowrap;
	align-items: center;
	width: inherit;
	justify-content: space-around;
	height: 4.5em;
	border-bottom: 1px solid rgba(150, 150, 150, .5);
}
.top > .input {
	width: 40%;
}
.bottom {
	height: calc(100% - 4.5em);
	max-height: calc(100% - 4.5em);
	overflow: auto;
	flex-wrap: nowrap;
}

.select-adv {
	background-color: rgba(0,0,0,0.2);
}
</style>