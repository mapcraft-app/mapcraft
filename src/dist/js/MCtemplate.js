const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const MClink = require('./MClink');

const AutoClean = true;
const checksum = (data, algorithm, encoding) => {
	return (crypto
		.createHash(algorithm || 'sha1')
		.update(data, 'utf8')
		.digest(encoding || 'hex'));
};

class Template
{
	/**
	 * Folder in which all template files of the module are placed
	 * @param {string} directory Relative link of the file to the module
	 */
	constructor(directory)
	{
		this.directory = directory;
		this.DIRFile = 'out';
		this.DIRLink = path.join(directory, this.DIRFile);
		this.CSSFile = 'style.css';
		this.CSSLink = path.join(directory, this.DIRFile, this.CSSFile);
		this.JSFile = 'data.js';
		this.JSLink = path.join(directory, this.DIRFile, this.JSFile);
		this.LOCKFile = 'lock';
		this.LOCKLink = path.join(directory, this.DIRFile, this.LOCKFile);
		fs.readdir(directory, (err, files) => {
			let Hash = new Array();
			let CSS = '';
			let JS = '';
			let TempCSS, TempJS = null;
			if (err)
				throw (err);
			for (const file of files)
			{
				if (path.extname(file) === '.tp')
				{
					let data = fs.readFileSync(path.join(directory, file), 'utf8');
					TempCSS = data.match(/(?<=\[CSS\]\s*).*?(?=\s*\[\/CSS\])/gs);
					if (TempCSS)
						CSS += TempCSS;
					TempJS = data.match(/(?<=\[JS\]\s*).*?(?=\s*\[\/JS\])/gs);
					if (TempJS)
						JS += TempJS;
				}
			}
			Hash.push(checksum(CSS));
			Hash.push(checksum(JS));
			let generateCSS = () => {
				fs.writeFileSync(this.CSSLink, CSS, { flag: 'w' }, 'utf8');
			};
			let generateJS = () => {
				fs.writeFileSync(this.JSLink, JS, { flag: 'w' }, 'utf8');
			};
			let generateLOCK = () => {
				fs.writeFileSync(this.LOCKLink, JSON.stringify({CSS:Hash[0],JS:Hash[1]}, null, 4), { flag: 'w' }, 'utf8');
			};
			let generateEverything = () => {
				generateLOCK();
				generateCSS();
				generateJS();
			};

			if (!fs.existsSync(this.DIRLink))
			{
				fs.mkdirSync(this.DIRLink, '0777', true);
				generateEverything();
			}
			else if (!fs.existsSync(this.LOCKLink) || !fs.readFileSync(this.LOCKLink, 'utf8'))
				generateEverything();
			else
			{
				let ChangeLock = false;
				let lockFile = fs.readFileSync(this.LOCKLink, 'utf8');
				lockFile = JSON.parse(lockFile);
				if (lockFile.CSS !== Hash[0] || !fs.existsSync(this.CSSLink))
				{
					ChangeLock = true;
					generateCSS();
				}
				if (lockFile.JS !== Hash[1] || !fs.existsSync(this.JSLink))
				{
					ChangeLock = true;
					generateJS();
				}
				if (ChangeLock)
					generateLOCK();
			}
		});
	}

//#region Public
	/**
	 * Render template in DOMelement
	 * @param {DOMelement} DOMelement DOMelement on which the elements will be added
	 * @param {string} template Name of template file with extension
	 * @param {json} args Valid json for replace variable(s)
	 */
	render(DOMelement, template, args)
	{
		let HTML = null;
		let data = fs.readFileSync(path.join(this.directory, template), 'utf8');
		if (!data)
			throw data;
		HTML = data.match(/(?<=\[HTML\]\s*).*?(?=\s*\[\/HTML\])/gs);
		if (HTML)
		{
			HTML = HTML.toString().trim();
			if (typeof args === 'object')
			{
				for (let arg in args)
					HTML = HTML.replace(RegExp('{' + arg + '}', 'g'), args[arg])
			}
			HTML = HTML.replace(/{\w+}/g, '');
		}
		this._insertTemplate(DOMelement, template, HTML);
	}

