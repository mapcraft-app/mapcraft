<template>
	<template v-if="$props.modelValue.length > 0">
		<template v-for="(adv, index) in $props.modelValue" :key="adv.id">
			<graph-row
				:id="idOfTree"
				v-model="$props.modelValue[index]"
				:graph-line="printLines(adv.children, index)"
			/>
			<graph-tree
				v-if="$props.modelValue[index].children && $props.modelValue[index].children?.length"
				:id="idOfTree"
				v-model="$props.modelValue[index].children"
				:line="printLines(adv.children, index, true)"
			/>
		</template>
	</template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, watch, PropType } from 'vue';
import GraphRow from './row.vue';
import { advancement } from '../../model';
import { line } from './interface';

export default defineComponent({
	name: 'GraphTree',
	components: {
		GraphRow
	},
	props: {
		modelValue: {
			type: Array as PropType<advancement[] | any>,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		line: {
			type: Array as PropType<line[]>,
			required: true,
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const idOfTree = props.id + 1;
		const printLines = (children: advancement[] | undefined, index: number, next = false): line[] => {
			if (children && children.length) {
				if (index === children.length - 1) {
					return [ ...props.line, (next)
						? 'line'
						: 'collapse' ];
				}
				return [ ...props.line, (next)
					? 'empty'
					: 'lastCollapse' ];
			}
			if (index < props.modelValue.length - 1)
				return [ ...props.line, 'children' ];
			return [ ...props.line, 'angle' ];
		};

		onBeforeMount(() => {
			watch(props.modelValue, (after) => {
				if (after)
					emit('update:modelValue', after);
			}, { deep: true });
		});

		return {
			idOfTree,
			printLines
		};
	}
});
</script>
