import { ref } from 'vue';

export const idOfRow = ref<number>(-1);
export const selectedNode = ref<string | null>(null);
export const selectedNodeId = ref<number>(-1);
export const expand = ref<Set<number>>(new Set([]));
export const resetStore = (): void => {
	idOfRow.value = 0;
	selectedNodeId.value = -1;
	selectedNode.value = null;
	expand.value = new Set([]);
};

