<template>
	<graph-row
		v-if="isRoot"
		:id="0"
		v-model="advancementsList[indexAdv].data.data"
		root
	/>
	<graph-tree
		v-if="isChild"
		:id="0"
		v-model="advancementsList[indexAdv].data.data.children"
		:line="['empty']"
	/>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import GraphRow from './row.vue';
import GraphTree from './tree.vue';
import { advancementsList, indexAdv } from '../../store';

export default defineComponent({
	name: 'GraphMain',
	components: {
		GraphRow,
		GraphTree
	},
	setup () {
		const exist = (obj: unknown, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

		const isRoot = computed(() =>
			exist(advancementsList.value[indexAdv.value], 'data') 
			&& exist(advancementsList.value[indexAdv.value].data, 'data'));
		const isChild = computed(() => isRoot.value && exist(advancementsList.value[indexAdv.value].data.data, 'children'));

		return {
			advancementsList,
			indexAdv,

			isRoot,
			isChild
		};
	}
});
</script>
