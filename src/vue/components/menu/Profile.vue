<template>
	<div class="row no-wrap justify-around q-pa-md">
		<img :src="avatar()" />
		<div class="column justify-center q-pl-sm">
			<span class="text-h5 text-center text-weight-light q-pb-sm">
				{{ user.username }}
			</span>
			<q-btn outline square :label="$t('components.menu.profile.disconnect')" @click="disconnect()" />
		</div>
	</div>
	<div class="row justify-center q-pb-sm">
		<q-btn square flat :label="$t('components.menu.profile.documentation')" />
	</div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

import router from 'src/router';
import { userStore } from 'store/user';

export default defineComponent({
	setup() {
		const $q = useQuasar();
		const user = userStore();

		const avatar = (): string => {
			if (!user.offline)
				return `http://cravatar.eu/avatar/${user.username}/${64}.png`;
			return 'imgs/minecraft/player.png';
		};

		const disconnect = () => {
			$q.localStorage.remove('user');
			router.push('/user');
		};

		return {
			user,
			avatar,
			disconnect
		};
	}
});
</script>
