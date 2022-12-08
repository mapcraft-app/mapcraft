<template>
	<q-dialog
		ref="dialog"
		square
		persistent
	>
		<q-card style="width: 85%;">
			<q-card-section>
				<editor-vue
					:data="data"
					@close="closeEditor"
					@save="saveEditor"
				/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { QDialog } from 'quasar';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import EditorVue from './Editor.vue';
import { editorData } from './Editor.vue';

export default defineComponent({
	name: 'DialogEditor',
	components: {
		EditorVue
	},
	setup () {
		const dialog = ref<QDialog | null>(null);
		const data = ref<editorData>({ extension: '', filename: '', data: '' });

		const openEditor = (d: editorData) => {
			data.value = d;
			dialog.value?.show();
		};
		const saveEditor = (code: string) => {
			window.ipc.send('editor::save-editor', code);
			closeEditor();
		};
		const closeEditor = () => {
			data.value = { extension: '', filename: '', data: '' };
			dialog.value?.hide();
		};

		onMounted(() => {
			window.ipc.receiveAll('editor::open', openEditor);
			window.ipc.receiveAll('editor::close', closeEditor);
		});

		onUnmounted(() => {
			window.ipc.remove('editor::open', openEditor);
			window.ipc.remove('editor::close', closeEditor);
		});

		return {
			dialog,
			data,

			saveEditor,
			closeEditor
		};
	}
});
</script>
