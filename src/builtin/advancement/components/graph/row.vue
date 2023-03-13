<template>
	<div :class="backgroundSelected">
		<template v-if="$props.root">
			<graph-line
				type="root"
				:expanded="$props.toggle"
				@selected="toggleSelected"
			/>
		</template>
		<template v-else>
			<graph-line
				v-for="n in graphLine"
				:key="n"
				:type="n"
				:expanded="$props.toggle"
				@selected="toggleSelected"
			/>
		</template>
		<div
			:class="treeElement"
			@click="isSelected"
		>
			<div>
				<span class="q-pl-sm q-pr-sm">
					<template v-if="$props.advancement.data.utility === true">
						<q-badge color="red text-subtitle2">
							{{ $capitalize($t('builtin.advancement.tab.display.utility[0]')) }}
						</q-badge>
					</template>
					<template v-else>
						{{ $props.advancement.data.display.title.text }}
					</template>
				</span>
				<div class="block">
					<img :src="getTexture" />
				</div>
			</div>
		</div>
		<div class="column no-wrap justify-evenly q-pl-sm">
			<q-btn
				square unelevated
				color="orange"
				icon="subdirectory_arrow_right"
				@click="addChild()"
			/>
			<q-btn
				:disable="root"
				square unelevated
				icon="delete" color="red"
				@click="deleteChild()"
			/>
		</div>
		
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useQuasar } from 'quasar';
import GraphLine from './line.vue';

import { line } from './interface';
import { advancement } from '../../model';
import { addChildren, adv, removeChildren, selectedAdvancement } from '../../lib/handleAdv';
import { advancementsList, indexAdv, resetStore, selectedNode } from '../../store';
import { toPublic } from 'vue/plugins/app';

export default defineComponent({
	name: 'GraphRow',
	components: {
		GraphLine
	},
	props: {
		advancement: {
			type: Object as PropType<advancement>,
			required: true
		},
		toggle: {
			type: Boolean,
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
	emits: ['toggle'],
	setup (props, { emit }) {
		const $q = useQuasar();

		const toggleSelected = () => emit('toggle');
		const isSelected = () => selectedNode.value = props.advancement.id;
		const addChild = () => addChildren(advancementsList.value[indexAdv.value].data, props.advancement.id);
		const deleteChild = () => {
			if (selectedNode.value === props.advancement.id) {
				selectedAdvancement.value = {} as adv;
				resetStore();
			}
			removeChildren(advancementsList.value[indexAdv.value].data, props.advancement.id);
		};

		const backgroundSelected = computed(() => {
			if (selectedNode.value === props.advancement.id) {
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
		const getTexture = computed(() => {
			if (Object.prototype.hasOwnProperty.call(props.advancement.data.display, 'icon')
				&& Object.prototype.hasOwnProperty.call(props.advancement.data.display.icon, 'item'))
				return toPublic(`/imgs/minecraft/block/${window.advancement.getTexture(props.advancement.data.display.icon.item).id}.webp`);
			return toPublic('/imgs/minecraft/no_data.png');
		});

		return {
			toggleSelected,
			isSelected,
			addChild,
			deleteChild,

			backgroundSelected,
			treeElement,
			getTexture,
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
