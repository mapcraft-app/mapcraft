<template>
	<q-dialog v-model="$props.dialog" persistent>
		<q-card style="width: 40vw">
			<q-card-section class="row reverse q-pb-none">
				<q-btn
					v-close-popup icon="close" flat
					round dense @click="$emit('close')"
				/>
			</q-card-section>
			<q-card-section v-if="error">
				<q-banner inline-actions class="text-white text-center bg-red">
					<span class="text-body1">
						{{ $capitalize($t('builtin.music.create.button', options.name)) }}
					</span>
				</q-banner>
			</q-card-section>
			<q-card-section>
				<q-input v-model="options.name" :label="$capitalize($t('builtin.music.general.name'))" />
				<q-select v-model="options.category" :options="category" :label="$capitalize($t('builtin.music.general.category'))" />
				<q-toggle
					v-model="options.replace"
					:label="$capitalize($t('builtin.music.general.replace'))"
					size="lg" left-label
					class="q-pt-sm"
				/>
				<q-input v-model="options.subtitle" :label="$capitalize($t('builtin.music.general.subtitle'))"/>
			</q-card-section>
			<q-card-section class="row reverse">
				<q-btn :label="$capitalize($t('builtin.music.create.create'))" color="green-7" @click="create"/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw } from 'vue';
import { category, sound } from '../interface';

export default defineComponent({
	name: 'Create',
	props: {
		dialog: {
			type: Boolean,
			required: true,
			default: true,
		}
	},
	emits: ['create', 'close'],
	setup (_props, { emit }) {
		const category: category[] = ['none', 'ambient', 'block', 'hostile', 'master', 'music', 'neutral', 'player', 'record', 'voice', 'weather'];
		const options = ref<sound>({ category: 'none' } as sound);
		const error = ref<boolean>(false);

		const create = () => {
			window.music.music.add(toRaw(options.value))
				.then((d) => {
					emit('create', d);
				})
				.catch(() => error.value = true);
		};

		return {
			category,
			options,
			error,

			create
		};
	}
});
</script>
