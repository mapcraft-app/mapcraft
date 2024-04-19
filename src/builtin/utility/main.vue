<template>
	<q-tabs
		v-model="tab"
		active-color="secondary"
		indicator-color="secondary"
		align="justify"
	>
		<q-tab name="blocks" :label="$capitalize($t('builtin.utility.blocks'))" />
		<q-tab name="items" :label="$capitalize($t('builtin.utility.items'))" />
		<q-tab name="entities" :label="$capitalize($t('builtin.utility.entities'))" />
		<q-tab name="tags" :label="$capitalize($t('builtin.utility.tags'))" />
	</q-tabs>
	<q-input
		v-model="search"
		debounce="500"
		:label="$capitalize($t('builtin.utility.search'))"
		class="q-pa-md"
	>
		<template v-slot:append>
			<q-icon name="search"/>
		</template>
	</q-input>
	<q-tab-panels
		v-model="tab"
		animated
		transition-prev="jump-right"
		transition-next="jump-left"
		keep-alive
	>
		<q-tab-panel name="blocks">
			<blocks-items :list="blocksList" :search="search" />
		</q-tab-panel>
		<q-tab-panel name="items">
			<blocks-items :list="itemsList" :item="true" :search="search" />
		</q-tab-panel>
		<q-tab-panel name="entities">
			<entity :list="entitiesList" :search="search" />
		</q-tab-panel>
		<q-tab-panel name="tags">
			<tags-component :list="tagsList" :search="search" />
		</q-tab-panel>
	</q-tab-panels>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { minecraft } from 'mapcraft-api/frontend';
import { mapStore } from '@/store/map';
import { tabsType, list, tags } from './components/lib';

import blocksItems from './components/blocksItems.vue';
import tagsComponent from './components/tags.vue';
import entity from './components/entity.vue';

interface genTag {
  [index: string]: string[];
}

export default defineComponent({
	name: 'Utility',
	components: {
		blocksItems,
		tagsComponent,
		entity
	},
	setup () {
		const store = mapStore();
		
		const tab = ref<tabsType>('blocks');
		const search = ref<string | null>(null);
		const blocksList = ref<list[]>([]);
		const entitiesList = ref<list[]>([]);
		const itemsList = ref<list[]>([]);
		const tagsList = ref<tags[]>([]);

		const generateTag = (tags: genTag) => {
			const getEl = (id: string): { type: tabsType, path: string | undefined } | undefined => {
				for (const el of blocksList.value) {
					if (el.id === id)
						return { type: 'blocks', path: el.path };
				}
				for (const el of itemsList.value) {
					if (el.id === id)
						return { type: 'items', path: el.path };
				}
				for (const el of entitiesList.value) {
					if (el.id === id)
						return { type: 'entity', path: el.path };
				}
				return undefined;
			};
			const isTag = new RegExp('^#.+');

			for (const col in tags) {
				const temp: tags = {} as tags;
				temp.id = `list_${col}`;
				temp.tag = col;
				temp.els = [];
				if (!Object.prototype.hasOwnProperty.call(tags, col))
					continue;
				for (const row in tags[col]) {
					if (!Object.prototype.hasOwnProperty.call(tags[col], row))
						continue;
					const name = tags[col][row];
					if (isTag.test(name)) {
						temp.els.push({
							href: undefined,
							tag: `#list_${name.substring(1)}`,
							type: 'tags',
							name
						});
					} else {
						const el = getEl(name);
						temp.els.push({
							href: (el)
								? el.path
								: undefined,
							tag: undefined,
							type: (el)
								? el.type
								: 'items',
							name
						});
					}
				}
				tagsList.value.push(temp);
			}
		};

		onBeforeMount(() => {
			window.utility.init(store.getMapPath(), store.minecraftVersion);
			Promise.all([
				window.utility.textures('blocks').then((d) => blocksList.value = d),
				window.utility.textures('items').then((d) => itemsList.value = d),
				window.utility.entities().then((d) => entitiesList.value = d)
			])
				.finally(() => generateTag(minecraft.get(store.minecraftVersion, 'tag') as genTag));

			watch(tab, (after) => {
				if (after)
					search.value = null;
			});
		});

		return {
			tab,
			search,
			blocksList,
			entitiesList,
			itemsList,
			tagsList
		};
	}
});
</script>
@/app/store/map
