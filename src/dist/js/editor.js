/*eslint-disable no-unused-vars*/
const crypto = require('crypto');

const hexaID = () => crypto
	.randomBytes(Math.ceil(16 / 2))
	.toString('hex')
	.slice(0, 16);
const ObfuctedString = (size) => crypto
	.randomBytes(size)
	.toString('base64')
	.slice(0, size);

const LastEditorTemplate = `
<div class="MCeditor-toolbar">
	<a id="MCeditor-toolbar-bold"><img src="./dist/img/assets/editor/bold.png"/></a>
	<a id="MCeditor-toolbar-italic"><img src="./dist/img/assets/editor/italic.png"/></a>
	<a id="MCeditor-toolbar-underlined"><img src="./dist/img/assets/editor/underlined.png"/></a>
	<a id="MCeditor-toolbar-strikethrough"><img src="./dist/img/assets/editor/strikethrough.png"/></a>
	<a id="MCeditor-toolbar-obfuscated"><img src="./dist/img/assets/editor/obfuscated.png"/></a>
</div>
<textarea id="MCeditor-textarea" class="MCeditor-textarea"></textarea>`;
const EditorTemplate = `
<div class="MCeditor-toolbar">
	<a id="MCeditor-toolbar-bold"><img src="./dist/img/assets/editor/bold.png"/></a>
	<a id="MCeditor-toolbar-italic"><img src="./dist/img/assets/editor/italic.png"/></a>
	<a id="MCeditor-toolbar-underlined"><img src="./dist/img/assets/editor/underlined.png"/></a>
	<a id="MCeditor-toolbar-strikethrough"><img src="./dist/img/assets/editor/strikethrough.png"/></a>
	<a id="MCeditor-toolbar-obfuscated"><img src="./dist/img/assets/editor/obfuscated.png"/></a>
</div>
<div id="MCeditor-textarea" class="MCeditor-textarea" contenteditable="true"></div>`;

class MCeditor
{
	constructor(DOMelement)
	{
		this.ID = hexaID();
		DOMelement.innerHTML = EditorTemplate; //eslint-disable-line
		DOMelement.setAttribute('MCeditor', this.ID);
		DOMelement.classList.add('MCeditor');
		this.EDITOR = DOMelement;
		this.TEXTAREA = this.EDITOR.childNodes[3]; // eslint-disable-line
		const addEvent = this.EDITOR.childNodes[1].childNodes;
		for (const element of addEvent)
			if (element.nodeName === 'A')
				switch (element.id)
				{
					case 'MCeditor-toolbar-bold':
						element.addEventListener('click', () => this._formatting('bold'));
						break;
					case 'MCeditor-toolbar-italic':
						element.addEventListener('click', () => this._formatting('italic'));
						break;
					case 'MCeditor-toolbar-underlined':
						element.addEventListener('click', () => this._formatting('underlined'));
						break;
					case 'MCeditor-toolbar-strikethrough':
						element.addEventListener('click', () => this._formatting('strikethrough'));
						break;
					case 'MCeditor-toolbar-obfuscated':
						element.addEventListener('click', () => this._formatting('obf'));
						break;
					default:
						console.error('No identifiant found');
				}
	}

	get text()
	{
		return this.TEXTAREA.value;
	}

	/**
	 * @private Format selected text
	 */
	_formatting(htmlTag)
	{
		//Actually this function is deprecated, but for time reason is used. In futur a better version is using
		document.execCommand(htmlTag, false, this._getSelectedText());

		/*const RegexTag = new RegExp(`(<${htmlTag}>.*</${htmlTag}>)`);
		const RegexText = new RegExp(`^(?<before>.*)<${htmlTag}>(?<in>.*)</${htmlTag}>(?<after>.*)$`);
		const Text = this.TEXTAREA.innerHTML;
		const GetSelectedText = this._getSelectedText().getRangeAt(0).cloneContents();
		if (!GetSelectedText.toString())
			return;
		if (RegexTag.test(GetSelectedText.toString()))
		{
			const noFormating = GetSelectedText.toString().match(RegexText);
			const newString = document.createTextNode(`${noFormating.groups.before}${noFormating.groups.in}${noFormating.groups.after}`);
			this.TEXTAREA.innerHTML = `${Text.substring(0, Selection.Start)}${newString}${Text.substring(Selection.End, Text.length)}`;
		}
		else
		{
			const newString = document.createTextNode(GetSelectedText.toString());
			const element = document.createElement(htmlTag);
			element.appendChild(newString);
			GetSelectedText.getRangeAt(0).surroundContents(element);
			//this.TEXTAREA.innerHTML = `${Text.substring(0, Selection.Start)}<${htmlTag}>${Selection.Text}</${htmlTag}>${Text.substring(Selection.End, Text.length)}`;
		}*/
	}

	/**
	 * @private Get selected text in text editor
	 */
	_getSelectedText()
	{
		let DOMelement = document.getSelection().baseNode.parentNode;
		while (DOMelement.parentNode)
		{
			if (DOMelement.getAttribute('mceditor') === this.ID)
				return document.getSelection();
			DOMelement = DOMelement.parentNode;
		}
		return undefined;
		//return this.TEXTAREA.value.substring(this.TEXTAREA.selectionStart, this.TEXTAREA.selectionEnd);
	}
}

module.exports = MCeditor;
