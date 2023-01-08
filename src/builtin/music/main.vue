<template>
	<q-page class="page row">
		<div class="left">
			<q-btn
				label="Create sound" color="green-7"
				class="q-ma-md"
				@click="createDialog = true"
			/>
			<list-vue
				:list="soundList"
				@select="selectMusic"
			/>
		</div>
		<div v-if="selectedSoundKey" class="right">
			<q-tabs
				v-model="tab" dense align="justify"
				narrow-indicator class="q-pb-sm"
			>
				<q-tab name="general" label="General" />
				<q-tab name="sounds" label="Sounds" />
			</q-tabs>
			<q-tab-panels
				v-model="tab"
				animated
				transition-prev="jump-left"
				transition-next="jump-right"
				class="q-pl-sm q-pr-sm"
			>
				<q-tab-panel name="general">
					<q-input v-model="soundList[selectedSoundKey].name" label="name"/>
					<q-select v-model="soundList[selectedSoundKey].category" :options="category" label="category"/>
					<q-toggle
						v-model="soundList[selectedSoundKey].replace" label="replace"
						size="lg" left-label
						class="q-pt-sm"
					/>
					<q-input v-model="soundList[selectedSoundKey].subtitle" label="subtitle"/>
					<q-btn
						color="red" label="Delete" icon="delete"
						class="q-mt-md" @click="deleteMusic"
					/>
				</q-tab-panel>
				<q-tab-panel name="sounds" class="q-pa-xs">
					<q-btn
						class="add" outline square
						size="lg" icon="add" color="secondary"
						@click="addSound"
					/>
					<q-list v-if="soundList[selectedSoundKey].sounds.length" bordered>
						<q-expansion-item
							v-for="(sound, key) in soundList[selectedSoundKey].sounds"
							:key="key"
							:label="sound.name.length ? sound.name : 'blank'"
						>
							<sound-vue
								:index="key"
								:selected-sound="selectedSoundKey"
								:sound="sound"
								@change-audio="(d: string) => changeAudio(key, d)"
								@delete-sound="() => deleteSound(key)"
								@set-stream="() => sound.stream = true"
							/>
						</q-expansion-item>
					</q-list>
				</q-tab-panel>
			</q-tab-panels>
		</div>
		<create-vue
			:dialog="createDialog"
			@create="createNewMusic"
			@close="createDialog = false"
		/>
	</q-page>
</template>

