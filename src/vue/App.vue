<template>
	<div class="titlebar">
		<div class="titlebar-title">
			<img src="/imgs/app/icon_small.png" />
			<span>Mapcraft</span>
		</div>
		<div class="titlebar-buttons">
			<div @click="click('fullscreen')">
				<span class="material-icons" aria-hidden="true">{{ (!isFullscreen) ? 'fullscreen' : 'fullscreen_exit' }}</span>
			</div>
			<i></i>
			<div @click="click('minimize')">
				<span class="material-icons" aria-hidden="true">minimize</span>
			</div>
			<div @click="click('maximize')">
				<span class="material-icons min-max" aria-hidden="true">{{ (!isMaximize) ? 'filter_none' : 'check_box_outline_blank' }}</span>
			</div>
			<div class="close-button" @click="click('close')">
				<span class="material-icons" aria-hidden="true">close</span>
			</div>
		</div>
	</div>
	<div class="titlebar-page">
		<router-view />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMeta } from 'quasar';
import { generateMeta } from 'src/meta';

export default defineComponent({
	name: 'App',
	setup () {
		useMeta(generateMeta());
	
		const isMaximize = ref(false);
		const isFullscreen = ref(false);

		const click = (type: string) => {
			switch (type) {
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
			isMaximize,
			isFullscreen,
			click
		};
	}
});
</script>
