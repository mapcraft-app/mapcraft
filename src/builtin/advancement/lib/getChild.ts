import { advancement, main } from '../model';

export const getChild = (json: main, id: string): advancement => {
	let child: advancement | null = null;
	
	const recursive = (children: advancement[]): advancement | void => {
		for (const c of children) {
			if (c.id === id) {
				child = JSON.parse(JSON.stringify(c)) as advancement;
				if (child.children && child.children.length)
					delete child.children;
				return child;
			} else if (c.children)
				return recursive(c.children);
		}
	};
	
	if (json.data.id === id) {
		const child = JSON.parse(JSON.stringify(json.data)) as advancement;
		if (json.data.children)
			delete child.children;
		return child;
	}
	return recursive(json.data.children ?? []) as advancement;
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
	
	if (json.data.id === child.id) {
		json.data.data = child.data;
		return;
	}
	return recursive(json.data.children ?? []);
};
