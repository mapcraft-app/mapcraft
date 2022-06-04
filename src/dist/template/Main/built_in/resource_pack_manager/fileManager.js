/**
 * Icons:
 * 	https://www.flaticon.com/authors/dimitry-miroliubov
 * 	https://www.flaticon.com/authors/kiranshastry
 * 	https://www.flaticon.com/authors/pixel-perfect
 * 	https://www.freepik.com
 */

const fs = require('fs');
const { MCipc } = require('mapcraft-api');
const path = require('path');

const TYPE = {
	audio: {
		aac: ['aac'],
		flac: ['flac'],
		midi: ['mid'],
		mp3: ['mp3'],
		ogg: ['ogg'],
		real: ['ra', 'ram', 'rm'],
		wav: ['wav'],
		wma: ['wma', 'm4a', 'wpl'],
	},
	image: {
		ai: ['ai'],
		bmp: ['bmp', 'dib'],
		eps: ['eps'],
		gif: ['gif'],
		heif: ['heif', 'heic'],
		indd: ['ind', 'indd', 'indt'],
		jpeg2000: ['jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2'],
		jpg: ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi'],
		pdf: ['pdf'],
		png: ['png'],
		psd: ['psd'],
		raw: ['raw', 'arw', 'cr2', 'nrw', 'k25'],
		svg: ['svg', 'svgz'],
		tiff: ['tiff', 'tif'],
		webp: ['webp'],
	},
	video: {
		avchd: ['avchd'],
		avi: ['avi'],
		flv: ['flv', 'swf'],
		mov: ['mov', 'qt'],
		mp4: ['mp4', 'm4p', 'm4v'],
		mpeg: ['mpg', 'mp2', 'mpeg', 'mpe', 'mpv'],
		ogg: ['ogg'],
		webm: ['webm'],
		wmv: ['wmv'],
	},
	code: {
		js: ['js', 'ts'],
		json: ['json'],
		minecraft: ['mcfunction', 'mcmeta', 'nbt'],
	},
	text: { txt: ['txt'] },
};

class FileManager
{
	constructor(directory, blockAtRoot = true)
	{
		this.DOMelement = document.querySelector('.file-manager');
		this.directory = directory;
		this.currentDir = directory;
		this.blockAtRoot = blockAtRoot;
		this.#init();
		this.generateMain();
	}

	#init(isMenu = true)
	{
		const audio = () =>
		{
			const _div = document.createElement('div');
			_div.classList.add('audio-player', 'hide');
			const h3 = document.createElement('h3');
			const _close = document.createElement('span');
			_close.setAttribute('uk-icon', 'icon: close; ratio: 1.5');
			const _audio = document.createElement('audio');
			_audio.setAttribute('controls', '');
			_audio.setAttribute('id', 'fm-audio-src');
			_div.appendChild(_close);
			_div.appendChild(h3);
			_div.appendChild(_audio);
			_close.addEventListener('click', (e) =>
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				_div.classList.add('hide');
				_audio.pause();
				_audio.setAttribute('src', '');
			});
			return _div;
		};

