import { defineStore } from 'pinia';
import { ref } from 'vue';

window.localStorage.setItem('user', `__q_objt|${JSON.stringify(window.env.user())}`);

export const userStore = defineStore('user', () => {
	const username = ref<string | null>(window.env.user().username);
	const minecraftUsername = ref<string | null>(window.env.user().minecraftUsername ?? window.env.user().username);
	const offline = ref<boolean>(window.env.user().offline);
	const remember = ref<boolean>(window.env.user().remember);

	function setUsername(user: string): void {
		username.value = user;
	}

	function setMinecraftUsername(user: string): void {
		minecraftUsername.value = user;
	}

	function setOffline(off: boolean): void {
		offline.value = off;
	}

	function setRemember(rem: boolean): void {
		remember.value = rem;
	}

	return {
		username,
		minecraftUsername,
		offline,
		remember,
		setUsername,
		setMinecraftUsername,
		setOffline,
		setRemember
	};
});