<script lang="ts">
import { useQuasar, QSpinnerPuff } from 'quasar';
import { defineComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { mapStore } from 'store/map';
import { category, sound, sounds } from './interface';

import createVue from './components/create.vue';
import listVue from './components/list.vue';
import soundVue from './components/sound.vue';

export default defineComponent({
	name: 'Music',
	components: {
		createVue,
		listVue,
		soundVue
	},
	setup () {
		const $q = useQuasar();
		const store = mapStore();
		const category: category[] = ['none', 'ambient', 'block', 'hostile', 'master', 'music', 'neutral', 'player', 'record', 'voice', 'weather'];
		let autosaveInterval: NodeJS.Timer; // eslint-disable-line no-undef

		const tab = ref<'general' | 'sounds'>('general');
		const createDialog = ref<boolean>(false);
		const soundList = ref<Record<string, sound>>({});
		const selectedSoundKey = ref<string | null>(null);
		
		//#region Music
		const createNewMusic = (d: sound) => {
			selectedSoundKey.value = d.name;
			soundList.value[d.name] = d;
			createDialog.value = false;
		};

		const selectMusic = (key: string) => {
			selectedSoundKey.value = key;
			soundList.value[key].sounds = soundList.value[key].sounds.map((e) => ({
				attenuation_distance: e.attenuation_distance ?? 16,
				name: e.name,
				pitch: e.pitch ?? 1,
				preload: e.preload,
				stream: e.stream,
				type: e.type ?? 'sound',
				volume: e.volume ?? 1,
				weight: e.weight ?? 1
			}));
		};

		const deleteMusic = () => {
			if (selectedSoundKey.value) {
				const name = soundList.value[selectedSoundKey.value].name;
				window.music.music.remove(name)
					.then(() => {
						console.log('hello');
						if (selectedSoundKey.value)
							delete soundList.value[selectedSoundKey.value];
						selectedSoundKey.value = null;
					})
					.catch((e) => console.error(e));
			}
		};
		//#endregion Music

		//#region Sound
		const addSound = () => {
			if (selectedSoundKey.value) {
				soundList.value[selectedSoundKey.value].sounds.push({
					attenuation_distance: 16,
					name: '',
					pitch: 1,
					preload: undefined,
					stream: undefined,
					type: 'sound',
					volume: 1,
					weight: 1
				} as sounds);
				window.music.sound.add(selectedSoundKey.value, { name: '' });
			}
		};

		const changeAudio = (key: number, d: string) => {
			if (selectedSoundKey.value)
				soundList.value[selectedSoundKey.value].sounds[key].name = d;
		};

		const deleteSound = (key: number) => {
			if (selectedSoundKey.value)
				soundList.value[selectedSoundKey.value].sounds.splice(key, 1);
		};
		//#endregion Sound

		//#endregion Autosave
		const save = (autosave: boolean) => {
			const notif = $q.notify({
				group: false,
				timeout: 0,
				position: 'top-right',
				spinner: QSpinnerPuff,
				color: 'orange-7',
				message: autosave
					? 'autosave'
					: 'save'
			});
			const retData: Record<string, sound> = {};
			for (const key in soundList.value) {
				retData[key] = {
					category: soundList.value[key].category,
					id: soundList.value[key].id,
					name: soundList.value[key].name,
					replace: (!soundList.value[key].replace || soundList.value[key].replace && soundList.value[key].replace === false)
						? undefined
						: soundList.value[key].replace,
					subtitle: soundList.value[key].subtitle ?? undefined,
					sounds: soundList.value[key].sounds.map((e) => ({
						name: e.name,
						attenuation_distance: (!e.attenuation_distance || e.attenuation_distance && e.attenuation_distance === 16)
							? undefined
							: e.attenuation_distance,
						pitch: (!e.pitch || e.pitch && e.pitch === 1)
							? undefined
							: e.pitch,
						preload: (!e.preload)
							? undefined
							: e.preload,
						stream: (!e.stream)
							? undefined
							: e.preload,
						type: (e.type === 'sound')
							? undefined
							: 'event',
						volume: (!e.volume || e.volume && e.volume === 1)
							? undefined
							: e.volume,
						weight: (!e.weight || e.weight && e.weight === 1)
							? undefined
							: e.weight
					}))
				} as sound;
			}
			window.music.save(retData)
				.then(() => {
					notif({
						color: 'green-7',
						spinner: false,
						icon: 'task_alt',
						timeout: 2500,
						message: autosave
							? 'finish autosave'
							: 'finish save'
					});
				})
				.catch(() => {
					notif({
						color: 'red-7',
						spinner: false,
						icon: 'error',
						timeout: 2500,
						message: autosave
							? 'autosave error'
							: 'save error'
					});
				});
		};
		//#endregion Autosave

		onBeforeMount(() => {
			window.music.init(store.getMapPath());
			soundList.value = window.music.get();
			autosaveInterval = setInterval(() => save(true), 300000 /* 5min */);
		});

		onBeforeUnmount(() => {
			clearInterval(autosaveInterval);
			save(false);
		});

		return {
			category,
			tab,
			createDialog,
			soundList,
			selectedSoundKey,

			createNewMusic,
			selectMusic,
			deleteMusic,

			addSound,
			changeAudio,
			deleteSound
		};
	}
});
</script>

<style scoped>
.left {
	display: inline-flex;
	flex-direction: column;
	width: 35%;
	max-height: calc(100vh - 5.6em);
	border-right: 1px solid rgba(0, 0, 0, 0.2);
	overflow-x: auto;
}
.right {
	width: 65%;
	max-height: calc(100vh - 5.6em);
	overflow-x: auto;
}
.add {
	width: 100%;
}
</style>
