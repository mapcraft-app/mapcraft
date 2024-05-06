<template>
	<div class="column">
		<span class="text-h6 q-ml-md">{{ title }}</span>
		<q-banner v-if="error" inline-actions class="text-white bg-red">{{ error }}</q-banner>
		<pre
			id="ace-editor"
		>
		</pre>
		<div class="row reverse no-wrap">
			<q-btn
				:disable="!title"
				color="green-8"
				square label="Save" icon="save"
				class="q-mr-sm"
				@click="handleClick(true)"
			/>
			<q-btn
				:disable="!title"
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
import type { PropType } from 'vue';

export interface editorData {
	extension: string;
	filename: string;
	data: string
}

export default defineComponent({
	name: 'Editor',
	props: {
		data: {
			type: Object as PropType<editorData>,
			required: true
		}
	},
	emits: [ 'close', 'save' ],
	setup (props, { emit }) {
		let aceEditor: any | undefined = undefined;
		const error = ref<string | undefined>(undefined);
		const title = ref<string | undefined>(undefined);

		const handleClick = (save = false): void => {
			if (!title.value)
				return;
			if (save)
				emit('save', aceEditor?.getValue());
			else
				emit('close');
		};

		onMounted(() => {
			aceEditor = ace.edit('ace-editor', { // eslint-disable-line no-undef
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
				fontSize: '1em'
			});
			aceEditor.session.setValue(props.data.data);
			aceEditor.session.setMode(`ace/mode/${props.data.extension}`);
			title.value = props.data.filename;
		});

		return {
			error,
			title,
			handleClick
		};
	}
});
</script>
