import { advancement, main } from '../model';

export interface adv {
	isRoot: boolean;
	child: advancement;
}

export const getChild = (json: main, id: string): adv => {
	let child: advancement | undefined= undefined;
	const recursive = (children: advancement[]): void => {
		for (const c of children) {
			if (c.id === id) {
				child = JSON.parse(JSON.stringify(c)) as advancement;
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
		const child = JSON.parse(JSON.stringify(json.data)) as advancement;
		if (json.data.children)
			delete child.children;
		return { isRoot: true, child };
	} else
		recursive(json.data.children ?? []);
	return { isRoot: false, child: child as unknown as advancement };
};

export const saveChild = (json: main, child: advancement): void => {
	const recursive = (children: advancement[]): void => {
		for (const i in children) {
			if (children[i].id === child.id) {
				children[i].data = child.data;
				return;
			}
		}
	};
	
	if (json.data.id === child.id)
		json.data.data = child.data;
	else
		recursive(json.data.children ?? []);
};
