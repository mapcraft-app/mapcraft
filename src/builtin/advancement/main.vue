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
					<q-btn
						color="green" outline
						square icon="add"
						class="button-add-adv"
						@click="addAdvancement()"
					/>
					<q-list separator>
						<q-item
							v-for="(adv, index) of advancementsList"
							:key="adv.data.id"
							v-ripple
							clickable
							:class="(index === indexAdv) ? 'select-adv': ''"
							@click="selectAdvancement(index)"
						>
							<q-item-section>{{ adv.data.name }}</q-item-section>
						</q-item>
					</q-list>
				</div>
				<div class="tree">
					<template v-if="indexAdv >= 0">
						<div class="top">
							<q-input v-model="advancementsList[indexAdv].data.name" label="Name" class="input" />
							<div>
								<q-btn
									square color="green"
									icon="save" unelevated
									@click="saveAll()"
								/>
								<q-btn
									square color="red"
									icon="delete" unelevated
									@click="deleteFile()"
								/>
							</div>
						</div>
						<div v-if="advancementsList[indexAdv].data" class="bottom column">
							<graph-tree
								:key="calcChildNumber(advancementsList[indexAdv].data)"
								:advancement="advancementsList[indexAdv].data.data"
								:last-line="['root']"
								:root="true"
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
						vertical
						class="text-teal q-pa-sm"
					>
						<q-tab
							v-if="selectedAdvancement.isRoot"
							name="root"
							icon="tag"
							label="Root"
						/>
						<q-tab name="title" icon="title" label="Display" />
						<q-tab name="criteria" icon="list" label="Criteria" />
						<q-tab name="requirements" icon="checklist" label="Requirements" />
						<q-tab name="rewards" icon="star" label="Rewards" />
					</q-tabs>
				</div>
				<div v-if="isEdit" class="def">
					<q-tab-panels
						:key="selectedAdvancement.child.id"
						v-model="tab"
						animated
						transition-prev="fade"
						transition-next="fade"
						class="invisible-back"
					>
						<q-tab-panel v-if="selectedAdvancement.isRoot" name="root">
							<tab-root v-model="advancementsList[indexAdv].data.background" />
						</q-tab-panel>
						<q-tab-panel name="title">
							<tab-display @update="saveAdvancement()" />
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
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { capitalize } from 'vue/plugins/app';
import { mapStore } from 'store/map';
import { adv, getChild, saveChild, selectedAdvancement, numberOfChild, initChild } from './lib/getChild';
import reduceJson from './lib/reduceJson';
import { main } from './model';
import { advancementsList, indexAdv, selectedNode, resetStore } from './store';

import GraphTree from './components/graph/tree.vue';
import TabRoot from './components/tab/root.vue';
import TabDisplay from './components/tab/display/display.vue';
import TabCriteria from './components/tab/criteria/main.vue';
import TabRequirements from './components/tab/requirements.vue';
import TabRewards from './components/tab/rewards.vue';

