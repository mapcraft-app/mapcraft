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
				v-model="tab"
				dense
				align="justify"
				narrow-indicator
				class="q-pb-sm"
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
						class="q-mt-md" @click="deleteMusic(soundList[selectedSoundKey].name)"
					/>
				</q-tab-panel>
				<q-tab-panel name="sounds" class="q-pa-xs">
					<q-btn
						class="add" outline square
						size="lg" icon="add" color="secondary"
						@click="addMusic"
					/>
					<q-list v-if="soundList[selectedSoundKey].sounds.length" bordered>
						<q-expansion-item
							v-for="sound in soundList[selectedSoundKey].sounds"
							:key="sound.name"
							:label="sound.name.length ? sound.name : 'blank'"
						>
							<q-card>
								<q-card-section class="row reverse">
									<q-btn flat icon="delete" color="red" size="md"/>
								</q-card-section>
								<q-card-section>
									<audio class="audio-player" controls>
										<source :src="$path(getSound(sound.name))" type="audio/ogg"/>
									</audio>
								</q-card-section>
								<q-card-section class="row justify-around">
									<q-toggle v-model="sound.preload" label="Preload" left-label />
									<q-toggle v-model="sound.stream" label="Stream" left-label />
								</q-card-section>
								<q-card-section>
									<span class="text-body2">Attenuation distance</span>
									<q-slider
										v-model="sound.attenuation_distance" label
										:min="0" :max="32" :step="1"
									/>
									<q-separator class="q-mb-sm" />
									<span class="text-body2">Pitch</span>
									<q-slider
										v-model="sound.pitch" label
										:min="0" :max="2" :step="0.05"
									/>
									<q-separator class="q-mb-sm" />
									<span class="text-body2">Volume</span>
									<q-slider
										v-model="sound.volume" label
										:min="0" :max="2" :step="0.05"
									/>
									<q-separator class="q-mb-sm" />
									<span class="text-body2">Weight</span>
									<q-slider
										v-model="sound.weight" label
										:min="0" :max="2" :step="0.05"
									/>
								</q-card-section>
							</q-card>
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
import { defineComponent, onBeforeMount, ref } from 'vue';
import { mapStore } from 'store/map';
import createVue from './components/create.vue';
import listVue from './components/list.vue';
import { category, sound } from './interface';

export default defineComponent({
	name: 'Music',
	components: {
		createVue,
		listVue
	},
	setup () {
		const store = mapStore();
		const category: category[] = ['none', 'ambient', 'block', 'hostile', 'master', 'music', 'neutral', 'player', 'record', 'voice', 'weather'];

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
				type: e.type ?? 'event',
				volume: e.volume ?? 1,
				weight: e.weight ?? 1
			}));
		};

		const deleteMusic = (name: string) => window.music.music.remove(name)
			.then(() => {
				console.log('hello');
			})
			.catch((e) => console.error(e));

		const addMusic = () => {
			if (selectedSoundKey.value) {
				soundList.value[selectedSoundKey.value].sounds.push({
					attenuation_distance: 16,
					name: '',
					pitch: 1,
					preload: undefined,
					stream: undefined,
					type: 'event',
					volume: 1,
					weight: 1
				});
			}
		};
		//#endregion Music

		const getSound = (name: string) => window.music.sound.get(name);

		onBeforeMount(() => {
			window.music.init(store.getMapPath());
			soundList.value = window.music.get();
		});

		return {
			category,
			tab,
			createDialog,
			soundList,
			selectedSoundKey,

			createNewMusic,
			selectMusic,
			addMusic,
			deleteMusic,

			getSound
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
.audio-player {
	width: 100%;
}
</style>
