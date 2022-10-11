<template>
	<q-page>
		<div class="row column justify-center items-center center-div">
			<q-img src="imgs/app/icon_small.png" width="5em" class="q-mb-md" />
			<q-form class="q-gutter-md width-form" @submit="onSubmit" @reset="onReset">
				<q-input
					v-model="username"
					filled
					label="Username"
					hint="Your account username"
					:rules="[val => val && val.length > 0 || 'Username is mandatory']"
				/>
				<q-input
					v-model="password"
					filled
					label="Password"
					:type="isPwd ? 'password' : 'text'"
					hint="Password with toggle"
					:rules="[val => val && val.length > 0 || 'Password is mandatory']"
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
					<q-btn label="Submit" type="Submit" color="primary" />
					<q-btn label="Reset" type="Submit" color="secondary" />
				</div>
			</q-form>
		</div>
	</q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref, watch } from 'vue';

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
</style>