<template>
	<svg v-if="type === 'newChildren'" viewBox="0 0 50 94" class="child-style">
		<line x1="15" y1="80" x2="15" y2="94" class="line-style"></line>
	</svg>
	<div v-else class="line-block">
		<svg v-if="type === 'angle'" viewBox="0 0 50 94">
			<line x1="25" y1="47" x2="50" y2="47" class="line-style"></line>
			<line x1="25" y1="0" x2="25" y2="48" class="line-style"></line>
		</svg>
		<svg v-else-if="type === 'children'" viewBox="0 0 50 94">
			<line x1="25" y1="47" x2="50" y2="47" class="line-style"></line>
			<line x1="25" y1="0" x2="25" y2="94" class="line-style"></line>
		</svg>
		<svg v-else-if="type === 'line'" viewBox="0 0 50 94">
			<line x1="25" y1="0" x2="25" y2="94" class="line-style"></line>
		</svg>
		<template v-else-if="type !== 'empty'">
			<q-icon
				tag="span"
				:class="isDarkMode"
				:name="isExpanded"
				@click="expandToggle"
			/>
			<svg v-if="type === 'collapse'" viewBox="0 0 50 94">
				<line x1="25" y1="47" x2="50" y2="47" class="line-style"></line>
				<line x1="25" y1="0" x2="25" y2="94" class="line-style"></line>
			</svg>
			<svg v-else-if="type === 'lastCollapse'" viewBox="0 0 50 94">
				<line x1="25" y1="47" x2="50" y2="47" class="line-style"></line>
				<line x1="25" y1="0" x2="25" y2="48" class="line-style"></line>
			</svg>
			<svg v-else-if="type === 'root'" viewBox="0 0 50 94">
				<line x1="25" y1="47" x2="50" y2="47" class="line-style"></line>
			</svg>
		</template>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { line } from './interface';

export default defineComponent({
	name: 'GraphLine',
	props: {
		type: {
			type: String as PropType<line>,
			required: false,
			default: 'empty'
		},
		expanded: {
			type: Boolean,
			required: true
		}
	},
	emits: ['selected'],
	setup (props, { emit }) {
		const $q = useQuasar();
		
		const expandToggle = () => emit('selected');
		const isDarkMode = computed(() => {
			if ($q.dark.isActive)
				return 'dark-mode';
			return '';
		});
		const isExpanded = computed(() => {
			if (!props.expanded)
				return 'expand_less';
			return 'expand_more';
		});

		return {
			expandToggle,
			isDarkMode,
			isExpanded
		};
	}
});
</script>

<style scoped>
.line-block {
	position: relative;
	display: inline-flex;
	justify-content: center;
	width: 43px;
}
.line-block > span {
	position: absolute;
	top: 25px;
	height: 2em;
	width: 2em;
	background-color: #d3d3d3;
	border-radius: 50%;
	cursor: pointer;
}
.line-block > svg {
	height: 80px;
	width: inherit;
}
.line-style {
	stroke: #0870b2;
	stroke-width: 2;
}
.dark-mode {
	color: black;
}
</style>
