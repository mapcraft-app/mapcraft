<template>
	<q-select
		v-model="locale"
		:options="localeOptions"
		square
		emit-value
		map-options
		icon="lang"
		class="lang-input"
	>
		<template v-slot:append>
			<q-icon name="translate" />
		</template>
	</q-select>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import localeOptions from 'src/i18n/options';

export default defineComponent({
	name: 'SelectLang',
	setup() {
		const $q = useQuasar();
		const { locale } = useI18n({ useScope: 'global' });

		watch(locale, (ret) => $q.localStorage.set('lang', ret));

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
