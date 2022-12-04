<template>
	<div class="column">
		<span class="text-h6 q-ml-md">{{ title }}</span>
		<pre id="ace-editor" ref="ace-editor"></pre>
		<div class="row reverse no-wrap">
			<q-btn
				color="green-8"
				square label="Save" icon="save"
				class="q-mr-sm"
				@click="handleClick(true)"
			/>
			<q-btn
				color="red-7"
				square label="Cancel" icon="close"
				class="q-mr-sm"
				@click="handleClick(false)"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

interface editorData {
	extension: string;
	filename: string;
	data: string
}

export default defineComponent({
	name: 'Editor',
	setup () {
		let aceEditor: any | undefined = undefined;
		const title = ref<string>('d');

		const handleClick = (save = false): void => {
			if (save)
				window.ipc.send('editor::save-editor', aceEditor.getValue());
			else
				window.ipc.send('editor::close-editor');
		};
		onMounted(() => {
			if (typeof aceEditor === 'undefined') {
				// eslint-disable-next-line no-undef
				aceEditor = ace.edit('ace-editor', {
					theme: 'ace/theme/chaos',
					selectionStyle: 'text',
					enableBasicAutocompletion: true,
					enableSnippets: true,
					enableLiveAutocompletion: true,
					autoScrollEditorIntoView: true,
					showPrintMargin: false,
					showLineNumbers: true,
					minLines: 25,
					maxLines: 25,
					fontSize: '0.80em' 
				});
			}
			window.ipc.receive('editor::open')
				.then((data: editorData) => {
					aceEditor.session.setValue(data.data);
					aceEditor.session.setMode(`ace/mode/${data.extension}`);
					title.value = data.filename;
				})
				.catch((e) => console.error(e));
			window.ipc.receive('editor::close')
				.then(() => {
					aceEditor.session.setValue('');
					title.value = '';
				})
				.catch((e) => console.error(e));
			window.ipc.send('editor::open-editor', 'C:\\Users\\Clement\\Desktop\\MAPCRAFT\\data_pack\\data\\mapcraft\\functions\\built_in\\paintbrush\\brush\\sphere\\11\\block.mcfunction');
		});

		return {
			title,
			handleClick
		};
	}
});
</script>
