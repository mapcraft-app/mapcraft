const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const MClink = require('./MClink');

const AutoClean = true;
const checksum = (data, algorithm, encoding) => crypto
	.createHash(algorithm || 'sha1')
	.update(data, 'utf8')
	.digest(encoding || 'hex');

class Template
{
	/**
	 * Folder in which all template files of the module are placed
	 * @param {string} directory Relative link of the file to the module
	 */
	constructor(directory)
	{
		this.directory = directory;
		this.DIRMAIN = path.join(process.env.AppDataPath, 'template');
		if (!fs.existsSync(this.DIRMAIN))
			fs.mkdirSync(this.DIRMAIN, '0777', true);
		this.DIRFile = path.join(process.env.AppDataPath, 'template', path.basename(directory));
		this.DIRLink = path.join(this.DIRFile);
		this.CSSFile = 'style.css';
		this.CSSLink = path.join(this.DIRFile, this.CSSFile);
		this.JSFile = 'data.js';
		this.JSLink = path.join(this.DIRFile, this.JSFile);
		this.LOCKFile = 'lock';
		this.LOCKLink = path.join(this.DIRFile, this.LOCKFile);
		fs.readdir(directory, (err, files) =>
		{
			const Hash = [];
			let CSS = '';
			let JS = '';
			let TempCSS = null;
			let TempJS = null;
			if (err)
				throw (err);
			for (const file of files)
				if (path.extname(file) === '.tp')
				{
					const data = fs.readFileSync(path.join(directory, file), 'utf8');
					TempCSS = data.match(/(?<=\[CSS\]\s*).*?(?=\s*\[\/CSS\])/gs);
					if (TempCSS)
						CSS += TempCSS;
					TempJS = data.match(/(?<=\[JS\]\s*).*?(?=\s*\[\/JS\])/gs);
					if (TempJS)
						JS += TempJS;
				}
			Hash.push(checksum(CSS));
			Hash.push(checksum(JS));
			const generateCSS = () =>
			{
				fs.writeFileSync(this.CSSLink, CSS, { flag: 'w' }, 'utf8');
			};
			const generateJS = () =>
			{
				fs.writeFileSync(this.JSLink, JS, { flag: 'w' }, 'utf8');
			};
			const generateLOCK = () =>
			{
				fs.writeFileSync(this.LOCKLink, JSON.stringify({ CSS: Hash[0], JS: Hash[1] }, null, 4), { flag: 'w' }, 'utf8');
			};
			const generateEverything = () =>
			{
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
			{
				generateEverything();
			}
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
		const data = fs.readFileSync(path.join(this.directory, template), 'utf8');
		if (!data)
			throw data;
		HTML = data.match(/(?<=\[HTML\]\s*).*?(?=\s*\[\/HTML\])/gs);
		if (HTML)
		{
			HTML = HTML.toString().trim();
			if (typeof args === 'object')
				for (const arg in args)
					if (Object.prototype.hasOwnProperty.call(args, arg))
						HTML = HTML.replace(RegExp(`{${arg}}`, 'g'), args[arg]);
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
		const data = fs.readFileSync(path.join(this.directory, template), 'utf8');
		if (!data)
			throw data;
		HTML = data.match(/(?<=\[HTML\]\s*).*?(?=\s*\[\/HTML\])/gs);
		return (HTML.toString().trim());
	}

	/**
	 * Render generated elements in raw formats; data must be valid HTML
	 * @param {DOMelement} DOMelement DOMelement on which the elements will be added
	 * @param {string} rawHTML HTML raw
	 * @param {string} template Name of template file with extension
	 * @param {JSON} args Valid json for replace variable(s)
	 */
	renderRaw(DOMelement, rawHTML, template, args)
	{
		let newRawHTML = rawHTML;
		if (newRawHTML === undefined)
			throw new Error(`HTML is ${newRawHTML}`);
		if (args && typeof args === 'object')
		{
			for (const arg in args)
				if (Object.prototype.hasOwnProperty.call(args, arg))
					newRawHTML = newRawHTML.replace(RegExp(`{${arg}}`, 'g'), args[arg]);
			newRawHTML = newRawHTML.replace(/{\w+}/g, '');
		}
		this._insertTemplate(DOMelement, template, newRawHTML);
	}

	/**
	 * Parse HTML raw with variable(s)
	 * @param {string} HTML HTML raw
	 * @param {json} args Valid json for replace variable(s)
	 */
	parseRaw(HTML, args)
	{
		let newHTML = HTML;
		if (!newHTML)
			throw new Error('HTML raw is not defined');
		if (typeof args === 'object')
			for (const arg in args)
				if (Object.prototype.hasOwnProperty.call(args, arg))
					newHTML = newHTML.replace(RegExp(`{${arg}}`, 'g'), args[arg]);
		newHTML = newHTML.replace(/{\w+}/g, '');
		return (newHTML);
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
			throw new Error('DOMelement is static');
		if (typeof args !== 'object')
			throw new Error('args is not JSON object');
		if (HTMLCollection.prototype.isPrototypeOf(DOMelement)) // eslint-disable-line
		{
			for (let i = 0; i < DOMelement.length; i++)
				if (DOMelement[i].hasAttribute('lang'))
				{
					let value;
					try
					{
						value = DOMelement[i].getAttribute('lang').split('.').reduce((_args, _i) => _args[_i], args);
					}
					catch (err)
					{
						console.error(`${DOMelement[i].getAttribute('lang')} is not defined in lang file`);
						value = 'undefined';
					}
					if (DOMelement[i].lastChild && DOMelement[i].lastChild.nodeType === 3)
						DOMelement[i].lastChild.remove();
					DOMelement[i].appendChild(document.createTextNode(value));
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
			while (node.firstChild)
				node.removeChild(node.firstChild);
		if (RemoveParent)
			node.remove();
	}
	//#endregion

	//#region Private
	_cleanRender(template)
	{
		const DOMelement = document.querySelectorAll(`[tp="${template}"]`)[0];
		if (DOMelement && DOMelement.hasChildNodes())
			while (DOMelement.firstChild)
				DOMelement.removeChild(DOMelement.firstChild);
	}

	_cleanIncludes(OldDOMelement)
	{
		let attr = null;
		MClink.addComponent(this.directory.split('\\').pop());
		if (OldDOMelement.hasAttribute('tp'))
			attr = path.parse(OldDOMelement.getAttribute('tp')).name;
		if (attr)
			MClink.removeComponent(attr);
		const DOMelement = document.head.querySelectorAll('[directory]');
		if (DOMelement.length > 0)
			for (const link of DOMelement)
			{
				const _attr = link.getAttribute('directory');
				if (MClink.getComponents().indexOf(_attr) < 0)
					link.remove();
			}
	}

	_insertTemplate(DOMelement, template, str)
	{
		if (DOMelement === undefined || DOMelement === null)
			throw new Error(`DOMelement of ${template} is ${DOMelement}`);
		if (AutoClean)
			this._cleanIncludes(DOMelement);
		this._cleanRender(template);
		const DOM = document.createElement('template');
		DOM.innerHTML = str;
		DOMelement.appendChild(DOM.content.cloneNode(true));
		DOMelement.setAttribute('tp', template.toLowerCase());
		this._includes();
	}

	_includes()
	{
		const SameDirectory = this.directory.split('\\').pop();
		const Link = document.head.querySelectorAll(`link[directory="${SameDirectory}"]`);
		const Script = document.head.querySelectorAll(`script[directory="${SameDirectory}"]`);
		if (fs.readFileSync(this.CSSLink, 'utf8') && Link.length < 1)
		{
			const CSSlink = document.createElement('link');
			CSSlink.setAttribute('rel', 'stylesheet');
			CSSlink.setAttribute('href', this.CSSLink);
			CSSlink.setAttribute('directory', this.directory.split('\\').pop());
			document.head.appendChild(CSSlink);
		}
		if (fs.readFileSync(this.JSLink, 'utf8') && Script.length < 1)
		{
			const JSlink = document.createElement('script');
			JSlink.defer = true;
			JSlink.setAttribute('src', this.JSLink);
			JSlink.setAttribute('directory', this.directory.split('\\').pop());
			document.head.appendChild(JSlink);
		}
	}

	/*NodeList*/
	_ifDOMelementIsLive(DOMelement)
	{
		let list;
		if (HTMLCollection.prototype.isPrototypeOf(DOMelement)) // eslint-disable-line
			return (true);
		if (!DOMelement.childNodes)
			list = DOMelement;
		else
			list = DOMelement.childNodes;
		const { length } = list;
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
		for (const element of list)
		{
			if (element.nodeName !== '#text' && element.nodeType === 8)
				continue; // eslint-disable-line
			if (element.nodeName !== '#text' && element.hasAttribute('lang'))
			{
				let value;
				try
				{
					value = element.getAttribute('lang').split('.').reduce((_args, _i) => _args[_i], args);
				}
				catch (err)
				{
					console.error(`${element.getAttribute('lang')} is not defined in lang file`);
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