	/**
	 * Get raw of template HTML
	 * @param {string} template Name of template file with extension
	 * @returns Blob raw of HTML template
	 */
	getRaw(template)
	{
		let HTML = null;
		let data = fs.readFileSync(path.join(this.directory, template), 'utf8');
		if (!data)
			throw data;
		HTML = data.match(/(?<=\[HTML\]\s*).*?(?=\s*\[\/HTML\])/gs);
		return (HTML.toString().trim());
	}
	
	/**
	 * Render generated elements in raw formats; data must be valid HTML
	 * @param {DOMelement} DOMelement DOMelement on which the elements will be added
	 * @param {string} rawHTML HTML raw
	 * @param {*} template Name of template file with extension
	 * @param {*} args Valid json for replace variable(s)
	 */
	renderRaw(DOMelement, rawHTML, template, args)
	{
		if (rawHTML === undefined)
			throw 'HTML is ' + rawHTML;
		if (args && typeof args === 'object')
		{
			for (let arg in args)
				rawHTML = rawHTML.replace(RegExp('{' + arg + '}', 'g'), args[arg])
			rawHTML = rawHTML.replace(/{\w+}/g, '');
		}
		this._insertTemplate(DOMelement, template, rawHTML);
	}
	
	/**
	 * Parse HTML raw with variable(s)
	 * @param {string} HTML HTML raw
	 * @param {json} args Valid json for replace variable(s)
	 * @returns 
	 */
	parseRaw(HTML, args)
	{
		if (!HTML)
			throw 'HTML raw is not defined';
		if (typeof args === 'object')
		{
			for (let arg in args)
				HTML = HTML.replace(RegExp('{' + arg + '}', 'g'), args[arg])
		}
		HTML = HTML.replace(/{\w+}/g, '');
		return (HTML);
	}
	
