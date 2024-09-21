<template>
	<q-splitter
		v-model="splitter"
		class="main"
		:limits="[15,35]"
	>
		<template v-slot:before>
			<div class="row no-wrap justify-around q-ma-md">
				<q-btn
					color="orange-7"
					icon="save"
					@click="save(false)"
				/>
				<q-btn
					:label="$capitalize($t('builtin.music.create.button'))"
					color="green-7"
					@click="createDialog = true"
				/>
			</div>
			<q-separator />
			<list-vue
				:list="soundList"
				@select="selectMusic"
			/>
		</template>
		<template v-if="selectedSoundKey" v-slot:after>
			<q-tabs
				v-model="tab" dense align="justify"
				narrow-indicator class="q-pb-sm"
			>
				<q-tab name="general" :label="$capitalize($t('builtin.music.general.title'))" />
				<q-tab name="sounds" :label="$capitalize($t('builtin.music.sounds.title'))" />
			</q-tabs>
			<q-tab-panels
				v-model="tab"
				animated
				transition-prev="jump-left"
				transition-next="jump-right"
				class="q-pl-sm q-pr-sm"
			>
				<q-tab-panel name="general">
					<general-vue
						:sound="soundList[selectedSoundKey]"
						@change-name="changeMusicName"
						@delete-music="deleteMusic"
					/>
				</q-tab-panel>
				<q-tab-panel name="sounds" class="q-pa-xs">
					<q-btn
						class="add" outline square
						size="lg" icon="add" color="secondary"
						@click="addSound"
					/>
					<q-list v-if="soundList[selectedSoundKey].sounds.length" bordered separator>
						<q-expansion-item
							v-for="(sound, key) in soundList[selectedSoundKey].sounds"
							:key="key"
						>
							<template v-slot:header>
								<q-item-section>
									<span v-if="sound.name.length">
										{{ sound.name }}
									</span>
									<q-icon v-else name="link_off" />
								</q-item-section>
							</template>
							<sound-vue
								:id="soundList[selectedSoundKey].id"
								:category="soundList[selectedSoundKey].category"
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
		</template>
	</q-splitter>
	<create-vue
		:dialog="createDialog"
		@create="createNewMusic"
		@close="createDialog = false"
	/>
</template>

<script lang="ts">
import { useQuasar, QSpinnerPuff } from 'quasar';
import { defineComponent, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapStore } from '@/store/map';
import { capitalize, path } from '@/app/plugins/app';
import { category, sound, sounds } from './interface';

import createVue from './components/create.vue';
import generalVue from './components/general.vue';
import listVue from './components/list.vue';
import soundVue from './components/sound.vue';

export default defineComponent({
	name: 'Music',
	components: {
		createVue,
		generalVue,
		listVue,
		soundVue
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const store = mapStore();
		const category: category[] = ['none', 'ambient', 'block', 'hostile', 'master', 'music', 'neutral', 'player', 'record', 'voice', 'weather'];
		let autosaveInterval: NodeJS.Timer; // eslint-disable-line no-undef

		const splitter = ref<number>(25);
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
			soundList.value[key].sounds = soundList.value[key].sounds?.map((e) => ({
				attenuation_distance: e.attenuation_distance ?? 16,
				name: e.name,
				pitch: e.pitch ?? 1,
				preload: e.preload,
				stream: e.stream,
				type: e.type ?? 'file',
				volume: e.volume ?? 1,
				weight: e.weight ?? 1
			})) ?? [];
		};

		const changeMusicName = (newName: string, oldName: string) => {
			window.music.music.changeName(newName, oldName)
				.then((newSound) => {
					delete soundList.value[oldName];
					soundList.value[newName] = newSound;
					selectedSoundKey.value = newName;
				})
				.catch((e) => {
					console.error(e);
				});
		};

		const deleteMusic = () => {
			if (selectedSoundKey.value) {
				const name = soundList.value[selectedSoundKey.value].name;
				window.music.music.remove(name)
					.then(() => {
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
					type: 'file',
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
		const save = async (autosave: boolean) => {
			const notif = $q.notify({
				group: false,
				timeout: 0,
				position: 'top-right',
				spinner: QSpinnerPuff,
				color: 'orange-7',
				message: autosave
					? capitalize(t('builtin.music.autosave.start'))
					: capitalize(t('builtin.music.save.start'))
			});
			const retData: Record<string, sound> = {};
			for (const key in soundList.value) {
				retData[key] = {
					category: soundList.value[key].category,
					id: soundList.value[key].id,
					name: soundList.value[key].name,
					replace: (!soundList.value[key].replace || soundList.value[key].replace && !soundList.value[key].replace)
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
							: e.stream,
						type: e.type ?? 'file',
						volume: (!e.volume || e.volume && e.volume === 1)
							? undefined
							: e.volume,
						weight: (!e.weight || e.weight && e.weight === 1)
							? undefined
							: e.weight
					}))
				} as sound;
				const maxDurationSounds: number[] = [];
				for (const sound of soundList.value[key].sounds) {
					maxDurationSounds.push(
						await window.music.analyze(
							path(window.music.sound.get(sound.name))
						)
					);
				}
				const maxDurationSoundIndex = maxDurationSounds.indexOf(Math.max(...maxDurationSounds));

				window.music.datapack.create({
					id: soundList.value[key].id,
					name: soundList.value[key].sounds[maxDurationSoundIndex].name.slice(0, soundList.value[key].sounds[maxDurationSoundIndex].name.lastIndexOf('/')),
					category: soundList.value[key].category,
					duration: maxDurationSounds[maxDurationSoundIndex] * 20
				});
			}
			window.music.save(retData)
				.then(() => {
					notif({
						color: 'green-7',
						spinner: false,
						icon: 'task_alt',
						timeout: 2500,
						message: autosave
							? capitalize(t('builtin.music.autosave.end'))
							: capitalize(t('builtin.music.save.end'))
					});
				})
				.catch(() => {
					notif({
						color: 'red-7',
						spinner: false,
						icon: 'error',
						timeout: 2500,
						message: autosave
							? capitalize(t('builtin.music.autosave.fail'))
							: capitalize(t('builtin.music.save.fail'))
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
			clearInterval(autosaveInterval as any);
			save(true);
		});

		return {
			splitter,
			category,
			tab,
			createDialog,
			soundList,
			selectedSoundKey,

			createNewMusic,
			selectMusic,
			changeMusicName,
			deleteMusic,

			addSound,
			changeAudio,
			deleteSound,

			save
		};
	}
});
</script>

<style scoped>
.main {
	height: 100%;
}
.add {
	width: 100%;
}
</style>
