<template>
	<div class="row grid">
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
import { toPublic } from '@/app/plugins/app';
import { copyToClipboard, repUnderscore } from './lib';
import type { list } from './lib';

export default defineComponent({
	name: 'Entity',
	props: {
		list: {
			type: Array as PropType<list[]>,
			required: true
		},
		search: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		}
	},
	setup () {
		/*
		const genPath = (el: list) => toPublic(
			el.path
				? `/imgs/minecraft/entity/${el.id}.webp`
				: '/imgs/minecraft/no_data.png'
		);
		*/
		const genPath = (el: list) => toPublic(`/imgs/minecraft/entity/${el.id}.webp`);

		return {
			copyToClipboard,
			repUnderscore,
			genPath
		};
	}
});
</script>

<style scoped>
.grid > div {
	background-color: rgba(0,0,0,0.1);
	margin: 0.1em;
	padding: 0.3em;
	width: 5em;
	min-height: 5em;
	display: inline-flex;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
.grid img {
	width: 100%;
	height: inherit;
}

.pixelated {
	padding: .3em;
	image-rendering: pixelated;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
}
</style>
