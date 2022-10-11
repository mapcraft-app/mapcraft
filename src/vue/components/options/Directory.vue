<template>
	<span class="text-h6">{{ $t('components.options.directory.title') }}</span>
	<q-input
		v-model="game"
		standard
		:label="$t('components.options.directory.game')"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changeDir(0)" />
		</template>
	</q-input>
		
	<q-input
		v-model="resource"
		standard
		:label="$t('components.options.directory.resource')"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changeDir(1)" />
		</template>
	</q-input>
	<q-input
		v-model="save"
		standard
		:label="$t('components.options.directory.save')"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changeDir(2)" />
		</template>
	</q-input>
	<q-input
		v-model="temp"
		standard
		:label="$t('components.options.directory.temp')"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changeDir(3)" />
		</template>
	</q-input>
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
				if (data.canceled)
					return;
				switch (selectedType.value) {
				case 0:
					game.value = data.filePaths[0];
					store.directory.game =  data.filePaths[0];
					break;
				case 1:
					resource.value = data.filePaths[0];
					store.directory.resource =  data.filePaths[0];
					break;
				case 2:
					save.value = data.filePaths[0];
					store.directory.save =  data.filePaths[0];
					break;
				case 3:
				default:
					temp.value = data.filePaths[0];
					store.directory.temp =  data.filePaths[0];
				}
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
