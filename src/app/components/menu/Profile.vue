<template>
	<div class="row no-wrap justify-around q-pa-md">
		<img
			class="img"
			:src="avatarUrl"
			@error="avatarUrl = $toPublic('imgs/minecraft/player.png')"
		/>
		<div class="column justify-center q-pl-sm">
			<span class="text-h5 text-center text-weight-light q-pb-sm">
				{{ (user.offline) ? user.username : user.minecraftUsername }}
			</span>
			<q-btn outline square :label="$t('components.menu.profile.disconnect')" @click="disconnect()" />
		</div>
	</div>
	<div class="row justify-center q-pb-sm">
		<q-btn
			square
			flat
			:label="$t('components.menu.profile.documentation')"
			@click="external"
		/>
	</div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import router from '@/router/index';
import { globalStore } from '@/store/global';
import { userStore } from '@/store/user';

export default defineComponent({
	setup() {
		const $q = useQuasar();
		const global = globalStore();
		const user = userStore();
		const avatarUrl = ref<string>('imgs/minecraft/player.png');

		const avatar = (def: string | null = null) => {
			avatarUrl.value = `http://cravatar.eu/avatar/${def ?? user.minecraftUsername}/${64}.png`;
		};

		const disconnect = () => {
			$q.localStorage.remove('user');
			router.push('/user');
		};

		const external = () => window.ipc.send('dialog::open-external', `https://mapcraft.app/${global.lang}/docs`);

		onBeforeMount(() => {
			avatar();
			watch(() => user.minecraftUsername, (after) => {
				if (after)
					avatar(after);
			});
		});

		return {
			user,
			avatarUrl,
			avatar,
			disconnect,
			external
		};
	}
});
</script>

<style scoped>
.img {
	width: 80px;
  height: 80px;
	image-rendering: pixelated;
}
</style>
