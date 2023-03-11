import { ref } from 'vue';
import { main } from './model';

export const advancementsList = ref<{ path: string; data: main }[]>([]);
export const indexAdv = ref<number>(-1);
export const selectedNode = ref<string | null>(null);

export const resetStore = (resetList = false): void => {
	if (resetList) {
		advancementsList.value.length = 0;
		indexAdv.value = -1;
	}
	selectedNode.value = null;
};

