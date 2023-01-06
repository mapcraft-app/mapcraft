<template>
	<q-dialog v-model="$props.dialog" persistent>
		<q-card style="width: 40vw">
			<q-card-section class="row reverse q-pb-none">
				<q-btn
					v-close-popup icon="close" flat
					round dense @click="$emit('close')"
				/>
			</q-card-section>
			<q-card-section>
				<q-input v-model="options.name" label="name"/>
				<q-select v-model="options.category" :options="category" label="category"/>
				<q-toggle
					v-model="options.replace" label="replace"
					size="lg" left-label
					class="q-pt-sm"
				/>
				<q-input v-model="options.subtitle" label="subtitle"/>
			</q-card-section>
			<q-card-section class="row reverse">
				<q-btn label="create" color="green-7" @click="create"/>
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

		const create = () => {
			window.music.music.add(toRaw(options.value))
				.then((d) => {
					emit('create', d);
				});
		};

		return {
			category,
			options,

			create
		};
	}
});
</script>
