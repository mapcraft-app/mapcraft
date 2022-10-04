<template>
	<q-layout view="hhh lpr lFr" :container="true">
		<q-header class="bg-primary text-white">
			<q-toolbar>
				<q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
				<div class="row no-wrap justify-center main-layout-title-bar">
					Mapcraft
				</div>
				<q-btn dense flat round icon="menu" />
			</q-toolbar>
		</q-header>
		<q-drawer
			v-model="leftDrawerOpen"
			show-if-above
			bordered
			overlay
			side="left"
			:class="!$q.dark.isActive ? 'main-layout-bg-drawer' : ''"
		>
			<profile />
			<q-expansion-item icon="settings" label="Options">
				<div class="row no-wrap">
					<dark-mode />
					<lang :is-large="false" />
				</div>
				<div class="row justify-center">
					<q-btn color="secondary" to="/options" :label="$t('layouts.main.more_options')" />
				</div>
				<div class="row justify-center">
					<q-btn color="secondary" to="/map" :label="$t('layouts.main.more_options')" />
				</div>
			</q-expansion-item>
			<q-separator class="q-mt-sm" inset />
		</q-drawer>
		<q-page-container class="main-router">
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DarkMode from 'components/menu/DarkMode.vue';
import Lang from 'components/menu/Lang.vue';
import Profile from 'components/menu/Profile.vue';

export default defineComponent({
	components: {
		DarkMode,
		Lang,
		Profile
	},
	setup() {
		const leftDrawerOpen = ref(false);
		const toggleLeftDrawer = () =>
			(leftDrawerOpen.value = !leftDrawerOpen.value);

		return {
			leftDrawerOpen,
			toggleLeftDrawer
		};
	}
});
</script>

<style>
.main-layout-title-bar {
	width: 100%;
}
.main-layout-bg-drawer {
	background-color: #e8e8e8;
}
.main-router {
	height: 100%;
}
</style>
