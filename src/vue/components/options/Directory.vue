<template>
	<span class="text-h6 q-pl-sm">Folder path</span>
	<div class="input-group">
		<q-input
			v-model="game"
			standard
			:label="$t('components.options.directory.game')"
		>
			<template v-slot:append>
				<q-icon name="visibility" @click="changeDir(0)"/>
			</template>
		</q-input>
		
		<q-input
			v-model="resource"
			standard
			:label="$t('components.options.directory.resource')"
		>
			<template v-slot:append>
				<q-icon name="visibility" @click="changeDir(1)"/>
			</template>
		</q-input>
		<q-input
			v-model="save"
			standard
			:label="$t('components.options.directory.save')"
		>
			<template v-slot:append>
				<q-icon name="visibility" @click="changeDir(2)"/>
			</template>
		</q-input>
		<q-input
			v-model="temp"
			standard
			:label="$t('components.options.directory.temp')"
		>
			<template v-slot:append>
				<q-icon name="visibility" @click="changeDir(3)"/>
			</template>
		</q-input>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { globalStore } from 'src/store/global';

export default defineComponent({
	name: 'OptionsDirectory',
	setup () {
		const store = globalStore();

		const selectedType = ref(0);
		const game = ref<string>(store.directory.game);
		const resource = ref<string>(store.directory.resource);
		const save = ref<string>(store.directory.save);
		const temp = ref<string>(store.directory.temp);

		const changeDir = (type: number) => {
			selectedType.value = type;
			window.ipc.send('dialog::select-directory', game.value);
			window.ipc.invoke('dialog::select-directory')?.then((data) => {
				console.log('test', data);
			});
		};

		return {
			game,
			resource,
			save,
			temp,

			changeDir
		};
	}
});
</script>
