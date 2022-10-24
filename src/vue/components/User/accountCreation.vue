<template>
	<q-form class="q-gutter-md width-form" @submit="submit" @reset="reset">
		<q-input
			v-model="username"
			filled
			:label="$t('pages.user.user')"
			:hint="$t('pages.user.userHint')"
			:rules="[val => val && val.length > 0 || $t('pages.user.userRule')]"
		/>
		<q-input
			v-model="email"
			type="email"
			filled
			:label="$t('pages.user.email')"
			:hint="$t('pages.user.emailHint')"
			:rules="[val => val && val.length > 0 && /^[\S]+@[\S]+\.[\S]+/.test(val) || $t('pages.user.emailRule')]"
		/>
		<q-input
			v-model="password"
			filled
			:label="$t('pages.user.pass')"
			:type="isPwd ? 'password' : 'text'"
			:hint="$t('pages.user.passHint')"
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
			:hint="$t('pages.user.passHint')"
			:rules="[val => val && val.length > 0 && password === passwordRepeat || $t('pages.user.passRule')]"
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
			<q-btn :label="$t('pages.user.submit')" type="submit" color="primary" />
			<q-btn :label="$t('pages.user.reset')" type="reset" color="secondary" />
		</div>
		<div class="row inline no-wrap justify-evenly">
			<q-btn color="purple" :ripple="false" @click="creation">
				<q-icon left name="arrow_back_ios" />
				<span>Return</span>
			</q-btn>
		</div>
	</q-form>
</template>

<script lang=ts>
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
	name: 'ComponentUserSelection',
	props: {
		isServerMode: Boolean
	},
	emits: ['mapcraftAccountCreation'],
	setup (_props, { emit }) {
		const $api = inject('$api') as string;
		const username = ref<string | null>(null);
		const email = ref<string | null>(null);
		const password = ref<string | null>(null);
		const passwordRepeat = ref<string | null>(null);
		const isPwd = ref<boolean>(true);

		const submit = (): void => {
			fetch(`${$api}/account/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username.value, email: email.value, password: password.value })
			})
				.then((d) => d.json())
				.then((d) => console.log(d))
				.catch((e) => console.error(e));
			console.log('account creation', {
				username: username.value,
				password: password.value
			});
		};

		const reset = (): void => {
			username.value = null;
			email.value = null;
			password.value = null;
			passwordRepeat.value = null;
		};

		return {
			username,
			email,
			password,
			passwordRepeat,
			isPwd,
			submit,
			reset,
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
	}
</style>
