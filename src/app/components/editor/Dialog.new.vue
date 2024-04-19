<template>
	<q-dialog
		ref="dialog"
		square
		persistent
	>
		<q-card class="editor">
			<q-card-section>
				<editor :data="data" />
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { QDialog } from 'quasar';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import editor, { type EditorData } from './Editor.vue';

export default defineComponent({
	name: 'DialogEditor',
	components: {
		editor
	},
	setup () {
		const dialog = ref<QDialog | null>(null);
		const data = ref<EditorData>({
			extension: '',
			filename: '',
			data: ''
		});

		const openEditor = (d: EditorData) => {
			data.value = d;
			dialog.value?.show();
		};

		const saveEditor = (code: string) => {
			window.ipc.send('editor::save-editor', code);
			closeEditor();
		};

		const closeEditor = () => {
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

<style scoped>
.editor {
	width: 100%;
	max-width: 75vw !important;
}
</style>
