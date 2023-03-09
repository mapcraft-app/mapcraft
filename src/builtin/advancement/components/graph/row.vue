<template>
	<div
		v-if="isExpand"
		:class="backgroundSelected"
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
			:class="treeElement"
			@click="isSelected"
		>
			<div>
				<span class="q-pl-sm q-pr-sm">
					{{ $props.modelValue.data.display.title.text }}
				</span>
				<div class="block">
					<img :src="$toPublic(`/imgs/minecraft/block/${getTexture($props.modelValue.data.display.icon.item).id}.webp`)" />
				</div>
			</div>
		</div>
		<div class="column no-wrap justify-evenly q-pl-sm">
			<q-btn
				square unelevated
				color="orange"
				icon="subdirectory_arrow_right" 
			/>
			<q-btn
				square unelevated
				icon="delete" color="red"
				@click="deleteRow()"
			/>
		</div>
		
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import GraphLine from './line.vue';
import { advancement } from '../../model';
import { line } from './interface';
import { idOfRow, expand, selectedNode, selectedNodeId } from '../../store';

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
		const $q = useQuasar();
		const rowId = ref<number>(0);
		const isExpand = ref<boolean>(true);

		const isSelected = () => {
			selectedNode.value = props.modelValue.id;
			selectedNodeId.value = rowId.value;
		};
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
		const getTexture = (name: string) => window.advancement.getTexture(name);

		const deleteRow = () => {
			console.log('delete');
		};

		const backgroundSelected = computed(() => {
			if (selectedNodeId.value === rowId.value) {
				return `treeRow ${($q.dark.isActive)
					? 'selected-dark'
					: 'selected-light'}`;
			}
			return 'treeRow';
		});

		const treeElement = computed(() => {
			if ($q.dark.isActive)
				return 'treeElement dark-mode';
			return 'treeElement';
		});

		onBeforeMount(() => {
			rowId.value = idOfRow.value++;
			calcExpand(expand.value);
			watch(expand.value, (value) => {
				if (value)
					calcExpand(value);
			});
		});

		return {
			rowId,
			expand,
			isExpand,

			isSelected,
			expandSelected,
			calcExpand,
			getTexture,
			deleteRow,

			backgroundSelected,
			treeElement
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
.treeRow.selected-dark {
	background-color: rgba(255,255,255,.1);
}
.treeRow.selected-light {
	background-color: rgba(0,0,0,.1);
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
