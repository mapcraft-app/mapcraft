<template>
	<q-banner v-if="error.title !== null" class="text-white bg-red q-mb-md">
		{{ error.title }}
	</q-banner>
	<q-form class="q-gutter-md width-form" @submit="submit" @reset="reset">
		<q-input
			v-model="username"
			filled
			:label="$t('pages.user.user')"
			:hint="$t('pages.user.userHint')"
			:error="error.username"
			:rules="[val => val && val.length > 0 || $t('pages.user.userRule')]"
		/>
		<q-input
			v-model="password"
			filled
			:label="$t('pages.user.pass')"
			:type="isPwd ? 'password' : 'text'"
			:hint="$t('pages.user.passHint')"
			:error="error.password"
			:rules="[val => val && val.length > 0 || $t('pages.user.passRule')]"
		>
			<template v-slot:append>
				<q-icon
					:name="isPwd ? 'visibility_off' : 'visibility'"
					class="cursor-pointer"
					@click="isPwd = !isPwd"
				/>
			</template>
		</q-input>
		<q-toggle v-model="remember" color="green" :label="$t('pages.user.remember')" />
		<div class="row inline no-wrap justify-evenly width-fill">
			<q-btn
				:label="$t('pages.user.submit')" type="submit" color="primary"
				:disable="reqSend"
				:loading="reqSend"
			/>
			<q-btn
				:label="$t('pages.user.reset')" type="reset" color="secondary"
				:disable="reqSend"
			/>
		</div>
		<q-separator color="grey-1" />
		<div class="row inline no-wrap justify-evenly">
			<q-btn color="purple" :ripple="false" @click="selected">
				<q-icon left name="arrow_back_ios" />
				<span>{{ $t('pages.user.return') }}</span>
			</q-btn>
			<q-btn color="positive" :ripple="false" @click="creation">
				<q-icon left name="person_add" />
				<span>{{ $t('pages.user.create') }}</span>
			</q-btn>
		</div>
	</q-form>
</template>

<script lang=ts>
import router from 'src/router';
import { useQuasar } from 'quasar';
import { defineComponent, inject, reactive, ref } from 'vue';
import type { fetchInterface } from 'vue/plugins/app';

export default defineComponent({
	name: 'ComponentUserSelection',
	props: {
		isServerMode: Boolean
	},
	emits: ['mapcraftAccountCreation', 'mapcraftAccountSelected'],
	setup (_props, { emit }) {
		const $q = useQuasar();
		const $fetch = inject('$fetch') as fetchInterface;

		const username = ref<string | null>(null);
		const password = ref<string | null>(null);
		const remember = ref<boolean>(false);
		const reqSend = ref<boolean>(false);
		const error = reactive({
			title: null,
			username: false,
			password: false,
		});
		const isPwd = ref<boolean>(true);

		const submit = (): void => {
			reqSend.value = true;
			$fetch.post('account/check', {
				username: username.value,
				password: password.value
			})
				.then((d) => d.json())
				.then(async (d) => {
					if (d.statusCode !== 200) {
						error.title = d.info.message; 
						if (d.info.code === 'AC_001')
							error.username = true;
						else
							error.password = true;
					} else {
						$q.loading.show();
						router.push('/').finally(() => $q.loading.show());
					}
						
				})
				.catch((e) => console.error(e))
				.finally(() => reqSend.value = false);
		};

		const reset = (): void => {
			error.title = null;
			error.username = false;
			error.password = false;
			username.value = null;
			password.value = null;
			remember.value = false;
		};

		return {
			username,
			password,
			remember,
			reqSend,
			error,
			isPwd,
			submit,
			reset,
			creation: (): void => emit('mapcraftAccountCreation'),
			selected: (): void => emit('mapcraftAccountSelected')
		};
	}
});
</script>

<style scoped>
.width-form {
	display: inline-flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	padding: 0 .4em;
	width: 50%;
}
</style>
