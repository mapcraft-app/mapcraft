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
		<q-toggle v-model="remember" color="green" :label="$t('pages.user.remember')" />
		<div class="row inline no-wrap justify-evenly width-fill">
			<q-btn :label="$t('pages.user.submit')" type="submit" color="primary" />
			<q-btn :label="$t('pages.user.reset')" type="reset" color="secondary" />
		</div>
		<div class="row inline no-wrap justify-evenly">
			<q-btn color="purple" :ripple="false" @click="selected">
				<q-icon left name="arrow_back_ios" />
				<span>Return</span>
			</q-btn>
		</div>
		<q-separator color="grey-1" />
		<div class="row inline no-wrap justify-evenly">
			<q-btn color="positive" :ripple="false" @click="creation">
				<q-icon left name="person_add" />
				<span>Create account</span>
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
	emits: ['mapcraftAccountCreation', 'mapcraftAccountSelected'],
	setup (_props, { emit }) {
		const $api = inject('$api') as string;
		const username = ref<string | null>(null);
		const password = ref<string | null>(null);
		const remember = ref<boolean>(false);
		const isPwd = ref<boolean>(true);

		const submit = (): void => {
			fetch(`${$api}/account/check`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username.value, password: password.value })
			})
				.then((d) => d.json())
				.then((d) => console.log(d))
				.catch((e) => console.error(e));
		};

		const reset = (): void => {
			username.value = null;
			password.value = null;
			remember.value = false;
		};

		return {
			username,
			password,
			remember,
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
	}
</style>
