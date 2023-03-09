import { ref } from 'vue';
import { main } from './model';

export const advancementsList = ref<{ path: string; data: main }[]>([]);
export const indexAdv = ref<number>(-1);

export const idOfRow = ref<number>(-1);
export const selectedNode = ref<string | null>(null);
export const selectedNodeId = ref<number>(-1);
export const expand = ref<Set<number>>(new Set([]));

export const resetStore = (resetList = false): void => {
	if (resetList) {
		advancementsList.value.length = 0;
		indexAdv.value = -1;
	}
	idOfRow.value = 0;
	selectedNodeId.value = -1;
	selectedNode.value = null;
	expand.value = new Set([]);
};

