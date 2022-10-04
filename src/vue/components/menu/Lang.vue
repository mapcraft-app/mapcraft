<template>
	<q-select
		v-model="locale"
		:options="localeOptions"
		square
		emit-value
		map-options
		icon="lang"
		:class="(!isLarge) ? 'lang-input' : ''"
	>
		<template v-slot:append>
			<q-icon name="translate" />
		</template>
	</q-select>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import localeOptions from 'src/i18n/options';
import { globalStore } from 'src/store/global';

export default defineComponent({
	name: 'SelectLang',
	props: {
		isLarge: Boolean
	},
	setup() {
		const store = globalStore();
		const $q = useQuasar();
		const { locale } = useI18n({ useScope: 'global' });

		watch(locale, (ret) => {
			$q.localStorage.set('lang', ret);
			store.setLang(String(ret));
		});

		onMounted(() => {
			const ret = $q.localStorage.getItem('lang');
			if (ret)
				locale.value = ret;
		});

		return {
			locale,
			localeOptions
		};
	}
});
</script>

<style scoped>
.lang-input {
	width: 180px;
}
</style>
