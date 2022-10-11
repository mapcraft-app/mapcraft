<template>
	<q-page>
		<div class="row column justify-center items-center center-div">
			<q-img src="imgs/app/icon_small.png" width="5em" class="q-mb-md" />
			<q-form class="q-gutter-md width-form" @submit="onSubmit" @reset="onReset">
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
				<div class="row inline no-wrap justify-evenly width-fill">
					<q-btn :label="$t('pages.user.submit')" type="submit" color="primary" />
					<q-btn :label="$t('pages.user.reset')" type="reset" color="secondary" />
				</div>
			</q-form>
			<q-separator class="q-mt-md q-mb-md sep" size="1px" color="grey-4" />
			<q-btn unelevated color="green-8" label="Rester hors-ligne" to="/" />
		</div>
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'UserPage',
	setup () {
		const $q = useQuasar();
		const username = ref<string | null>(null);
		const password = ref<string | null>(null);
		const isPwd= ref<boolean>(true);

		const onSubmit = (): void => {
			console.log('submit');
		};

		const onReset = (): void => {
			username.value = null;
			password.value = null;
			$q.notify('Reset form');
		};

		return {
			username,
			password,
			isPwd,
			onSubmit,
			onReset
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
</style>
