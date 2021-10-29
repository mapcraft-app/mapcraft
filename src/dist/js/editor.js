const crypto = require('crypto');

const hexaID = () => crypto
	.randomBytes(Math.ceil(16 / 2))
	.toString('hex')
	.slice(0, 16);
const EditorTemplate = `
<div class="MCeditor-toolbar">
	<a id="MCeditor-toolbar-bold"><img src="./dist/img/assets/editor/bold.png"/></a>
	<a id="MCeditor-toolbar-italic"><img src="./dist/img/assets/editor/italic.png"/></a>
	<a id="MCeditor-toolbar-underlined"><img src="./dist/img/assets/editor/underlined.png"/></a>
	<a id="MCeditor-toolbar-strikethrough"><img src="./dist/img/assets/editor/strikethrough.png"/></a>
	<a id="MCeditor-toolbar-obfuscated"><img src="./dist/img/assets/editor/obfuscated.png"/></a>
</div>
<div class="MCeditor-textarea" contenteditable="true"></div>`;

class MCeditor
{
	constructor(DOMelement)
	{
		this.id = hexaID();
		DOMelement.innerHTML = EditorTemplate; //eslint-disable-line
		DOMelement.setAttribute('MCeditor', this.id);
		DOMelement.classList.add('MCeditor');
	}

	getData()
	{
		const DOMelement = document.getElementById(this.id);
		console.log(DOMelement);
	}
}

module.exports = MCeditor;
