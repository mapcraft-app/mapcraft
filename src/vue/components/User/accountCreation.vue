<template>
	<q-banner v-if="error" class="text-white bg-red q-mb-md">
		{{ error }}
	</q-banner>
	<template v-if="verify === null">
		<q-form class="q-gutter-md width-form" @submit="submit" @reset="reset">
			<q-input
				v-model="username"
				filled
				:label="$t('pages.user.user')"
				:hint="$t('pages.user.userHint')"
				:error="fetchError.username"
				:rules="[val => val && val.length > 0 || $t('pages.user.userRule')]"
			/>
			<q-input
				v-model="email"
				type="email"
				filled
				:label="$t('pages.user.email')"
				:hint="$t('pages.user.emailHint')"
				:error="fetchError.email"
				:rules="[val => val && val.length > 0 && /^[\S]+@[\S]+\.[\S]+/.test(val) || $t('pages.user.emailRule')]"
			/>
			<q-input
				v-model="password"
				filled
				:label="$t('pages.user.pass')"
				:type="isPwd ? 'password' : 'text'"
				:hint="$t('pages.user.passHint')"
				:error="fetchError.password"
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
			<q-input
				v-model="passwordRepeat"
				filled
				:label="$t('pages.user.passRepeat')"
				:type="isPwd ? 'password' : 'text'"
				:hint="$t('pages.user.passRepeatHint')"
				:rules="[val => val && val.length > 0 && password === passwordRepeat || $t('pages.user.passRepeatRule')]"
			>
				<template v-slot:append>
					<q-icon
						:name="isPwd ? 'visibility_off' : 'visibility'"
						class="cursor-pointer"
						@click="isPwd = !isPwd"
					/>
				</template>
			</q-input>
			<div class="row inline no-wrap justify-evenly width-fill">
				<q-btn
					:label="$t('pages.user.reset')" type="reset" color="secondary"
					:disable="awaitResponse"
				/>
				<q-btn
					:label="$t('pages.user.submit')" type="submit" color="positive"
					:disable="awaitResponse"
					:loading="awaitResponse"
				/>
			</div>
			<q-separator color="grey-1" />
			<div class="row inline no-wrap justify-evenly">
				<q-btn color="purple" :ripple="false" @click="creation">
					<q-icon left name="arrow_back_ios" />
					<span>{{ $t('pages.user.returnConnection') }}</span>
				</q-btn>
			</div>
		</q-form>
	</template>
	<template v-else>
		<div class="width-form">
			<span class="text-h6 text-center">{{ $t('pages.user.titleToken') }}</span>
			<q-input
				v-model="email"
				filled
				type="email"
				:label="$t('pages.user.editMail')"
				:hint="$t('pages.user.emailHint')"
				:error="fetchError.email"
				:rules="[val => val && val.length > 0 && /^[\S]+@[\S]+\.[\S]+/.test(val) || $t('pages.user.emailRule')]"
			>
				<template v-slot:append>
					<q-btn
						dense flat round
						icon="send"
						@click="editMail"
					/>
				</template>
			</q-input>
			<q-input
				v-model="verifyToken"
				filled
				mask="########"
				fill-mask="#"
				:label="$t('pages.user.token')"
				:hint="$t('pages.user.tokenHint')"
				:rules="[val => val && val.length === 8 || $t('pages.user.tokenRule')]"
				class="q-pt-md"
			/>
			
			<div class="row inline no-wrap justify-evenly width-fill q-pt-md q-pb-md">
				<q-btn
					color="secondary" :ripple="false"
					:disable="counterToken > 0 || awaitResponse"
					@click="resendToken"
				>
					<span v-if="counterToken <= 0">{{ $t('pages.user.resendToken') }}</span>
					<span v-else> {{ counterToken }}</span>
				</q-btn>
				<q-btn
					:label="$t('pages.user.submitToken')" color="positive"
					:disable="awaitResponse"
					:loading="awaitResponse"
					@click="submitVerif"
				/>
			</div>
		</div>
	</template>
</template>

<script lang=ts>
import router from 'src/router';
import { useQuasar } from 'quasar';
import { defineComponent, inject, onMounted, reactive, ref, watch } from 'vue';
import type { fetchInterface } from 'vue/plugins/app';

