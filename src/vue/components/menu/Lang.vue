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
import { globalStore } from 'src/store/global';
import localeOptions from 'src/i18n/options';

export default defineComponent({
	name: 'SelectLang',
	props: {
		isLarge: Boolean
	},
	setup() {
		const store = globalStore();
		const $q = useQuasar();
		const { locale } = useI18n({ useScope: 'global' });
		
		onMounted(() => {
			const ret = $q.localStorage.getItem('lang');
			if (ret)
				locale.value = ret;
		});

		watch(locale, (ret) => {
			for (const lang of localeOptions) {
				if (lang.value === ret as string) {
					$q.lang.set(lang.quasar);
					$q.localStorage.set('lang', ret);
					store.setLang(String(ret));
					break;
				}
			}
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
