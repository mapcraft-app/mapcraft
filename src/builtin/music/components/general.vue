<template>
	<q-input
		v-model="$props.sound.name"
		:label="$capitalize($t('builtin.music.general.name'))"
		:debounce="1000"
	/>
	<q-select
		v-model="$props.sound.category"
		:options="category"
		:label="$capitalize($t('builtin.music.general.category'))"
	/>
	<q-toggle
		v-model="$props.sound.replace"
		:label="$capitalize($t('builtin.music.general.replace'))"
		size="lg" left-label
		class="q-pt-sm"
	/>
	<q-input
		v-model="$props.sound.subtitle"
		:label="$capitalize($t('builtin.music.general.subtitle'))"
	/>
	<q-btn
		color="red"
		:label="$capitalize($t('builtin.music.general.delete'))"
		icon="delete"
		class="q-mt-md"
		@click="deleteMusic"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, watch } from 'vue';
import { category, sound } from '../interface';

export default defineComponent({
	name: 'General',
	props: {
		sound: {
			type: Object as PropType<sound>,
			required: true
		}
	},
	emits: ['delete-music', 'change-name'],
	setup (props, { emit }) {
		const category: category[] = ['none', 'ambient', 'block', 'hostile', 'master', 'music', 'neutral', 'player', 'record', 'voice', 'weather'];

		const deleteMusic = () => emit('delete-music');

		onMounted(() => {
			watch(() => props.sound.name, (newValue, oldValue) => {
				emit('change-name', newValue, oldValue);
			});
		})

		return {
			category,
			deleteMusic
		};
	}
});
</script>
