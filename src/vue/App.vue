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
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useMeta, useQuasar } from 'quasar';
import { generateMeta } from 'src/meta';
import router from 'src/router';

export default defineComponent({
	name: 'App',
	setup () {
		const $q = useQuasar();
		const isDev = ref(import.meta.env.DEV);
		const isMaximize = ref(false);
		const isFullscreen = ref(false);

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

		onBeforeMount(() => {
			window.log.info('Application finish to mounted');
			router.push('/map');
		});

		return {
			isDev,
			isMaximize,
			isFullscreen,
			click,

			test: () => $q.notify({
				message: 'hello world',
				position: 'top',
				timeout: 1000
			}),
		};
	}
});
</script>
