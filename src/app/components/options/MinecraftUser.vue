<template>
	<q-input
		v-model="username"
		:label="$t('components.options.minecraftUser.title')"
		debounce="100"
	>
		<template v-slot:append>
			<q-icon name="help">
				<q-tooltip
					class="bg-indigo text-body2 text-center"
					max-width="50%"
				>
					{{ $t('components.options.minecraftUser.tooltip') }}
				</q-tooltip>
			</q-icon>
		</template>
	</q-input>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { userStore } from '@/store/user';
import type { userStorage } from '@/electron/preload/exposeEnv';

export default defineComponent({
	name: 'OptionsMinecraftUser',
	setup () {
		const quasar = useQuasar();
		const store = userStore();
		const username = ref<string | null>(store.minecraftUsername);

		onBeforeMount(() => {
			watch(username, (after) => {
				if (after) {
					const temp = quasar.localStorage.getItem('user') as userStorage;
					store.minecraftUsername = after;
					temp.minecraftUsername = after;
					quasar.localStorage.set('user', temp);
				}
			});
		});

		return {
			quasar,
			username
		};
	}
});
</script>
@/app/store/user
