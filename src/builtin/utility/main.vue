<template>
	<q-page class="page">
		<q-tabs
			v-model="tab"
			active-color="secondary"
			indicator-color="secondary"
			align="justify"
		>
			<q-tab name="blocks" :label="$capitalize($t('builtin.utility.blocks'))" />
			<q-tab name="items" :label="$capitalize($t('builtin.utility.items'))" />
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
				<div class="grid">
					<div
						v-for="block of (filter('blocks') as list[])"
						:key="block.name"
						@click="copyToClipboard(block.id)"
					>
						<img
							:src="block.path 
								? $toPublic(`/imgs/minecraft/block/${block.id}.webp`)
								: $toPublic('/imgs/minecraft/no_data.png')"
							loading="lazy"
							@error="$imgErr"
						/>
						<q-tooltip class="bg-secondary text-body2">{{ repUnderscore(block.name) }}</q-tooltip>
					</div>
				</div>
			</q-tab-panel>
			<q-tab-panel name="items">
				<div class="grid">
					<div
						v-for="item of (filter('items') as list[])"
						:key="item.name"
						@click="copyToClipboard(item.id)"
					>
						<img
							:src="item.path
								? $path(String(item.path))
								: $toPublic('/imgs/minecraft/no_data.png')"
							loading="lazy"
							class="pixelated"
							@error="$imgErr"
						/>
						<q-tooltip class="bg-secondary text-body2">{{ repUnderscore(item.name) }}</q-tooltip>
					</div>
				</div>
			</q-tab-panel>
			<q-tab-panel name="tags">
				<div class="tags">
					<div
						v-for="tag in (filter('tags') as tagEl[])"
						:id="tag.id"
						:key="tag.tag"
						class="row"
					>
						<span class="id text-body2">{{ tag.tag }}</span>
						<div class="row elements">
							<div
								v-for="el in tag.els"
								:key="el.name"
								class="element"
								@click="copyToClipboard(el.name)"
							>
								<template v-if="el.type === 'blocks'">
									<img
										:src="el.href
											? $toPublic(`/imgs/minecraft/block/${el.name}.webp`)
											: $toPublic('/imgs/minecraft/no_data.png')"
										loading="lazy"
										@error="$imgErr"
									/>
								</template>
								<template v-else-if="el.type === 'items'">
									<img
										:src="el.href
											? $path(String(el.href))
											: $toPublic('/imgs/minecraft/no_data.png')"
										loading="lazy"
										class="pixelated"
										@error="$imgErr"
									/>
								</template>
								<template v-else>
									<a :href="el.tag">{{ el.name }}</a>
								</template>
								<q-tooltip class="bg-secondary text-body2">
									{{ repUnderscore(el.name) }}
								</q-tooltip>
							</div>
						</div>
						<hr />
					</div>
				</div>
			</q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { minecraft } from 'mapcraft-api';
import { mapStore } from 'app/src/store/map';
import { capitalize } from 'app/src/vue/plugins/app';

type tabsType = 'blocks' | 'items' | 'tags';

interface tags {
  [index: string]: string[];
}

interface list {
	id: string,
	name: string,
	path: string | undefined
}

interface tagEl {
	id: string,
	tag: string,
	els: {
		href: string | undefined,
		tag: string | undefined,
		type: tabsType,
		name: string
	}[]
}

export default defineComponent({
	name: 'Utility',
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const store = mapStore();
		
		const tab = ref<tabsType>('blocks');
		const search = ref<string | null>(null);
		const blocksList = ref<list[]>([]);
		const itemsList = ref<list[]>([]);
		const tagsList = ref<tagEl[]>([]);

		const filter = (type: tabsType) => {
			if (!search.value) {
				switch (type) {
				case 'blocks':
					return blocksList.value;
				case 'items':
					return itemsList.value;
				default:
					return tagsList.value;
				}
			}
			const __search = search.value.toLowerCase();
			switch (type) {
			case 'blocks':
				return blocksList.value.filter((e) => e.name.includes(__search));
			case 'items':
				return itemsList.value.filter((e) => e.name.includes(__search));
			default:
				return tagsList.value.filter((e) => e.tag.includes(__search));
			}
		};

		const repUnderscore = (e: string) => e.replaceAll('_', ' ');

		const copyToClipboard = (e: string) => {
			window.mapcraft.clipboard.writeText(e);
			$q.notify({
				message: capitalize(t('builtin.utility.copy')),
				icon: 'content_paste',
				color: 'teal-7',
				timeout: 1000
			});
		};

		const generateTag = (tags: tags) => {
			const getEl = (id: string): { type: tabsType, path: string | undefined } | undefined => {
				for (const el of blocksList.value) {
					if (el.id === id)
						return { type: 'blocks', path: el.path };
				}
				for (const el of itemsList.value) {
					if (el.id === id)
						return { type: 'items', path: el.path };
				}
				return undefined;
			};
			const isTag = new RegExp('^#.+');

			for (const col in tags) {
				const temp: tagEl = {} as tagEl;
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
				window.utility.textures('items').then((d) => itemsList.value = d)
			])
				.finally(() => generateTag(minecraft.get(store.minecraftVersion, 'tag') as tags));

			watch(tab, (after) => {
				if (after)
					search.value = null;
			});
		});

		return {
			tab,
			search,
			blocksList,
			itemsList,
			tagsList,

			filter,
			repUnderscore,
			copyToClipboard
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
</style>
