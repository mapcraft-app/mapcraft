import { ref } from 'vue';

export const selectedNode = ref<string | null>(null);
export const expand = ref<Set<number>>(new Set([]));
export const resetStore = (): void => {
	selectedNode.value = null;
	expand.value = new Set([]);
};

