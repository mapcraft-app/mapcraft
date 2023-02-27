<template>
	<q-splitter
		v-model="splitter" horizontal
		separator-style="background-color: rgba(0,0,0,0)"
		style="height:100%"
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
			<div v-if="selectedAdvancement" class="def">
				<q-tabs v-model="tab" class="text-teal q-pa-sm">
					<q-tab v-if="selectedAdvancement.isRoot" name="root" icon="tag" label="Root" />
					<q-tab name="title" icon="title" label="Display" />
					<q-tab name="criteria" icon="list" label="Criteria" />
					<q-tab name="requirements" icon="checklist" label="Requirements" />
					<q-tab name="rewards" icon="star" label="Rewards" />
				</q-tabs>
				<q-tab-panels
					v-model="tab"
					animated
					transition-prev="fade"
					transition-next="fade"
				>
					<q-tab-panel v-if="selectedAdvancement.isRoot" name="root">
						<q-input
							v-model="advancementsList[indexAdv].background"
							label="Background image"
						/>
					</q-tab-panel>
					<q-tab-panel name="title">
						<tab-display v-model="selectedAdvancement.child.data.display" />
					</q-tab-panel>
					<q-tab-panel name="criteria">
					</q-tab-panel>
					<q-tab-panel name="requirements">
					</q-tab-panel>
					<q-tab-panel name="rewards">
						<tab-rewards v-model="selectedAdvancement.child.data.rewards" />
					</q-tab-panel>
				</q-tab-panels>
			</div>
		</template>
	</q-splitter>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { mapStore } from 'store/map';
import { adv, getChild } from './lib/getChild';
import { main } from './model';
import { selectedNode, resetStore } from './store';

import GraphRow from './components/graph/row.vue';
import GraphTree from './components/graph/tree.vue';

import TabDisplay from './components/tab/display/display.vue';
import TabRewards from './components/tab/rewards.vue';

export default defineComponent({
	name: 'Advancement',
	components: {
		GraphRow,
		GraphTree,
		TabDisplay,
		TabRewards
	},
	setup () {
		const store = mapStore();
		const idOfRoot = 0;
		const advancementsList = ref<main[]>([]);
		const indexAdv = ref<number>(-1);
		const selectedAdvancement = ref<adv | null>(null);
		const tab = ref<'root' | 'title' | 'criteria' | 'requirements' | 'rewards'>('root');

		const selectAdvancement = (index: number) => {
			resetStore();
			indexAdv.value = index;
			selectedAdvancement.value = null;
		};

		onBeforeMount(() => {
			window.advancement.init(store.getMapPath());
			advancementsList.value = window.advancement.getList();

			watch(selectedNode, (node) => {
				if (!node)
					return;
				selectedAdvancement.value = getChild(advancementsList.value[indexAdv.value], node);
				if (!selectedAdvancement.value.isRoot && tab.value === 'root')
					tab.value = 'title';
			});
		});

		return {
			splitter: ref(50),

			idOfRoot,
			advancementsList,
			indexAdv,
			selectedAdvancement,
			tab,
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
.def {
	overflow-y: auto;
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