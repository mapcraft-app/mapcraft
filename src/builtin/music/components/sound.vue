<template>
	<q-card>
		<q-card-section class="row no-wrap justify-around items-center">
			<div class="upload-drop-zone" @dragover.prevent @drop.prevent>
				<q-icon name="upload" size="3em" />
				<input
					ref="uploadSound" type="file" accept="audio/ogg"
					:label="$capitalize($t('builtin.music.sounds.add'))"
					@change="uploadNewSound"
					@drop="dropNewSound"
				/>
			</div>
			<q-btn
				square icon="delete" color="red"
				size="md" :label="$capitalize($t('builtin.music.general.delete'))"
				@click="deleteSound"
			/>
		</q-card-section>
		<q-card-section>
			<audio
				ref="audioPlayer"
				class="audio-player"
				controls
				preload="auto"
				:src="(sound.name.length > 0) ? getSound(sound.name) : undefined"
				@durationchange="changeDuration"
				@change="() => console.log('change')"
			>
			</audio>
		</q-card-section>
		<q-card-section>
			<q-separator />
			<div class="row justify-around">
				<q-toggle
					v-model="$props.sound.preload"
					:label="$capitalize($t('builtin.music.sounds.preload'))"
					left-label
					:disable="!$props.sound.name.length"
				/>
				<q-toggle
					v-model="$props.sound.stream"
					:label="$capitalize($t('builtin.music.sounds.stream'))"
					left-label
					:disable="!$props.sound.name.length"
				/>
			</div>
			<q-separator class="q-mb-sm" />
			<span class="text-body2">{{ $capitalize($t('builtin.music.sounds.type')) }}</span>
			<q-select
				v-model="$props.sound.type"
				:bottom-slots="false"
				dense
				:options="['event', 'sound']"
				class="q-pb-sm"
				:disable="!$props.sound.name.length"
			/>
			<span class="text-body2">{{ $capitalize($t('builtin.music.sounds.attenuation')) }}</span>
			<q-slider
				v-model="$props.sound.attenuation_distance"
				:min="0" :max="32" :step="1"
				:disable="!$props.sound.name.length"
			/>
			<q-separator class="q-mb-sm" />
			<span class="text-body2">{{ $capitalize($t('builtin.music.sounds.pitch')) }}</span>
			<q-slider
				v-model="$props.sound.pitch"
				:min="0" :max="2" :step="0.05"
				:disable="!$props.sound.name.length"
			/>
			<q-separator class="q-mb-sm" />
			<span class="text-body2">{{ $capitalize($t('builtin.music.sounds.volume')) }}</span>
			<q-slider
				v-model="$props.sound.volume"
				:min="0" :max="2" :step="0.05"
				:disable="!$props.sound.name.length"
			/>
			<q-separator class="q-mb-sm" />
			<span class="text-body2">{{ $capitalize($t('builtin.music.sounds.weight')) }}</span>
			<q-slider
				v-model="$props.sound.weight"
				:min="0" :max="2" :step="0.05"
				:disable="!$props.sound.name.length"
			/>
		</q-card-section>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { sounds } from '../interface';

export default defineComponent({
	name: 'Sound',
	props: {
		category: {
			type: String,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		index: {
			type: Number,
			required: true
		},
		selectedSound: {
			type: String,
			required: true
		},
		sound: {
			type: Object as PropType<sounds>,
			required: true
		}
	},
	emits: ['change-audio', 'delete-sound', 'set-stream'],
	setup (props, { emit }) {
		const isSoundUpdate = ref<boolean>(!!props.sound.name.length);
		const isEvent = ref<boolean>(false);
		const audioPlayer = ref<HTMLAudioElement | null>(null);

		const getSound = (name: string) => window.music.sound.get(name);

		const copySound = (files: FileList) => {
			if (props.selectedSound) {
				window.music.sound.upload({
					index: props.index,
					name: props.selectedSound,
					file: files[0]
				})
					.then((d) => {
						if (props.selectedSound && d && audioPlayer.value) {
							isSoundUpdate.value = true;
							emit('change-audio', d);
						}
						isEvent.value = false;
					})
					.catch((e) => console.error(e));
			}
		};

		const uploadNewSound = (e: Event) => {
			if (isEvent.value)
				return;
			if (e.target) {
				const target = e.target as HTMLInputElement;
				if (target.files)
					copySound(target.files);
			}
		};

		const dropNewSound = (e: DragEvent) => {
			if (isEvent.value)
				return;
			if (e.dataTransfer)
				copySound(e.dataTransfer.files);
		};

		const deleteSound = () => {
			window.music.sound.remove(
				props.selectedSound,
				props.sound.name
			)
				.then(() => {
					emit('delete-sound');
					window.music.datapack.delete(props.id, props.index);
				})
				.catch((e) => console.error(e));
		};

		const changeDuration = (e: Event) => {
			if (!isSoundUpdate.value)
				return;
			const el = e.target as HTMLAudioElement;
			if (el.duration > 4.0)
				emit('set-stream');
			isSoundUpdate.value = false;
		};

		return {
			audioPlayer,

			getSound,
			uploadNewSound,
			dropNewSound,
			deleteSound,
			changeDuration
		};
	}
});
</script>

<style scoped>
.audio-player {
	width: 100%;
}
.upload-drop-zone {
	position: relative;
	padding: 1em;
	width: 50%;
	border: 2px dashed rgba(100, 100, 100, .8);
	cursor: pointer;
	text-align: center;
	color: rgba(100, 100, 100, .8);
}
.upload-drop-zone:hover {
	border: 2px dashed var(--q-secondary);
	color: var(--q-secondary);
}
.upload-drop-zone > input {
	position: absolute;
	cursor: pointer;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
  opacity: 0;
}
</style>
