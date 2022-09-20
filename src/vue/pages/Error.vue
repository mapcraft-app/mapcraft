<template>
	<div class="column no-wrap justify-center items-center">
		<div style="font-size: 30vh">
			404
		</div>
		<div class="text-h2" style="opacity: 0.4">
			Oops. Nothing here...
		</div>
		<q-btn
			class="q-mt-xl"
			color="white"
			text-color="blue"
			unelevated
			to="/"
			label="Go Home"
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
