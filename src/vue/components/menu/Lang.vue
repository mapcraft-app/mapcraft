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
import { defineComponent, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import localeOptions from 'src/i18n/options';

export default defineComponent({
	name: 'SelectLang',
	setup() {
		const { locale } = useI18n({ useScope: 'global' });

		watch(locale, (ret) => {
			console.log(ret);
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
