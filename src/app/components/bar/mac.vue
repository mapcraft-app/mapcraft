<template>
	<div class="titlebar-buttons titlebar-mac">
		<div :title="$t('app.close')" @click="() => click('close')">
			<span class="material-icons text-red" aria-hidden="true">lens</span>
		</div>
		<template v-if="store.updateData === undefined">
			<div :title="$t('app.minimize')" @click="() => click('minimize')">
				<span class="material-icons text-yellow" aria-hidden="true">lens</span>
			</div>
			<div :title="$t('app.maximize')" @click="() => click('maximize')">
				<span class="material-icons text-green" aria-hidden="true">lens</span>
			</div>
		</template>
	</div>
	<div class="titlebar-title">
		<img v-if="store.updateData === undefined" src="imgs/app/icon_small.png" />
		<span>{{ $t((store.updateData === undefined) ? 'app.title' : 'app.update') }}</span>
	</div>
	<div class="titlebar-buttons">
		<div v-if="isDev" :title="$t('app.dev')" @click="() => click('construction')">
			<span class="material-icons" aria-hidden="true">construction</span>
		</div>
		<div
			v-if="store.updateData === undefined"
			:title="$t('app.fullscreen')"
			@click="() => click('fullscreen')"
		>
			<span class="material-icons" aria-hidden="true">{{ (!isFullscreen) ? 'open_in_full' : 'close_fullscreen' }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapStore } from '@/store/map';

export default defineComponent({
	name: 'BarWindows',
	setup () {
		const store = mapStore();
		const isDev = ref(import.meta.env.DEV);
		const isMaximize = ref(false);
		const isFullscreen = ref(false);

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

		return {
			store,
			isDev,
			isMaximize,
			isFullscreen,
			click
		};
	}
});
</script>
@/app/store/map
