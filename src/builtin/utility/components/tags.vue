<template>
	<div class="tags">
		<template
			v-for="el of $props.list"
			:key="el.id"
		>
			<div
				v-show="!$props.search || !$props.search.length || el.tag.includes($props.search)"
				:id="el.id"
				class="row"
			>
				<span class="id text-body2">
					{{ el.tag }}
				</span>
				<div class="row elements">
					<div
						v-for="item in el.els"
						:key="item.name"
						class="element"
						@click="copyToClipboard($q, $t, item.name)"
					>
						<a
							v-if="item.type === 'tags'"
							:href="el.tag"
						>
							{{ item.name }}
						</a>
						<img
							v-else
							:src="genPath(item, item.type)"
							:class="item.type === 'items' ? 'pixelated' : ''"
							loading="lazy"
							@error="$imgErr"
						/>
						<q-tooltip class="bg-secondary text-body2">
							{{ repUnderscore(item.name) }}
						</q-tooltip>
					</div>
				</div>
				<hr />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { toPublic, path } from '@/app/plugins/app';
import { copyToClipboard, repUnderscore } from './lib';
import type { tabsType, tags, tagEl } from './lib';

export default defineComponent({
	name: 'Tags',
	props: {
		list: {
			type: Array as PropType<tags[]>,
			required: true
		},
		search: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		}
	},
	setup () {
		const genPath = (el: tagEl, type: tabsType) => {
			switch (type) {
			case 'blocks':
				return toPublic(
					el.href
						? `/imgs/minecraft/block/${el.name}.webp`
						: '/imgs/minecraft/no_data.png'
				);
			case 'items':
				return el.href
					? path(el.href)
					: toPublic('/imgs/minecraft/no_data.png');
			case 'entity':
				return toPublic(`/imgs/minecraft/entity/${el.name}.webp`);
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
.tags .id {
	width: 25%;
	word-break: break-all;
	display: inline-flex;
  justify-content: left;
  align-items: center;
  flex-wrap: nowrap;
}
.tags .elements {
	width: 75%;
}
.tags .element {
	background-color: rgba(0,0,0,0.1);
	margin: .1em;
	width: 4em;
	min-height: 4em;
	display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
	cursor: pointer;
}
.tags img {
	width: 100%;
	height: inherit;
}
.tags a {
	hyphens: auto;
	overflow: hidden;
}
.tags hr {
	width: -webkit-fill-available;
}
.pixelated {
	padding: .3em;
	image-rendering: pixelated;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
}
</style>