		const video = () =>
		{
			const _div = document.createElement('div');
			_div.classList.add('video-preview', 'image-preview', 'hide');
			const h3 = document.createElement('h3');
			const _close = document.createElement('span');
			_close.setAttribute('uk-icon', 'icon: close; ratio: 1.5');
			const _video = document.createElement('video');
			_video.setAttribute('controls', '');
			_video.setAttribute('uk-video', '');
			_video.setAttribute('id', 'fm-video-src');
			_div.appendChild(_close);
			_div.appendChild(h3);
			_div.appendChild(_video);
			_close.addEventListener('click', (e) =>
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				_div.classList.add('hide');
				_video.pause();
				_video.setAttribute('src', '');
			});
			return _div;
		};

		const image = () =>
		{
			const _div = document.createElement('div');
			_div.classList.add('image-preview', 'hide');
			const h3 = document.createElement('h3');
			const _close = document.createElement('span');
			_close.setAttribute('uk-icon', 'icon: close; ratio: 1.5');
			const _image = document.createElement('img');
			_image.setAttribute('id', 'fm-image-src');
			_div.appendChild(_close);
			_div.appendChild(h3);
			_div.appendChild(_image);
			_close.addEventListener('click', (e) =>
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				_div.classList.add('hide');
				_image.setAttribute('src', '');
			});
			return _div;
		};

		this.DOMelement.appendChild(audio());
		this.DOMelement.appendChild(image());
		this.DOMelement.appendChild(video());

		if (isMenu)
		{
			const _menu = document.createElement('div');
			_menu.classList.add('menu');
			const _ul = document.createElement('ul');
			_ul.classList.add('uk-breadcrumb');
			const _size = document.createElement('div');
			_size.classList.add('size');
			if (!localStorage.getItem('fm-size'))
				localStorage.setItem('fm-size', 'medium');
			for (let x = 0.75; x <= 1.75; x += 0.50)
			{
				const getType = () =>
				{
					if (x === 0.75)
						return 'small';
					if (x === 1.25)
						return 'medium';
					return 'large';
				};

				const child = document.createElement('span');
				child.setAttribute('uk-icon', `icon: image; ratio: ${x}`);
				_size.appendChild(child);
				child.addEventListener('click', () =>
				{
					this.DOMelement.querySelectorAll('.table > div.case').forEach((_case) =>
					{
						_case.classList.remove('small', 'medium', 'large');
						localStorage.setItem('fm-size', getType());
						_case.classList.add(getType());
					});
				});
			}
			_menu.appendChild(_ul);
			_menu.appendChild(_size);
			this.DOMelement.appendChild(_menu);
		}
		const _table = document.createElement('div');
		_table.classList.add('table');
		this.DOMelement.appendChild(_table);
		this.menu();
	}

	#search(type, extname)
	{
		const json = TYPE[type.toLowerCase()];
		for (const key in json)
			if (Object.prototype.hasOwnProperty.call(json, key))
				if (json[key].indexOf(extname) !== -1)
					return {
						type,
						format: key,
						extension: extname,
					};
		return undefined;
	}

	#cleanNode(node, removeParent = false)
	{
		if (node && node.hasChildNodes())
			while (node.firstChild)
				node.removeChild(node.firstChild);
		if (removeParent)
			node.remove();
	}

	generateCrumb()
	{
		const DOM = this.DOMelement.querySelector('.menu > ul');
		this.#cleanNode(DOM);
		const LI = (dir, name, isHome = false) =>
		{
			const _li = document.createElement('li');
			const _a = document.createElement('a');
			_a.setAttribute('href', dir);
			if (!isHome)
				_a.innerText = name;
			else
				_a.setAttribute('uk-icon', 'home');
			_a.addEventListener('click', (e) =>
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				this.currentDir = path.join(this.directory, dir);
				this.generateMain();
			});
			_li.appendChild(_a);
			DOM.appendChild(_li);
		};

		const newPath = path.relative(this.directory, this.currentDir).split(path.sep);
		LI(path.sep, '', true);
		for (const key in newPath)
			if (Object.prototype.hasOwnProperty.call(newPath, key))
			{
				let _path = path.sep;
				for (let x = 0; x <= key; x++)
					_path = path.join(_path, newPath[x]);
				LI(_path, newPath[key]);
			}
	}

	generateMain()
	{
		const DOM = this.DOMelement.querySelector('div.table');
		const checkType = (file) => ([
			this.#search('audio', file.extension),
			this.#search('image', file.extension),
			this.#search('video', file.extension),
			this.#search('code', file.extension),
			this.#search('text', file.extension),
		].filter((el) => el !== undefined));
		const CASE = (filename, file) =>
		{
			const _div = document.createElement('div');
			_div.classList.add('case', localStorage.getItem('fm-size'));
			const _img = document.createElement('img');
			if (file.length <= 0)
				_img.setAttribute('src', './dist/img/file_manager/empty.png');
			else
				_img.setAttribute('src', `./dist/img/file_manager/${file[0].type}.png`);
			const _p = document.createElement('p');
			_p.innerText = filename;
			_div.appendChild(_img);
			_div.appendChild(_p);
			/*
			_div.addEventListener('contextmenu', (e) =>
			{
				e.preventDefault();

				const Parent = document.querySelector('.file-manager').getBoundingClientRect();
				const Item = e.target.getBoundingClientRect();
				console.log(Parent.left, Parent.top);
				console.log(Item.left, Item.top);

				const el = this.DOMelement.querySelector('.contextual-menu');
				el.style.display = 'flex';
				el.style.left = `${Item.left - Parent.left + e.offsetX}px`;
				el.style.top = `${Item.top - Parent.top + e.offsetY}px`;
			});*/
			_div.addEventListener('click', (e) =>
			{
				e.preventDefault();
				switch (file[0].type)
				{
					case 'folder':
						this.currentDir = path.join(this.currentDir, filename);
						this.generateMain();
						break;
					case 'parent':
						this.currentDir = path.join(this.currentDir, '..');
						this.generateMain();
						break;
					case 'audio':
						this.DOMelement.querySelector('.audio-player > h3').innerText = filename;
						this.DOMelement.querySelector('.audio-player > audio').setAttribute('src', path.join(this.currentDir, filename));
						this.DOMelement.querySelector('.audio-player').classList.remove('hide');
						break;
					case 'image':
						this.DOMelement.querySelector('.image-preview > h3').innerText = filename;
						this.DOMelement.querySelector('.image-preview > img').setAttribute('src', path.join(this.currentDir, filename));
						this.DOMelement.querySelector('.image-preview').classList.remove('hide');
						break;
					case 'video':
						this.DOMelement.querySelector('.video-preview > h3').innerText = filename;
						this.DOMelement.querySelector('.video-preview > video').setAttribute('src', path.join(this.currentDir, filename));
						this.DOMelement.querySelector('.video-preview').classList.remove('hide');
						break;
					case 'code':
					case 'text':
					default:
						MCipc.send('Editor:open', path.join(this.currentDir, filename));
				}
			});
			DOM.appendChild(_div);
		};

		fs.readdir(this.currentDir, { encoding: 'utf-8', withFileTypes: true }, (err, files) =>
		{
			if (err)
				throw new Error(err.message);
			this.#cleanNode(DOM);

			const test = path.relative(this.directory, this.currentDir).split(path.sep);
			if ((!this.blockAtRoot && !test[0].length)
				|| (test[0].length))
				CASE('', [{ type: 'parent' }]);
			for (const file of files)
			{
				file.extension = path.extname(file.name).slice(1);
				if (file.isFile())
					CASE(file.name, checkType(file));
				else if (file.isDirectory())
					CASE(file.name, [{ type: 'folder' }]);
			}
		});
		this.generateCrumb();
	}

	menu()
	{
		const _context = document.createElement('div');
		_context.classList.add('contextual-menu');
		_context.innerHTML = '<h2>One</h2>\n<h2>Two</h2>';
		this.DOMelement.appendChild(_context);
		this.DOMelement.querySelector('.table').addEventListener('contextmenu', (e) =>
		{
			e.preventDefault();
			const Parent = this.DOMelement.getBoundingClientRect();
			const Item = e.target.getBoundingClientRect();
			const el = this.DOMelement.querySelector('.contextual-menu');
			el.style.display = 'flex';
			el.style.left = `${Item.left - Parent.left + e.offsetX}px`;
			el.style.top = `${Item.top - Parent.top + e.offsetY}px`;
		});
	}
}

module.exports = FileManager;
