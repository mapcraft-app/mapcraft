<template>
	<div class="grid">
		<template
			v-for="el of $props.list"
			:key="el.name"
		>
			<div
				v-show="!$props.search || !$props.search.length || el.name.includes($props.search)"
				@click="copyToClipboard($q, $t, el.id)"
			>
				<img
					:src="genPath(el)"
					loading="lazy"
					:class="$props.item ? 'pixelated' : ''"
					@error="$imgErr"
				/>
				<q-tooltip class="bg-secondary text-body2">
					{{ repUnderscore(el.name) }}
				</q-tooltip>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { toPublic, path } from 'vue/plugins/app';
import { copyToClipboard, repUnderscore } from './lib';
import type { list } from './lib';

export default defineComponent({
	name: 'BlocksItems',
	props: {
		list: {
			type: Array as PropType<list[]>,
			required: true
		},
		item: {
			type: Boolean,
			required: false,
			default: false
		},
		search: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		}
	},
	setup (props) {
		const genPath = (el: list) => {
			if (props.item) {
				return el.path
					? path(el.path)
					: toPublic('/imgs/minecraft/no_data.png');
			} else {
				return toPublic(
					el.path
						? `/imgs/minecraft/block/${el.id}.webp`
						: '/imgs/minecraft/no_data.png'
				);
			}
		};

		return {
			copyToClipboard,
			repUnderscore,
			genPath
		};
	}
});
</script>

<style scoped>
.grid {
	padding: 0 !important;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
}
.grid > div {
	height: 3em;
	max-height: 3em;
	width: 3em;
	margin: 0.1rem;
	overflow: hidden;
	cursor: pointer;
}
.grid img {
	width: inherit;
}
.pixelated {
	padding: .3em;
	image-rendering: pixelated;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
}
</style>
