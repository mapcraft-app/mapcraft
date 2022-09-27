<template>
	<span class="text-h6 q-pl-sm">Folder path</span>
	<div class="input-group">
		<q-input
			v-model="game"
			standard
			:label="$t('components.options.directory.game')"
			@click="cliick()"
		></q-input>
		<q-input
			v-model="resource"
			standard
			:label="$t('components.options.directory.resource')"
		></q-input>
		<q-input
			v-model="save"
			standard
			:label="$t('components.options.directory.save')"
		></q-input>
		<q-input
			v-model="temp"
			standard
			:label="$t('components.options.directory.temp')"
		></q-input>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { globalStore } from 'src/store/global';

export default defineComponent({
	name: 'OptionsDirectory',
	setup () {
		const store = globalStore();

		const game = ref<string>(store.directory.game);
		const resource = ref<string>(store.directory.resource);
		const save = ref<string>(store.directory.save);
		const temp = ref<string>(store.directory.temp);

		const cliick = () => {
			window.ipc.send('dialog::select-file', game.value);
			console.log('click');
		};

		return {
			game,
			resource,
			save,
			temp,

			cliick
		};
	}
});
</script>
