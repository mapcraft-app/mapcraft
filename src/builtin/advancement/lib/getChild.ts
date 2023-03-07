import { ref } from 'vue';
import deepClone from 'api/deepClone';
import { advancement, main } from '../model';

export interface adv {
	isRoot: boolean;
	child: advancement;
}

export const selectedAdvancement = ref<adv>({} as adv);

export const getChild = (json: main, id: string): adv => {
	let child: advancement | undefined = undefined;

	const recursive = (children: advancement[]): void => {
		for (const c of children) {
			if (c.id === id) {
				child = deepClone(c) as advancement;
				if (child.children && child.children.length)
					delete child.children;
				return;
			}
			if (c.children)
				recursive(c.children);
			if (child)
				return;
		}
	};

	if (json.data.id === id) {
		child = deepClone(json.data) as advancement;
		if (child.children && child.children.length)
			delete child.children;
		selectedAdvancement.value = { isRoot: true, child: child as unknown as advancement };
	} else {
		recursive(json.data.children ?? []);
		selectedAdvancement.value = { isRoot: false, child: child as unknown as advancement };
	}
	return selectedAdvancement.value;
};

export const saveChild = (json: main, child?: advancement): void => {
	const recursive = (children: advancement[]): void => {
		for (const i in children) {
			if (child && children[i].id === child.id)
				children[i].data = deepClone(child.data);
			else if (children[i].id === selectedAdvancement.value.child.id)
				children[i].data = deepClone(selectedAdvancement.value.child.data);
			return;
		}
	};

	if (!Object.keys(json).length)
		return;
	if (child && json.data.id === child.id)
		json.data.data = deepClone(child.data);
	else if (json.data.id === selectedAdvancement.value.child.id)
		json.data.data = deepClone(selectedAdvancement.value.child.data);
	else
		recursive(json.data.children ?? []);
};
