<template>
	<h1>Hello from quasar</h1>
	<q-btn label="toto est content"></q-btn>
	<!--<router-view />-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'quasar';
import { generateMeta } from '../meta';

export default defineComponent({
	name: 'App',
	setup: () => useMeta(generateMeta())
});
</script>