export default defineComponent({
	name: 'Advancement',
	components: {
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
		const tab = ref<'root' | 'title' | 'criteria' | 'requirements' | 'rewards'>('root');
		let autosaveInterval: NodeJS.Timer; // eslint-disable-line no-undef

		const selectAdvancement = (index: number) => {
			if (indexAdv.value !== -1)
				saveFile();
			indexAdv.value = index;
			selectedAdvancement.value = {} as adv;
			numberOfChild.value = -1;
			if (!Object.prototype.hasOwnProperty.call(advancementsList.value[indexAdv.value].data, 'data'))
				initChild(advancementsList.value[indexAdv.value].data);
		};
		const calcChildNumber = (main: main) => (main.data && main.data.children)
			? main.data.children.length
			: 0;
		const addAdvancement = () => {
			window.advancement.create()
				.then((d) => advancementsList.value.push(d))
				.catch((e) => {
					console.error(e);
					$q.notify({
						group: false,
						timeout: 2500,
						icon: 'error',
						position: 'top-right',
						color: 'red-7',
						message: capitalize(t('builtin.advancement.main.fsError'))
					});
				});
		};

		const saveFile = async (autosave = false) => {
			if (indexAdv.value === -1)
				return;
			const notif = $q.notify({
				group: false,
				timeout: 0,
				position: 'top-right',
				spinner: QSpinnerPuff,
				color: 'orange-7',
				message: autosave
					? capitalize(t('builtin.advancement.main.autosave.start'))
					: capitalize(t('builtin.advancement.main.save.start'))
			});
			window.advancement.save(
				JSON.stringify({
					path: advancementsList.value[indexAdv.value].path,
					data: reduceJson(advancementsList.value[indexAdv.value].data) as main
				})
			)
				.then(() => {
					notif({
						color: 'green-7',
						spinner: false,
						icon: 'task_alt',
						timeout: 2500,
						message: autosave
							? capitalize(t('builtin.advancement.main.autosave.end'))
							: capitalize(t('builtin.advancement.main.save.end'))
					});
				})
				.catch((e) => {
					window.log.error(e);
					if (e.code) {
						notif({
							color: 'red-7',
							spinner: false,
							icon: 'error',
							timeout: 2500,
							message: capitalize(t('builtin.advancement.main.fsError'))
						});
					} else {
						notif({
							color: 'red-7',
							spinner: false,
							icon: 'error',
							timeout: 2500,
							message: autosave
								? capitalize(t('builtin.advancement.main.autosave.fail'))
								: capitalize(t('builtin.advancement.main.save.fail'))
						});
					}
				});
		};
		const deleteFile = () => {
			if (indexAdv.value === -1)
				return;
			const notif = $q.notify({
				group: false,
				timeout: 0,
				position: 'top-right',
				spinner: QSpinnerPuff,
				color: 'orange-7',
				message: capitalize(t('builtin.advancement.main.delete.start'))
			});
			window.advancement.delete(JSON.stringify(advancementsList.value[indexAdv.value]))
				.then(() => {
					advancementsList.value.splice(indexAdv.value, 1);
					indexAdv.value = -1;
					notif({
						color: 'green-7',
						spinner: false,
						icon: 'task_alt',
						timeout: 2500,
						message: capitalize(t('builtin.advancement.main.delete.end'))
					});
				})
				.catch((e) => {
					window.log.error(e);
					if (e.code) {
						notif({
							color: 'red-7',
							spinner: false,
							icon: 'error',
							timeout: 2500,
							message: capitalize(t('builtin.advancement.main.rmError'))
						});
					} else {
						notif({
							color: 'red-7',
							spinner: false,
							icon: 'error',
							timeout: 2500,
							message: capitalize(t('builtin.advancement.main.delete.fail'))
						});
					}
				});
		};

		const saveAdvancement = () => {
			if (indexAdv.value >= 0
				&& Object.keys(selectedAdvancement.value).length > 0
				&& 'child' in selectedAdvancement.value
				&& 'id' in selectedAdvancement.value.child
				&& selectedAdvancement.value.child.id !== '__DEFINE__'
			)
				saveChild(advancementsList.value[indexAdv.value].data);
		};
		const saveAll = (autosave = false) => {
			saveAdvancement();
			saveFile(autosave);
		};

		const isEdit = computed(() => advancementsList.value.length > 0 && indexAdv.value >= 0 && Object.keys(selectedAdvancement.value).length > 0);

		onBeforeMount(() => {
			resetStore(true);
			window.advancement.init(store.getMapPath(), store.minecraftVersion);
			advancementsList.value = window.advancement.gets();
			autosaveInterval = setInterval(() => saveAll(true), 300000 /* 5min */);

			watch(selectedNode, (node) => {
				if (!node)
					return;
				if (Object.keys(selectedAdvancement.value).length)
					saveAdvancement();
				getChild(advancementsList.value[indexAdv.value].data, node);
				if (!selectedAdvancement.value.isRoot && tab.value === 'root')
					tab.value = 'title';
			});
		});

		onBeforeUnmount(() => {
			clearInterval(autosaveInterval);
			saveAll();
			resetStore(true);
		});

		return {
			splitter: ref(50),
			idOfRoot,
			advancementsList,
			indexAdv,
			selectedAdvancement,
			tab,

			selectAdvancement,
			addAdvancement,
			calcChildNumber,

			saveFile,
			deleteFile,
			saveAdvancement,
			saveAll,
			isEdit
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
.button-add-adv {
	margin: 0.2em;
	width: calc(100% - 0.4em);
}
.select-adv {
	background-color: rgba(0,0,0,0.2);
}
.invisible-back {
	background-color: rgba(0,0,0,0);
}
</style>
