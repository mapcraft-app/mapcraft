import { ref } from 'vue';
import deepClone from 'api/deepClone';
import { advancement, main } from '../model';

export interface adv {
	isRoot: boolean;
	child: advancement;
}

export const selectedAdvancement = ref<adv>({} as adv);
export const numberOfChild = ref<number>(-1);

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

const newChild = (json: main) => {
	if (numberOfChild.value === -1) {
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
	}
	numberOfChild.value = numberOfChild.value + 1;
	
	return {
		id: String(numberOfChild.value),
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
				namespace: {
					text: 'mapcraft-data'
				},
				background: 'minecraft:textures/gui/advancements/backgrounds/stone.png',
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
			criteria: [],
			requirements: [],
			rewards: {},
			children: []
		}
	} as advancement;
};

export const addChildren = (json: main, id: string): void => {
	let isAdd = false;

	const recursive = (children: advancement[]): void => {
		for (const i in children) {
			if (isAdd)
				return;
			if (Number(children[i].id) === Number(id)) {
				if (!children[i].children?.length)
					children[i].children = [];
				children[i].children?.push(newChild(json));
				isAdd = true;
				return;
			}
			if (children[i].children)
				recursive(children[i].children ?? []);
		}
	};

	if (json.data.id === id)
		json.data.children?.push(newChild(json));
	else
		recursive(json.data.children ?? []);
};

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
