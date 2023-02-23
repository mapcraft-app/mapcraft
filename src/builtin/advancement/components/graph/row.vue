<template>
	<div
		v-if="isExpand"
		class="treeRow"
		:data-parent="id"
	>
		<template v-if="$props.root">
			<graph-line
				type="root"
				:expanded="expand.has(id)"
				@selected="expandSelected"
			/>
		</template>
		<template v-else>
			<graph-line
				v-for="n in graphLine"
				:key="n"
				:type="n"
				:expanded="expand.has(id)"
				@selected="expandSelected"
			/>
		</template>
		<div
			:class="(!$q.dark.isActive) ? 'treeElement ' : 'treeElement dark-mode'"
			@click="isSelected"
		>
			<div>
				<span class="q-pl-sm q-pr-sm">
					{{ $props.modelValue.data.display.title.text }}
				</span>
				<div class="block">
					<img src="https://documentation.mapcraft.app/srcs/img/logo.png" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onBeforeMount } from 'vue';
import GraphLine from './line.vue';
import { advancement } from '../../model';
import { line } from './interface';
import { expand, selectedNode } from '../../store';

export default defineComponent({
	name: 'GraphRow',
	components: {
		GraphLine
	},
	props: {
		modelValue: {
			type: Object as PropType<advancement>,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		root: {
			type: Boolean,
			required: false,
			default: false
		},
		graphLine: {
			type: Array as PropType<line[]>,
			required: false,
			default: () => <line[]>[]
		}
	},
	emits: ['update:modelValue', 'selected'],
	setup (props) {
		const isExpand = ref<boolean>(true);

		const isSelected = () => selectedNode.value = props.modelValue.id;
		const expandSelected = () => {
			if (expand.value.has(props.id))
				expand.value.delete(props.id);
			else
				expand.value.add(props.id);
		};
		const calcExpand = (els: Set<number>) => {
			for (const e of els) {
				if (e < props.id) {
					isExpand.value = false;
					return;
				}
			}
			isExpand.value = true;
		};

		onBeforeMount(() => {
			calcExpand(expand.value);
			watch(expand.value, (value) => {
				if (value)
					calcExpand(value);
			});
		});

		return {
			expand,

			isExpand,
			isSelected,
			expandSelected,
			calcExpand
		};
	}
});
</script>

<style scoped>
.treeRow {
	display: flex;
	justify-content: flex-start;
	flex-wrap: nowrap;
	height: 80px;
	width: 100%;
}

.treeElement {
	padding: 0.2em 0;
	width: 250px;
	height: 80px;
}
.treeElement > div {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	background-color: rgba(0,0,0,0.05);
	border: rgba(0,0,0,0) 2px solid;
	cursor: pointer;
}
.treeElement.dark-mode > div {
	background-color: rgba(255, 255, 255, 0.05);
}
.treeElement > div:hover {
	border: #0870b2 2px solid;
}
.treeElement > div > .block {
	background-color: #c6c7c6;
	border: 5px inset;
	width: 4.8em;
	height: 4.8em;
	margin: 0.2em;
}
.treeElement > div > .block img {
	width: 4.2em;
	height: 4.2em;
}
</style>