export default defineComponent({
	name: 'ComponentUserSelection',
	props: {
		isServerMode: Boolean
	},
	emits: ['mapcraftAccountCreation'],
	setup (_props, { emit }) {
		const $q = useQuasar();
		const $fetch = inject('$fetch') as fetchInterface;
		const error = ref<string | null>(null);
		const username = ref<string | null>(null);
		const email = ref<string | null>(null);
		const oldEmail = ref<string | null>(null);
		const password = ref<string | null>(null);
		const passwordRepeat = ref<string | null>(null);
		const isPwd = ref<boolean>(true);
		const awaitResponse = ref<boolean>(false);
		const fetchError = reactive({
			username: false,
			email: false,
			password: false,
			token: false
		});

		// eslint-disable-next-line no-undef
		let interval: NodeJS.Timer;
		const verify = ref<boolean | null>(null);
		const verifyToken = ref<string | null>(null);
		const counterToken = ref<number>(0);

		const submit = (): void => {
			awaitResponse.value = true;
			error.value = null;
			fetchError.email = false;
			fetchError.password = false;
			fetchError.username = false;
			$fetch.post('account/create', {
				username: username.value,
				email: email.value,
				password: password.value
			})
				.then(async (res) => {
					const json = await res.json();
					if (json.statusCode !== 200) {
						error.value = json.info.message;
						switch (json.info.code) {
						case 'AC_006':
							fetchError.username = true;
							break;
						case 'AC_004':
						case 'AC_005':
						case 'AC_007':
						default:
							fetchError.email = true;
						}
					} else {
						window.log.info('Account creation succesful');
						oldEmail.value = email.value;
						verify.value = true;
						counterToken.value = 30;
						interval = setInterval(() => {
							--counterToken.value;
						}, 1000);
					}
				})
				.catch((e) => window.log.error(e.message))
				.finally(() => awaitResponse.value = false);
		};

		const reset = (): void => {
			error.value = null;
			username.value = null;
			email.value = null;
			password.value = null;
			passwordRepeat.value = null;
			fetchError.email = false;
			fetchError.password = false;
			fetchError.username = false;
			fetchError.token = false;
		};

		const editMail = () => {
			if (email.value === oldEmail.value)
				return;
			$fetch.put('account', {
				username: username.value,
				password: password.value,
				email: email.value
			})
				.then(async (res) => {
					const json = await res.json();
					if (json.statusCode !== 200) {
						error.value = json.info.message;
						switch (json.info.code) {
						case 'AC_006':
							fetchError.username = true;
							break;
						case 'AC_004':
						case 'AC_005':
						case 'AC_007':
						default:
							fetchError.email = true;
						}
					} else {
						oldEmail.value = email.value;
						verify.value = true;
					}
				})
				.catch((e) => console.error(e));
		};

		const resendToken = () => {
			if (counterToken.value <= 0) {
				$fetch.post('account/token', {
					username: username.value
				})
					.then(async (d) => {
						const json = await d.json();
						if (json.statusCode !== 200)
							error.value = json.info.message;
						else {
							counterToken.value = 30;
							interval = setInterval(() => {
								--counterToken.value;
							}, 1000);
						}
					})
					.catch((e) => window.log.error(e.message));
			}
		};

		const submitVerif = () => {
			if (verifyToken.value === null || verifyToken.value.includes('#'))
				return;
			error.value = null;
			awaitResponse.value = true;
			fetchError.token = false;
			$fetch.post('account/token', {
				username: username.value,
				token: Number(verifyToken.value)
			})
				.then(async (res) => {
					const json = await res.json();
					if (json.statusCode !== 200) {
						error.value = json.info.message;
						switch (json.info.code) {
						case 'AC_003':
							fetchError.email = true;
							break;
						default:
							fetchError.token = true;
						}
						return;
					}
					$q.loading.show();
					router.push('/').finally(() => $q.loading.hide());
				})
				.catch((e) => window.log.error(e.message))
				.finally(() => awaitResponse.value = false);
		};

		onMounted(() => {
			watch(counterToken, (val) => {
				if (val <= 0) {
					clearInterval(interval);
					counterToken.value = 0;
				}
			});
		});

		return {
			username,
			email,
			password,
			passwordRepeat,
			isPwd,
			awaitResponse,
			fetchError,

			error,
			verify,
			verifyToken,
			counterToken,

			submit,
			reset,

			editMail,
			resendToken,
			submitVerif,

			creation: (): void => emit('mapcraftAccountCreation')
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
