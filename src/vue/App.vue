<template>
	<div class="titlebar">
		<div class="titlebar-title">
			<img src="imgs/app/icon_small.png" />
			<span>{{ $t('app.title') }}</span>
		</div>
		<div class="titlebar-buttons">
			<div v-if="isDev" :title="$t('app.dev')" @click="click('construction')">
				<span class="material-icons" aria-hidden="true">construction</span>
			</div>
			<div :title="$t('app.fullscreen')" @click="click('fullscreen')">
				<span class="material-icons" aria-hidden="true">{{ (!isFullscreen) ? 'fullscreen' : 'fullscreen_exit' }}</span>
			</div>
			<i></i>
			<div :title="$t('app.minimize')" @click="click('minimize')">
				<span class="material-icons" aria-hidden="true">remove</span>
			</div>
			<div :title="$t('app.maximize')" @click="click('maximize')">
				<span class="material-icons min-max" aria-hidden="true">{{ (!isMaximize) ? 'filter_none' : 'check_box_outline_blank' }}</span>
			</div>
			<div class="close-button" :title="$t('app.close')" @click="click('close')">
				<span class="material-icons" aria-hidden="true">close</span>
			</div>
		</div>
	</div>
	<div class="titlebar-page">
		<router-view />
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, provide, ref } from 'vue';
import { QSpinnerPuff, useMeta, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { generateMeta } from 'src/meta';
import router from 'src/router';
import type { QNotifyUpdateOptions } from 'quasar';

export default defineComponent({
	name: 'App',
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const isDev = ref(import.meta.env.DEV);
		const isMaximize = ref(false);
		const isFullscreen = ref(false);
		let interval: NodeJS.Timer, statusInterval: NodeJS.Timer; // eslint-disable-line no-undef
		let notif: any = undefined;

		useMeta(generateMeta());

		const click = (type: string) => {
			switch (type) {
			case 'construction':
				window.ipc.send('window::dev');
				break;
			case 'close':
				window.ipc.send('window::close');
				break;
			case 'fullscreen':
				window.ipc.send('window::fullscreen');
				isFullscreen.value = !isFullscreen.value;
				break;
			case 'maximize':
				window.ipc.send('window::maximize');
				isMaximize.value = !isMaximize.value;
				break;
			case 'minimize':
			default:
				window.ipc.send('window::minimize');
			}
		};

		//#region Build map
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
		//#endregion Build map

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
			isDev,
			isMaximize,
			isFullscreen,
			click
		};
	}
});
</script>
