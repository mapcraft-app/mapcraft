<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="column">
		<span v-if="select" class="text-h6 text-center">
			{{ $capitalize(select?.name ?? '') }}
		</span>
	</div>
	<q-splitter
		v-model="splitter"
		class="splitter"
		:limits="[15,35]"
	>
		<template v-slot:before>
			<q-tabs
				v-model="tabs"
				vertical
				swipeable
			>
				<q-tab
					v-for="el in list"
					:key="el.name"
					:name="el.name"
					class="tab"
					@click="get(el)"
				>
					<img :src="$toPublic(`imgs/app/framework/${el.img}`)" class="img" />
				</q-tab>
			</q-tabs>
		</template>
		<template v-if="select" v-slot:after>
			<div v-if="data" class="q-pl-sm render" v-html="render(data)"></div>
			<div v-else class="row justify-center items-center" style="height: inherit">
				<q-spinner-puff size="4em" color="primary" />
			</div>
		</template>
	</q-splitter>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import markdownIt from 'markdown-it';

interface list {
	name: string,
	img: string,
	req: {
		host: string,
		path: string
	}
}

const dependencies = [
	{
		name: 'mapcraft',
		img: 'mapcraft.png',
		req: { host: 'raw.githubusercontent.com', path: 'mapcraft-app/mapcraft/main/LICENSE' }
	},
	{
		name: 'ace-editor',
		img: 'ace.png',
		req: { host: 'raw.githubusercontent.com', path: 'ajaxorg/ace/master/LICENSE' }
	},
	{
		name: 'better-sqlite3',
		img: 'better_sqlite3.png',
		req: { host: 'raw.githubusercontent.com', path: 'JoshuaWise/better-sqlite3/master/LICENSE' }
	},
	{
		name: 'electron',
		img: 'electron.png',
		req: { host: 'raw.githubusercontent.com', path: 'electron/electron/master/LICENSE' }
	},
	{
		name: 'electron-builder',
		img: 'electron.png',
		req: { host: 'raw.githubusercontent.com', path: 'electron-userland/electron-builder/master/LICENSE' }
	},
	{
		name: 'eslint',
		img: 'eslint.svg',
		req: { host: 'raw.githubusercontent.com', path: 'eslint/eslint/main/LICENSE' }
	},
	{
		name: 'pinia',
		img: 'pinia.svg',
		req: { host: 'raw.githubusercontent.com', path: 'vuejs/pinia/v2/LICENSE' }
	},
	{
		name: 'quasar',
		img: 'quasar.svg',
		req: { host: 'raw.githubusercontent.com', path: 'quasarframework/quasar/dev/LICENSE' }
	},
	{
		name: 'markdown-it',
		img: 'markdown.png',
		req: { host: 'raw.githubusercontent.com', path: 'markdown-it/markdown-it/master/LICENSE' }
	},
	{
		name: 'rollup',
		img: 'rollup.svg',
		req: { host: 'raw.githubusercontent.com', path: 'rollup/rollup/master/LICENSE.md' }
	},
	{
		name: 'sass',
		img: 'sass.svg',
		req: { host: 'raw.githubusercontent.com', path: 'sass/sass/main/LICENSE' }
	},
	{
		name: 'typescript',
		img: 'typescript.png',
		req: { host: 'raw.githubusercontent.com', path: 'microsoft/TypeScript/main/LICENSE.txt' }
	},
	{
		name: 'vite',
		img: 'vite.png',
		req: { host: 'raw.githubusercontent.com', path: 'vitejs/vite/main/LICENSE' }
	},
	{
		name: 'vue-i18n',
		img: 'vue_i18n.svg',
		req: { host: 'raw.githubusercontent.com', path: 'intlify/vue-i18n-next/master/LICENSE' }
	},
	{
		name: 'vue',
		img: 'vue.svg',
		req: { host: 'raw.githubusercontent.com', path: 'vuejs/core/main/LICENSE' }
	},
	{
		name: 'vue-router',
		img: 'vue.svg',
		req: { host: 'raw.githubusercontent.com', path: 'vuejs/router/main/LICENSE' }
	}
] as list[];

export default defineComponent({
	name: 'Info',
	setup () {
		const md = new markdownIt();

		const list = ref<list[]>(dependencies);
		const splitter = ref<number>(20);
		const tabs = ref<string | null>(dependencies[0].name);
		const select = ref<list | null>(null);
		const data = ref<string | null>(null);

		const get = (el: list) => {
			select.value = el;
			data.value = null;
			fetch(`https://${el.req.host}/${el.req.path}`, { method: 'GET' })
				.then((res) => res.text())
				.then((res) => data.value = res)
				.catch((e) => console.error(e));
		};

		onBeforeMount(() => get(dependencies[0]));

		return {
			list,
			splitter,
			tabs,
			select,
			data,

			get,
			render: (d: string) => md.render(d)
		};
	}
});
</script>

<style scoped>
.splitter {
	height: calc(100vh - 13em);
}
.tab {
	height: 6em;
}
.render {
	word-break: break-word;
}
.img {
	width: 4em;
}
</style>
