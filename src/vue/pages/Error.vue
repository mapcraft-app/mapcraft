<template>
	<div class="column no-wrap justify-center items-center">
		<div style="font-size: 30vh">{{ $t('pages.error.404') }}</div>
		<div class="text-h2" style="opacity: 0.4">{{ $t('pages.error.label') }}</div>
		<q-btn
			class="q-mt-xl"
			color="white"
			text-color="blue"
			unelevated
			to="/"
			:label="$t('pages.error.button')"
			no-caps
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ErrorNotFound'
});
</script>
