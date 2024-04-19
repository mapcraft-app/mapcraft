<template>
	<div ref="toggle">
		<q-toggle
			v-model="localDarkMode"
			checked-icon="dark_mode"
			unchecked-icon="light_mode"
			color="grey-4"
			size="5em"
			class="dark-toggle"
			aria-label="Toggle dark mode"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { globalStore } from '@/store/global';

export default defineComponent({
	name: 'DarkMode',
	setup () {
		const $q = useQuasar();
		const store = globalStore();
		const { darkMode } = storeToRefs(store);

		const localDarkMode = ref<boolean>(false);
		const toggle = ref<HTMLDivElement | null>(null);
		const backTrackOfToggle = ref<Element | null>(null);

		const toggleBackground = () => {
			if (backTrackOfToggle.value) {
				if (localDarkMode.value) {
					backTrackOfToggle.value.classList.add('toggle-back-night');
					backTrackOfToggle.value.classList.remove('toggle-back-day');
				} else {
					backTrackOfToggle.value.classList.add('toggle-back-day');
					backTrackOfToggle.value.classList.remove('toggle-back-night');
				}
			}
		};

		onMounted(() => {
			if (toggle.value) {
				backTrackOfToggle.value = toggle.value.children[0].querySelector(
					'div.dark-toggle > div.q-toggle__inner.relative-position.non-selectable > div'
				);
			}
			if (backTrackOfToggle.value)
				backTrackOfToggle.value.classList.add('toggle-back');

			localDarkMode.value = store.darkMode;
			$q.dark.set(store.darkMode);
			toggleBackground();

			watch(darkMode, (newVal) => {
				localDarkMode.value = newVal;
			});

			watch(localDarkMode, (val) => {
				$q.dark.set(val);
				$q.localStorage.set('darkMode', val);
				store.setDarkMode(val);
				toggleBackground();
			});
		});

		return {
			localDarkMode,
			toggle
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
	background-image: url('/imgs/dark_switch/day.svg');
}
.toggle-back-night {
	background-image: url('/imgs/dark_switch/night.svg');
}
</style>
@/app/store/global
