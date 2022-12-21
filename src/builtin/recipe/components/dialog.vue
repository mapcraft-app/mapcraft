<template>
	<div :class="(dialogOpen) ? 'background' : 'background hide'">
		<q-card style="width: 75%" square>
			<q-card-section>
				<div class="row justify-end">
					<q-btn icon="close" flat round dense @click="closeModal" />
				</div>
				<q-tabs
					v-model="tabs"
					align="justify"
					narrow-indicator
				>
					<q-tab name="block" label="Block"></q-tab>
					<q-tab name="item" label="Item"></q-tab>
				</q-tabs>
				<q-input v-model="search" label="Search" />
			</q-card-section>
			<q-tab-panels
				v-model="tabs"
				keep-alive
				animated
				transition-prev="fade"
				transition-next="fade"
			>
				<q-tab-panel name="block" class="panel">
					<q-card-section style="max-height: 50vh" class="scroll grid">
						<div
							v-for="block of filter('block')"
							:key="block.id"
							@click="selectedItem('block', `/imgs/minecraft/block/${block.id}.webp`, block.id)"
						>
							<img
								:src="`/imgs/minecraft/block/${block.id}.webp`"
								loading="lazy"
								@error="$imgErr"
							/>
							<q-tooltip class="bg-secondary text-body2">
								{{ repUnderscore(block.name) }}
							</q-tooltip>
						</div>
					</q-card-section>
				</q-tab-panel>
				<q-tab-panel name="item" class="panel">
					<q-card-section style="max-height: 50vh" class="scroll grid">
						<div
							v-for="item of filter('item')"
							:key="item.name"
							@click="selectedItem('item', String(item.path), item.id)"
						>
							<img
								:src="$path(String(item.path))"
								loading="lazy"
								@error="$imgErr"
							/>
							<q-tooltip class="bg-secondary text-body2">
								{{ repUnderscore(item.name) }}
							</q-tooltip>
						</div>
					</q-card-section>
				</q-tab-panel>
			</q-tab-panels>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';

interface list {
	id: string,
	name: string,
	path: string | undefined
}

type search = 'block' | 'item';

export default defineComponent({
	name: 'SelectDialog',
	props: {
		modal: {
			type: Boolean,
			default: false,
			required: true
		}
	},
	emits: ['close', 'selected'],
	setup (props, { emit }) {
		const dialogOpen = ref<boolean>(false);
		const tabs = ref<search>('block');
		const search = ref<string | null>(null);
		const blocksList = ref<list[]>([]);
		const itemsList = ref<list[]>([]);

		const closeModal = () => {
			dialogOpen.value = false;
			emit('close');
		};

		const selectedItem = (type: 'block' | 'item', path: string, selected: string) => {
			dialogOpen.value = false;
			emit('selected', {
				type,
				path,
				selected
			});
		};

		const repUnderscore = (e: string) => e.replaceAll('_', ' ');

		const filter = (type: search) => {
			if (!search.value) {
				return (type === 'block')
					? blocksList.value
					: itemsList.value;
			}
			const __search = search.value.toLowerCase();
			return (type === 'block')
				? blocksList.value.filter((e) => e.name.includes(__search))
				: itemsList.value.filter((e) => e.name.includes(__search));
		};

		onBeforeMount(() => {
			window.recipe.textures('block')
				.then((d) => {
					blocksList.value = d;
				});
			window.recipe.textures('item')
				.then((d) => {
					itemsList.value = d;
				});
			watch(() => props.modal, (after) => {
				dialogOpen.value = after;
			});
		});

		return {
			dialogOpen,
			tabs,
			search,
			blocksList,
			itemsList,

			closeModal,
			selectedItem,
			repUnderscore,
			filter
		};
	}
});
</script>

<style scoped>
.hide {
	display: none !important;
}
.background {
	position: absolute;
	top: 0;
	z-index: 1000;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
}
.panel {
	padding: 0;
}
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
	/*height: inherit;*/
	image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
