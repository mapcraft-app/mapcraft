<template>
	<q-toggle
		v-model="darkMode"
		checked-icon="dark_mode"
		unchecked-icon="light_mode"
		color="grey-4"
		size="5em"
		class="dark-toggle"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { globalStore } from 'src/store/global';

export default defineComponent({
	setup() {
		const store = globalStore();
		const darkMode = ref<boolean>(false);
		let backToggle: Element | null;
		const $q = useQuasar();

		const modifyToggleBackground = () => {
			if (darkMode.value) {
				backToggle?.classList.add('toggle-back-night');
				backToggle?.classList.remove('toggle-back-day');
			} else {
				backToggle?.classList.add('toggle-back-day');
				backToggle?.classList.remove('toggle-back-night');
			}
		};

		watch(darkMode, (val) => {
			if (val !== null) {
				$q.dark.set(val);
				$q.localStorage.set('darkMode', val);
				store.setDarkMode(val);
				modifyToggleBackground();
			}
		});

		onMounted(() => {
			backToggle = document.querySelector(
				'div.dark-toggle > div.q-toggle__inner.relative-position.non-selectable > div'
			);
			backToggle?.classList.add('toggle-back');
			const ret = $q.localStorage.getItem('darkMode');
			if (ret) {
				$q.dark.set(Boolean(ret));
				darkMode.value = Boolean(ret);
			}
			modifyToggleBackground();
		});

		return {
			darkMode
		};
	}
});
</script>

<style>
.dark-toggle {
	margin: 0 0.5em 0.5em 0;
}
.toggle-back {
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}
.toggle-back-day {
	background-image: url('/src/assets/imgs/dark_switch/day.svg');
}
.toggle-back-night {
	background-image: url('/src/assets/imgs/dark_switch/night.svg');
}
</style>
