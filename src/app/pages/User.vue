<template>
	<q-page>
		<div class="row column justify-center items-center center-div">
			<q-img
				:src="$toPublic('imgs/app/icon_small.png')"
				width="5em"
				class="q-mb-md"
			/>
			<div v-if="!mapcraftAccountSelected" class="row no-wrap q-pa-sm width-main">
				<selection-vue
					:is-server-mode="isServerMode"
					@mapcraft-account-selected="mapcraftAccountSelected = true"
					@is-offline="offlineConnection"
				/>
			</div>
			<template v-else>
				<account-connection-vue
					v-if="!mapcraftAccountCreation"
					@mapcraft-account-creation="mapcraftAccountCreation = true"
					@mapcraft-account-selected="mapcraftAccountSelected = false"
				/>
				<account-creation-vue
					v-else
					@mapcraft-account-creation="mapcraftAccountCreation = false"
				/>
			</template>
		</div>
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import router from '@/router/index';
import { defineComponent, ref } from 'vue';
import { userStore } from '@/store/user';

import selectionVue from '@/components/User/selection.vue';
import accountConnectionVue from '@/components/User/accountConnection.vue';
import accountCreationVue from '@/components/User/accountCreation.vue';
import type { userStorage } from '@/electron/preload/exposeEnv';

export default defineComponent({
	name: 'UserPage',
	components: {
		selectionVue,
		accountConnectionVue,
		accountCreationVue
	},
	setup () {
		const $q = useQuasar();
		const store = userStore();
		const mapcraftAccountSelected = ref<boolean>(false);
		const mapcraftAccountCreation = ref<boolean>(false);
		const isServerMode = ref<boolean>(false);

		const offlineConnection = () => {
			const temp = $q.localStorage.getItem('user') as userStorage;
			$q.loading.show();
			store.setUsername((temp && temp.username)
				? temp.username
				: 'Steve');
			store.setMinecraftUsername((temp && temp.minecraftUsername)
				? temp.minecraftUsername
				: 'Steve');
			store.setOffline(true);
			store.setOffline(false);
			$q.localStorage.set('user', {
				username: (temp && temp.username)
					? temp.username
					: 'Steve',
				minecraftUsername: (temp && temp.minecraftUsername)
					? temp.minecraftUsername
					: 'Steve',
				offline: true,
				remember: false
			} as userStorage);
			router.push('/')
				.finally(() => $q.loading.hide());
		};

		return {
			mapcraftAccountSelected,
			mapcraftAccountCreation,
			isServerMode,

			offlineConnection
		};
	}
});
</script>

<style scoped>
.center-div {
	min-height: inherit;
}
.width-form {
	width: 50%;
}
.width-fill {
	width: -webkit-fill-available;
}
.sep {
	width: 50%;
}
.width-main {
	gap: .2em;
}
</style>
@/app/router/index@/app/store/user
