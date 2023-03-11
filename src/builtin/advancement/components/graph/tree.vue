<template>
	<graph-row
		v-if="isRoot"
		:advancement="advancement"
		:toggle="toggle"
		:root="$props.root"
		:graph-line="$props.lastLine"
		@toggle="toggleChild()"
	/>
	<template v-if="isChild">
		<div v-if="advancement.children" v-show="toggle">
			<graph-tree
				v-for="(node, i) of advancement.children"
				:key="calcChildNumber(node)"
				:advancement="node"
				:last-line="nextLines(node, advancement.children.length - 1, i)"
			/>
		</div>
	</template>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, onBeforeMount, ref } from 'vue';
import GraphRow from './row.vue';
import { advancementsList, indexAdv } from '../../store';
import { advancement } from '../../model';
import { line } from './interface';

export default defineComponent({
	name: 'GraphTree',
	components: {
		GraphRow
	},
	props: {
		advancement: {
			type: Object as PropType<advancement>,
			required: false,
			default: {} as advancement
		},
		lastLine: {
			type: Array as PropType<line[]>,
			required: true
		},
		root: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup (props) {
		const toggle = ref<boolean>(true);
		const lines = ref<line[]>([ ...props.lastLine ]);

		const nextLines = (node: advancement, len: number, index: number): line[] => {
			if (len === index) {
				return [ ...lines.value, (node.children)
					? 'lastCollapse'
					: 'angle'];
			} else {
				return [ ...lines.value, (node.children)
					? 'collapse'
					: 'children'];
			}
		};
		const calcChildNumber = (node: advancement) => (node.children)
			? node.children.length
			: 0;
		const toggleChild = () => toggle.value = !toggle.value;

		const exist = (obj: unknown, key: string) => Object.prototype.hasOwnProperty.call(obj, key);
		const isRoot = computed(() =>
			exist(advancementsList.value[indexAdv.value], 'data') 
			&& exist(advancementsList.value[indexAdv.value].data, 'data'));
		const isChild = computed(() => isRoot.value && exist(advancementsList.value[indexAdv.value].data.data, 'children'));

		onBeforeMount(() => {
			for (const i in lines.value) {
				if (lines.value[i] === 'root' || lines.value[i] === 'lastCollapse')
					lines.value[i] = 'empty';
				else if (lines.value[i] === 'collapse')
					lines.value[i] = 'line';
			}
		});

		return {
			toggle,
			lines,

			nextLines,
			calcChildNumber,
			toggleChild,

			isRoot,
			isChild
		};
	}
});
</script>
