/*eslint-disable prefer-regex-literals*/
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { MCplugin, MCutilities, MCtemplate } = require('mapcraft-api');

//global.MinecraftSelectedVersion

const Plugins = new MCplugin();
const Template = new MCtemplate(__dirname);
let LANG = Plugins.lang('Utility').Data;
const randomString = () => crypto.randomBytes(12).toString('hex');
const UpdateLang = () =>
{
	LANG = Plugins.lang('Utility').Data;
};

//#region Search system
function searchInList(input, list, error)
{
	const newError = error;
	const tr = list.getElementsByTagName('tr');
	const isNumber = (!Number.isNaN(input.value)); //eslint-disable-line no-unused-vars
	let isExist = false;
	const regex = new RegExp(input.value);
	if (!input.value)
	{
		newError.style.display = 'none';
		for (const i of tr)
			i.style.display = 'table-row';
	}
	else
	{
		for (const i of tr)
			if (regex.test(i.getElementsByTagName('td')[2].innerText))
			{
				i.style.removeProperty('display');
				isExist = true;
			}
			else
			{
				i.style.display = 'none';
			}
		if (!isExist)
			newError.style.removeProperty('display');
		else
			newError.style.display = 'none';
	}
}

function _searchInTagList(input, list, error)
{
	const newError = error;
	const TR = list.getElementsByTagName('tr');
	let isExist = false;
	const regex = new RegExp(input.value);
	if (!input.value)
	{
		newError.style.display = 'none';
		for (const i of TR)
			i.style.removeProperty('display');
	}
	else
	{
		for (const i of TR)
			if (regex.test(i.id))
			{
				i.style.removeProperty('display');
				isExist = true;
			}
			else
			{
				i.style.display = 'none';
			}
		if (!isExist)
			newError.style.removeProperty('display');
		else
			newError.style.display = 'none';
	}
}
//#endregion

class UtilityComponent
{
	static utility()
	{
		Template.render(document.getElementById('content'), 'utility.tp', { BlocksIcon: LANG.Menu.Blocks.Icon, ItemsIcon: LANG.Menu.Items.Icon, TagsIcon: LANG.Menu.Tags.Icon });
	}

