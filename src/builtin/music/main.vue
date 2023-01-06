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
				@select="selectSound"
			/>
		</div>
		<div v-if="selectedSound" class="right column">
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
					<q-input v-model="selectedSound.name" label="name"/>
					<q-select v-model="selectedSound.category" :options="category" label="category"/>
					<q-toggle
						v-model="selectedSound.replace" label="replace"
						size="lg" left-label
						class="q-pt-sm"
					/>
					<q-input v-model="selectedSound.subtitle" label="subtitle"/>
				</q-tab-panel>
				--q-dark-page

				<q-tab-panel name="sounds" class="no-padding">
					<q-list bordered>
						<q-expansion-item
							v-for="sound in selectedSound.sounds"
							:key="sound.name"
							:label="sound.name"
						>
							<q-card>
								<q-card-section>
									<audio class="audio-player" controls></audio>
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
			@create="createNewSound"
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
		const selectedSound = ref<sound | null>(null);
		
		const createNewSound = (d: sound) => {
			selectedSound.value = d;
			soundList.value[d.name] = d;
			createDialog.value = false;
		};

		const selectSound = (d: sound) => {
			selectedSound.value = d;
			selectedSound.value.sounds = d.sounds.map((e) => ({
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

		onBeforeMount(() => {
			window.music.init(store.getMapPath());
			soundList.value = window.music.get();
		});

		return {
			category,
			tab,
			createDialog,
			soundList,
			selectedSound,

			createNewSound,
			selectSound
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
.audio-player {
	width: 100%;
}
</style>
