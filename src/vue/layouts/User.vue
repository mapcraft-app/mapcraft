<template>
	<q-layout class="map-container" view="hHh lpR fFf" :container="true">
		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'UserLayout'
});
</script>