	static downloadFile(type)
	{
		const tempPath = JSON.parse(localStorage.getItem('Mapcraft')).TempPath;
		const newID = randomString();
		const _path = path.join(tempPath, `${newID}.json`);
		fs.writeFile(_path, JSON.stringify(MCutilities.getDataGameElement(type, global.MinecraftSelectedVersion), null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
		{
			if (err)
				MCutilities.createAlert('warning', document.getElementById('utility-error'), err.message);
			const link = document.createElement('a');
			link.download = `${newID}.json`;
			link.href = _path;
			link.click();
		});
	}

	static async setImage(img, filePath, name)
	{
		img.setAttribute('src', path.join(filePath, '..', '..', 'loader.gif'));
		fs.access(path.join(filePath, `${name}.webp`), (webp) =>
		{
			if (webp)
				img.setAttribute('src', path.join(filePath, '..', 'no_data.png'));
			else
				img.setAttribute('src', path.join(filePath, `${name}.webp`));
		});
	}

	//#region Blocks
	static _generateListBlock(version)
	{
		let x = 0;
		const list = document.getElementById('blocks-list');
		Template.cleanNode(list);
		const jsonData = MCutilities.getDataGameElement('blocks', version);
		const filePath = path.join(__dirname, '../../../../img/assets/block');
		for (const id of jsonData)
		{
			const element = document.createElement('tr');
			const elementId = document.createElement('td');
			elementId.innerText = ++x;
			const elementImage = document.createElement('td');
			const img = document.createElement('img');
			this.setImage(img, filePath, id.name);
			elementImage.appendChild(img);
			const elementName = document.createElement('td');
			elementName.innerText = id.name;
			element.appendChild(elementId);
			element.appendChild(elementImage);
			element.appendChild(elementName);
			list.appendChild(element);
		}
	}

	static blocks()
	{
		Template.render(document.getElementById('utility-tab-blocks'), 'blocks.tp', { Search: LANG.Search, Download: LANG.Download });
		this._generateListBlock(global.MinecraftSelectedVersion);
		document.getElementById('disabled-form').addEventListener('submit', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
		});
		document.getElementById('blocks-search').addEventListener('input', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			searchInList(event.target, document.getElementById('blocks-list'), document.getElementById('error-block-list'));
		});
		document.getElementById('block-download').addEventListener('click', () => this.downloadFile('blocks'));
	}
	//#endregion

	//#region Items
	static _generateListItem(version)
	{
		let x = 0;
		const list = document.getElementById('items-list');
		Template.cleanNode(list);
		const jsonData = MCutilities.getDataGameElement('items', version);
		const testPath = path.join(__dirname, '../../../../img/assets/item');
		for (const id of jsonData)
		{
			const image = document.createElement('img');
			this.setImage(image, testPath, id.name);
			const element = document.createElement('tr');
			const elementId = document.createElement('td');
			elementId.innerText = ++x;
			const elementImage = document.createElement('td');
			elementImage.appendChild(image);
			const elementName = document.createElement('td');
			elementName.innerText = id.name;
			element.appendChild(elementId); element.appendChild(elementImage);
			element.appendChild(elementName);
			list.appendChild(element);
		}
	}

	static items()
	{
		Template.render(document.getElementById('utility-tab-items'), 'items.tp', { Search: LANG.Search, Download: LANG.Download });
		this._generateListItem(global.MinecraftSelectedVersion);
		document.getElementById('disabled-form').addEventListener('submit', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
		});
		document.getElementById('items-search').addEventListener('input', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			searchInList(event.target, document.getElementById('items-list'), document.getElementById('error-item-list'));
		});
		document.getElementById('item-download').addEventListener('click', () => this.downloadFile('items'));
	}
	//#endregion

	static async setTags(img, filePath, name)
	{
		img.setAttribute('src', path.join(filePath, '..', 'loader.gif'));
		img.classList.add('img-list');
		img.setAttribute('uk-tooltip', `title:${name}; pos:right`);
		fs.access(path.join(filePath, 'block', `${name}.webp`), (errBlock) =>
		{
			if (errBlock)
				fs.access(path.join(filePath, 'entity', `${name}.webp`), (errEntity) =>
				{
					if (errEntity)
						fs.access(path.join(filePath, 'item', `${name}.webp`), (errItem) =>
						{
							if (errItem)
							{
								img.setAttribute('src', path.join(filePath, 'no_data.png'));
							}
							else
							{
								img.setAttribute('src', path.join(filePath, 'item', `${name}.webp`));
								img.classList.add('cubic-img');
							}
						});
					else
						img.setAttribute('src', path.join(filePath, 'entity', `${name}.webp`));
				});
			else
				img.setAttribute('src', path.join(filePath, 'block', `${name}.webp`));
		});
	}

	//#region Tags
	static _generateTagItem(version)
	{
		const list = document.getElementById('tags-list');
		const jsonData = MCutilities.getDataGameElement('tags', version);
		const isTag = new RegExp('^#.+');
		Template.cleanNode(list);
		for (const col in jsonData)
			if (Object.prototype.hasOwnProperty.call(jsonData, col))
			{
				const TR = document.createElement('tr');
				TR.id = `list_${col}`;
				const TD_NAME = document.createElement('td');
				const P_TD_NAME = document.createElement('p');
				P_TD_NAME.innerText = col;
				TD_NAME.appendChild(P_TD_NAME);
				const TD_TAG = document.createElement('td');
				const TD_DIV = document.createElement('div');
				TD_DIV.classList.add('uk-flex', 'uk-flex-wrap');

				for (const row in jsonData[col])
					if (Object.prototype.hasOwnProperty.call(jsonData[col], row))
					{
						const NAME = jsonData[col][row];
						const element = document.createElement('div');
						if (isTag.test(NAME))
						{
							const link = document.createElement('a');
							link.href = `#list_${NAME.substring(1)}`;
							link.innerText = NAME;
							element.appendChild(link);
						}
						else
						{
							const img = document.createElement('img');
							this.setTags(img, path.join(__dirname, '../../../../img/assets'), NAME);
							element.appendChild(img);
						}
						element.classList.add('tag-list');
						TD_DIV.appendChild(element);
					}
				TD_TAG.appendChild(TD_DIV);
				TR.appendChild(TD_NAME); TR.appendChild(TD_TAG);
				list.appendChild(TR);
			}
	}

	static tags()
	{
		Template.render(document.getElementById('utility-tab-tags'), 'tags.tp', { Search: LANG.Search, Download: LANG.Download });
		this._generateTagItem(global.MinecraftSelectedVersion);
		document.getElementById('disabled-form').addEventListener('submit', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
		});
		document.getElementById('tags-search').addEventListener('input', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			_searchInTagList(event.target, document.getElementById('tags-list'), document.getElementById('error-tags-list'));
		});
		document.getElementById('tags-download').addEventListener('click', () => this.downloadFile('tags'));
	}
	//#endregion

	static main()
	{
		UpdateLang();
		this.utility();
		this.blocks();
		this.items();
		this.tags();
		Template.updateLang(document.getElementById('content'), LANG);
	}
}

module.exports = UtilityComponent;
