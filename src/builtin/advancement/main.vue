<template>
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
	<div v-if="indexAdv >= 0" class="q-pa-md">
		{{ test() }}
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { mapStore } from 'store/map';
import GraphRow from './components/graph/row.vue';
import GraphTree from './components/graph/tree.vue';

import { main } from './model';
import { selectedNode, resetStore, expand } from './store';

export default defineComponent({
	name: 'Advancement',
	components: {
		GraphRow,
		GraphTree,
	},
	setup () {
		const store = mapStore();
		const idOfRoot = 0;
		const advancementsList = ref<main[]>([]);
		const indexAdv = ref<number>(-1);

		const selectAdvancement = (index: number) => {
			resetStore();
			indexAdv.value = index;
		};

		onBeforeMount(() => {
			window.advancement.init(store.getMapPath());
			advancementsList.value = window.advancement.getList();

			watch(selectedNode, (node) => {
				if (node) {
					console.log('one');
					console.log('two', node);
				}
			});
		});

		return {
			idOfRoot,
			advancementsList,
			indexAdv,
			selectAdvancement,

			test: () => {
				const t = [] as number[];
				expand.value.forEach((e) => t.push(e));
				return t;
			}
		};
	}
});
</script>

<style scoped>
.main {
	height: 50vh;
	display: flex;
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
	height: calc(50vh - 4.5em);
	max-height: calc(50vh - 4.5em);
	overflow: auto;
	flex-wrap: nowrap;
}

.select-adv {
	background-color: rgba(0,0,0,0.2);
}
</style>