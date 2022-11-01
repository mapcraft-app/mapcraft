<template>
	<span class="text-h6">{{ $t('components.options.directory.title') }}</span>
	<q-input
		v-model="store.directory.game"
		standard
		:label="$t('components.options.directory.game')"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changeDir(0)" />
		</template>
	</q-input>
		
	<q-input
		v-model="store.directory.resource"
		standard
		:label="$t('components.options.directory.resource')"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changeDir(1)" />
		</template>
	</q-input>
	<q-input
		v-model="store.directory.save"
		standard
		:label="$t('components.options.directory.save')"
	>
		<template v-slot:append>
			<q-btn flat round color="secondary" icon="folder" @click="changeDir(2)" />
		</template>
	</q-input>
	<q-input
		v-model="store.directory.temp"
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
		
		const changeDir = (type: number) => {
			selectedType.value = type;
			window.ipc.send('dialog::select-directory', store.directory.game);
			window.ipc.invoke('dialog::select-directory')?.then((data) => {
				if (data.canceled)
					return;
				switch (selectedType.value) {
				case 0:
					store.directory.game = data.filePaths[0];
					break;
				case 1:
					store.directory.resource = data.filePaths[0];
					break;
				case 2:
					store.directory.save = data.filePaths[0];
					break;
				case 3:
				default:
					store.directory.temp = data.filePaths[0];
				}
			});
		};

		return {
			store,
			changeDir
		};
	}
});
</script>
