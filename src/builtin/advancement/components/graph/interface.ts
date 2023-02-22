export interface node {
	id: string;
	name: string;
	icon: string;
	children?: node[];
}

export type line = 'angle' | 'children' | 'collapse' | 'empty' | 'lastCollapse' | 'line' | 'newChildren' | 'root';
