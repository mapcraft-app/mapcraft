import { ref } from 'vue';
import deepClone from '@/api/deepClone';
import { advancement, main, rewards, triggers } from '../model';

export interface adv {
	isRoot: boolean;
	child: advancement;
}

export const selectedAdvancement = ref<adv>({} as adv);
export const numberOfChild = ref<number>(-1);

const setChild = (): advancement => {
	return {
		id: String(++numberOfChild.value),
		data: {
			display: {
				icon: {
					item: 'minecraft:stone',
					nbt: ''
				},
				announce_to_chat: false,
				frame: 'task',
				hidden: false,
				show_toast: false,
				title: {
        	text: 'New child',
        	color: 'white',
					bold: false,
					italic: false,
					underlined: false,
					strikethrough: false,
					obfuscated: false
				},
				description: {
					text: 'New child description',
					color: 'white',
					bold: false,
					italic: false,
					underlined: false,
					strikethrough: false,
					obfuscated: false
				}
			},
			criteria: [] as triggers[],
			requirements: [] as string[][],
			rewards: {} as rewards,
		},
		children: undefined
	} as advancement;
};

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
			if (child)
				return;
			if (c.children)
				recursive(c.children);
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

export const calcNumberOfChild = (json: main): void => {
	const recursive = (children: advancement[]): void => {
		for (const i in children) {
			const temp = Number(children[i].id);
			if (temp > numberOfChild.value)
				numberOfChild.value = temp;
			if (children[i].children)
				recursive(children[i].children ?? []);
		}
	};
	numberOfChild.value = Number(json.data.id);
	recursive(json.data.children ?? []);
};

const newChild = (json: main) => {
	if (numberOfChild.value === -1)
		calcNumberOfChild(json);
	return setChild();
};

export const initChild = (data: main): void => {
	numberOfChild.value = 0;
	data.data = setChild();
};

const manage = (json: main, id: string, add = true) => {
	let isMade = false;

	const recursive = (children: advancement[]): void => {
		for (const i in children) {
			if (isMade)
				return;
			if (Number(children[i].id) === Number(id)) {
				if (add) {
					if (!Object.prototype.hasOwnProperty.call(children[i], 'children') || !children[i].children)
						children[i].children = [];
					children[i].children?.push(newChild(json));
				} else
					children.splice(Number(i), 1);
				isMade = true;
				return;
			}
			if (children[i].children)
				recursive(children[i].children ?? []);
		}
	};

	if (json.data.id === id) {
		if (add) {
			if (!Object.prototype.hasOwnProperty.call(json.data, 'children') || !json.data.children)
				json.data.children = [];
			json.data.children?.push(newChild(json));
		} else
			delete json.data.children;
	} else
		recursive(json.data.children ?? []);
};
export const addChildren = (json: main, id: string): void => manage(json, id, true);
export const removeChildren = (json: main, id: string): void => manage(json, id, false);

export const saveChild = (json: main, child?: advancement): void => {
	let isSave = false;

	const recursive = (children: advancement[]): void => {
		for (const i in children) {
			if (child && children[i].id === child.id) {
				children[i].data = deepClone(child.data);
				isSave = true;
			} else if (children[i].id === selectedAdvancement.value.child.id) {
				children[i].data = deepClone(selectedAdvancement.value.child.data);
				isSave = true;
			}
			if (isSave)
				return;
			if (children[i].children)
				recursive(children[i].children ?? []);
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
