<template>
	<div class="titlebar">
		<bar-mac v-if="os === 'darwin'" />
		<bar-windows v-else />
	</div>
	<div class="titlebar-page">
		<router-view />
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, provide, ref } from 'vue';
import { QSpinnerPuff, useMeta, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import BarWindows from './components/bar/windows.vue';
import BarMac from './components/bar/mac.vue';

import { generateMeta } from 'src/meta';
import router from 'src/router';
import type { QNotifyUpdateOptions } from 'quasar';

export default defineComponent({
	name: 'App',
	components: {
		BarWindows,
		BarMac
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const os = window.env.directory.os;
		let interval: NodeJS.Timer, statusInterval: NodeJS.Timer; // eslint-disable-line no-undef
		let notif: any = undefined;

		useMeta(generateMeta());

		const build = ref<boolean>(false);
		const buildStatus = ref<number>(0);
		const buildPath = ref<string | null>(null);
		const buildStart = () => buildMap();
		// eslint-disable-next-line no-undef, no-unused-vars
		let buildNotif: (_props?: QNotifyUpdateOptions | undefined) => void;

		provide('build', { build, buildStatus, buildPath, buildStart });

		const buildMap = () => {
			const ret = () => buildStatus.value > 0
				? buildStatus.value
				: 1;

			if (build.value)
				return;
			build.value = true;
			buildStatus.value = 1;
			buildPath.value = null;
			buildNotif = $q.notify({
				group: false,
				timeout: 0,
				spinner: true,
				color: 'info',
				multiLine: true,
				message: t(`components.options.build.${ret()}`)
			});
			statusInterval = setInterval(() => {
				buildStatus.value = Number(window.mapcraft.engine.buildStatus());
				buildNotif({ message: t(`components.options.build.${ret()}`) });
			}, 10);
			window.mapcraft.engine.build()
				.then((path) => {
					build.value = false;
					buildPath.value = path;
					buildStatus.value = 8;
					clearInterval(statusInterval);
					buildNotif({
						timeout: 7500,
						spinner: false,
						icon: 'handyman',
						message: t(`components.options.build.${ret()}`),
						actions: [
							{
								label: t('components.options.build.download'),
								color: 'yellow',
								handler: () => window.ipc.send('dialog::open-directory', buildPath.value)
							}
						]
					});
				})
				.catch((e) => {
					console.log(e);
				});
		};

		onBeforeMount(() => {
			window.log.info('Application finish to mounted');
			router.push('/map');
			interval = setInterval(() => {
				if (!window.mapcraft.logIsWatch() && !notif) {
					notif = $q.notify({
						group: false,
						timeout: 0,
						color: 'orange-7',
						spinner: QSpinnerPuff,
						position: 'bottom-right',
						message: t('app.logError'),
					});
				} else if (window.mapcraft.logIsWatch() && notif !== undefined) {
					notif();
					notif = undefined;
				}
			}, 2500);
		});

		onBeforeUnmount(() => clearInterval(interval));

		return {
			os
		};
	}
});
</script>
