<template>
	<div class="row no-wrap justify-around q-pa-md">
		<img
			class="img"
			:src="avatarUrl"
			@error="avatarUrl = $toPublic('imgs/minecraft/player.png')"
		/>
		<div class="column justify-center q-pl-sm">
			<div class="text-h5 text-center q-pb-sm cursor-pointer" >
				<q-tooltip
					class="bg-secondary text-body2 text-center"
					anchor="top middle"
					self="bottom middle"
				>
					If this is not your in-game pseudonym, click here for change it
				</q-tooltip>
				<q-btn
					flat
					:label="((user.offline) ? user.username : user.minecraftUsername) ?? ''"
					@click="$router.push({ path: '/options', hash: '#user' })"
				/>
			</div>
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

		const external = () => {
			if (global.plugin === null)
				window.ipc.send('dialog::open-external', `https://mapcraft.app/${global.lang}/docs`);
			else
				window.ipc.send('dialog::open-external', `https://mapcraft.app/${global.lang}/docs/builtin/${global.plugin.name}`);
		};

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
