<template>
	<div class="column">
		<span class="text-h6 q-ml-md">{{ title }}</span>
		<q-banner v-if="error" inline-actions class="text-white bg-red">{{ error }}</q-banner>
		<div ref="editor" style="margin-bottom: 1em"></div>
		<div class="row reverse no-wrap">
			<q-btn
				:disable="!title"
				color="green-8"
				square label="Save" icon="save"
				class="q-mr-sm"
			/>
			<q-btn
				:disable="!title"
				color="red-7"
				square label="Cancel" icon="close"
				class="q-mr-sm"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState, Compartment } from '@codemirror/state';
import { language } from '@codemirror/language';
import { htmlLanguage, html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import type { PropType } from 'vue';

export interface EditorData {
	extension: string;
	filename: string;
	data: string
}

export default defineComponent({
	name: 'Editor',
	props: {
		data: {
			type: Object as PropType<EditorData>,
			required: true
		}
	},
	emits: [ 'close', 'save' ],
	setup () {
		const editor = ref<HTMLDivElement | null>(null);
		const error = ref<string | undefined>(undefined);
		const title = ref<string | undefined>(undefined);
		
		let codemirrorInstance: EditorView | null = null;
		const languageConf = new Compartment;
		const autoLanguage = EditorState.transactionExtender.of((tr) => {
			if (!tr.docChanged)
				return null;
			const docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100))
			const stateIsHTML = tr.startState.facet(language) === htmlLanguage
			if (docIsHTML === stateIsHTML)
				return null;
			return {
				effects: languageConf.reconfigure(docIsHTML ? html() : javascript())
			}
		});
		const customTheme = EditorView.theme({
			'.cm-scroller': {
				'overflow': 'auto',
				'height': '75vh'
			}
		});

		onMounted(() => {
			codemirrorInstance = new EditorView({
				parent: editor.value as Element,
				state: EditorState.create({
					doc: 'console.log("hello")',
					extensions: [
						basicSetup,
						keymap.of([ indentWithTab ]),
						languageConf.of(javascript()),
						autoLanguage,
						oneDark,
						customTheme
					]
				})
			});
		});

		return {
			editor,
			error,
			title,
			codemirrorInstance
		};

		/*
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
				fontSize: 0.80
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
		*/
	}
});
</script>