	/**
	 * Update lang of specific DOMelement
	 * @param {DOMelement} DOMelement DOMelement of DOM
	 * @param {json} args Valid json for replace variable(s)
	 */
	updateLang(DOMelement, args)
	{
		/*	
		**	1. NodeList
		**	2. HTMLcollection
		*/
		if (this._ifDOMelementIsLive(DOMelement) !== true)
			throw 'DOMelement is static';
		if (typeof args !== 'object')
			throw 'args is not JSON object';
		if (HTMLCollection.prototype.isPrototypeOf(DOMelement))
		{
			for (let i = 0; i < DOMelement.length; i++) {
				if (DOMelement[i].hasAttribute('lang'))
				{
					let value;
					try {
						value = DOMelement[i].getAttribute('lang').split('.').reduce((args, i) => args[i], args);
					} catch (err) {
						console.error(DOMelement[i].getAttribute('lang') + ' ' + 'is not defined in lang file');
						value = 'undefined';
					}
					if (DOMelement[i].lastChild && DOMelement[i].lastChild.nodeType === 3)
						DOMelement[i].lastChild.remove();
					DOMelement[i].appendChild(document.createTextNode(value));
				}
			}
		}
		else
		{
			let list;
			if (!DOMelement.childNodes)
				list = DOMelement;
			else
				list = DOMelement.childNodes;
			this._iterateNodeList(list, args);
		}
	}
	/**
	 * Correctly clean child of element
	 * @param {DOMelement} node DOMelement
	 * @param {boolean} RemoveParent If true, function remove node after delete child. false by default
	 */
	cleanNode(node, RemoveParent = false)
	{
		if (node && node.hasChildNodes())
		{
			while (node.firstChild)
				node.removeChild(node.firstChild);
		}
		if (RemoveParent)
			node.remove();
	}
//#endregion

//#region Private
	_cleanRender(template)
	{
		let DOMelement = document.querySelectorAll('[tp="'+ template +'"]')[0];
		if (DOMelement && DOMelement.hasChildNodes())
		{
			while (DOMelement.firstChild)
				DOMelement.removeChild(DOMelement.firstChild);
		}
	}
	_cleanIncludes(OldDOMelement)
	{
		let attr = null;
		MClink.addComponent(this.directory.split('\\').pop());
		if (OldDOMelement.hasAttribute('tp'))
			attr = path.parse(OldDOMelement.getAttribute('tp')).name;
		if (attr)
			MClink.removeComponent(attr);
		let DOMelement = document.head.querySelectorAll('[directory]');
		if (DOMelement.length > 0)
		{
			for (let link of DOMelement)
			{
				let attr = link.getAttribute('directory');
				if (MClink.getComponents().indexOf(attr) < 0)
					link.remove();
			}
		}
	}
	_insertTemplate(DOMelement, template, str)
	{
		if (DOMelement === undefined || DOMelement === null)
			throw 'DOMelement of ' + template + ' is ' + DOMelement;
		if (AutoClean)
			this._cleanIncludes(DOMelement);
		this._cleanRender(template);
		let DOM = document.createElement('template');
		DOM.innerHTML = str;
		DOMelement.appendChild(DOM.content.cloneNode(true));
		DOMelement.setAttribute('tp', template.toLowerCase());
		this._includes(DOMelement);
	}
	_includes(DOMelement)
	{
		let SameDirectory = this.directory.split('\\').pop();
		let Link = document.head.querySelectorAll('link[directory="'+ SameDirectory +'"]');
		let Script = document.head.querySelectorAll('script[directory="'+ SameDirectory +'"]');
		if (fs.readFileSync(this.CSSLink, 'utf8') && Link.length < 1)
		{
			let CSSlink = document.createElement('link');
			CSSlink.setAttribute('rel', 'stylesheet');
			CSSlink.setAttribute('href', this.CSSLink);
			CSSlink.setAttribute('directory', this.directory.split('\\').pop());
			document.head.appendChild(CSSlink);
		}
		if (fs.readFileSync(this.JSLink, 'utf8') && Script.length < 1)
		{
			let JSlink = document.createElement('script');
			JSlink.defer = true;
			JSlink.setAttribute('src', this.JSLink);
			JSlink.setAttribute('directory', this.directory.split('\\').pop());
			document.head.appendChild(JSlink);
		}
	}
	/* NodeList */
	_ifDOMelementIsLive(DOMelement)
	{
		let list;
		if (HTMLCollection.prototype.isPrototypeOf(DOMelement))
			return (true);
		if (!DOMelement.childNodes)
			list = DOMelement;
		else
			list = DOMelement.childNodes;
		const length = list.length;
		if (!length)
			return (undefined);
		const element = list.item(0);
		const parent = element.parentNode;
		const clone = parent.cloneNode();
		clone.style.setProperty('display', 'none', 'important');
		parent.appendChild(clone);
		const live = list.length !== length;
		parent.removeChild(clone);
		return (live);
	}
	_iterateNodeList(list, args)
	{
		for (let element of list)
		{
			if (element.nodeName !== '#text' && element.nodeType === 8)
				continue ;
			if (element.nodeName !== '#text' && element.hasAttribute('lang'))
			{
				let value;
				try {
					value = element.getAttribute('lang').split('.').reduce((args, i) => args[i], args);
				} catch (err) {
					console.error(element.getAttribute('lang') + ' ' + 'is not defined in lang file');
					value = 'undefined';
				}
				if (element.lastChild && element.lastChild.nodeType === 3)
					element.lastChild.remove();
				element.appendChild(document.createTextNode(value));
			}
			if (element.childNodes)
				this._iterateNodeList(element.childNodes, args);
		}
	}
//#endregion
}

module.exports = Template;
