<template>
	<q-toolbar class="bg-primary text-white">
		<q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
		<div class="row no-wrap justify-center q-pr-md main-layout-title-bar">
			{{ (store.plugin) ? $capitalize($t(`builtin.${store.plugin.path}.menu.name`)) : $t('layouts.main.main.title') }}
		</div>
	</q-toolbar>
	<editor-dialog />
	<q-layout
		view="hHh lpr lFr"
		:container="true"
		class="main-layout"
	>
		<q-drawer
			v-model="leftDrawerOpen"
			show-if-above
			overlay
			bordered
			side="left"
			:class="!$q.dark.isActive ? 'main-layout-bg-drawer' : ''"
		>
			<profile />
			<q-expansion-item icon="settings" :label="$t('layouts.main.main.options')">
				<div class="row no-wrap">
					<map-info />
				</div>
				<div class="row no-wrap">
					<dark-mode />
					<lang :is-large="false" />
				</div>
				<div class="row justify-center">
					<q-btn color="secondary" to="/options" :label="$t('layouts.main.main.more_options')" />
				</div>
			</q-expansion-item>
			<q-separator class="q-mt-sm q-mb-sm" inset />
			<menu-list />
		</q-drawer>
		<q-page-container class="main-router">
			<q-page class="page page-container">
				<router-view v-slot="{ Component }">
					<transition name="fade">
						<div>
							<!-- DIV is present for transition -->
							<component :is="Component" />
						</div>
					</transition>
				</router-view>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { globalStore } from 'store/global';
import { mapStore } from 'store/map';

import MenuList from 'components/menu/List.vue';
import DarkMode from 'components/menu/DarkMode.vue';
import Lang from 'components/menu/Lang.vue';
import MapInfo from 'components/menu/MapInfo.vue';
import Profile from 'components/menu/Profile.vue';
import EditorDialog from 'components/editor/Dialog.vue';

export default defineComponent({
	name: 'MainLayout',
	components: {
		MenuList,
		DarkMode,
		Lang,
		MapInfo,
		Profile,
		EditorDialog
	},
	setup() {
		const $q = useQuasar();
		const store = globalStore();
		const storeMap = mapStore();
		const leftDrawerOpen = ref(false);
		const toggleLeftDrawer = () =>
			(leftDrawerOpen.value = !leftDrawerOpen.value);

		onMounted(() => {
			window.update.check(window.env.directory, storeMap.info.name, storeMap.minecraftVersion)
				.then((update) => {
					if (Object.keys(update).length)
						window.ipc.send('update::init', update);
				})
				.catch((e) => {
					window.log.error(e);
					$q.notify({
						type: 'error',
						message: e
					});
				});
		});
		
		return {
			store,
			leftDrawerOpen,
			toggleLeftDrawer
		};
	}
});
</script>

<style scoped>
.main-layout-title-bar {
	width: 100%;
}
.main-layout-bg-drawer {
	background-color: #e8e8e8;
}
.main-router {
	height: 100%;
}
.main-layout {
	height: calc(100% - 50px) !important;
}
.page-container > div {
	display: inherit;
	height: inherit;
}
</style>
