/*eslint-disable prefer-regex-literals*/
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const MCP = require('mapcraft-api').MCplugin;
const Temp = require('mapcraft-api').MCtemplate;
const { MCutilities } = require('mapcraft-api');

//global.MinecraftSelectedVersion

const MCplugin = new MCP();
const Template = new Temp(__dirname);
let LANG = MCplugin.Lang('Utility').Data;
const randomString = () => crypto.randomBytes(12).toString('hex');
const UpdateLang = () =>
{
	LANG = MCplugin.Lang('Utility').Data;
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
		fs.writeFile(_path, JSON.stringify(MCutilities.GetDataGameElement(type, global.MinecraftSelectedVersion), null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
		{
			if (err)
				MCutilities.CreateAlert('warning', document.getElementById('utility-error'), err.message);
			const link = document.createElement('a');
			link.download = `${newID}.json`;
			link.href = _path;
			link.click();
		});
	}

	//#region Blocks
	static _generateListBlock(version)
	{
		let x = 0;
		const list = document.getElementById('blocks-list');
		const jsonData = MCutilities.GetDataGameElement('blocks', version);
		Template.cleanNode(list);
		for (const id of jsonData)
		{
			const image = document.createElement('img');
			const testPath = path.join(__dirname, '../../../../img/assets/block');
			if (fs.existsSync(path.join(testPath, `${id.name}.png`)))
				image.src = path.join(testPath, `${id.name}.png`);
			else if (fs.existsSync(path.join(testPath, `${id.name}.webp`)))
				image.src = path.join(testPath, `${id.name}.webp`);
			else
				image.src = path.join(testPath, '..', 'no_data.png');
			const element = document.createElement('tr');
			const elementId = document.createElement('td');
			elementId.innerText = ++x;
			const elementImage = document.createElement('td');
			elementImage.appendChild(image);
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
		const jsonData = MCutilities.GetDataGameElement('items', version);
		Template.cleanNode(list);
		for (const id of jsonData)
		{
			const image = document.createElement('img');
			const testPath = path.join(__dirname, '../../../../img/assets/item');
			if (fs.existsSync(path.join(testPath, `${id.name}.png`)))
				image.src = path.join(testPath, `${id.name}.png`);
			else if (fs.existsSync(path.join(testPath, `${id.name}.webp`)))
				image.src = path.join(testPath, `${id.name}.webp`);
			else
				image.src = path.join(testPath, '..', 'no_data.png');
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

	//#region Tags
	static _generateTagItem(version)
	{
		const list = document.getElementById('tags-list');
		const jsonData = MCutilities.GetDataGameElement('tags', version);
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

				const _search = (_path, name) =>
				{
					if (fs.existsSync(path.join(_path, `${name}.png`)))
						return path.join(_path, `${name}.png`);
					if (fs.existsSync(path.join(_path, `${name}.webp`)))
						return path.join(_path, `${name}.webp`);
					return undefined;
				};

				for (const row in jsonData[col])
					if (Object.prototype.hasOwnProperty.call(jsonData[col], row))
					{
						const NAME = jsonData[col][row];
						const element = document.createElement('div');
						const image = document.createElement('img');
						let testpath = String;
						let isItem = false;
						testpath = _search(path.join(__dirname, '../../../../img/assets/block'), NAME);
						if (testpath === undefined)
							testpath = _search(path.join(__dirname, '../../../../img/assets/entity'), NAME);
						if (testpath === undefined)
						{
							testpath = _search(path.join(__dirname, '../../../../img/assets/item'), NAME);
							isItem = true;
						}
						if (testpath === undefined)
						{
							testpath = path.join(__dirname, '../../../../img/assets/no_data.png');
							isItem = true;
						}
						if (isTag.test(NAME))
						{
							const link = document.createElement('a');
							link.href = `#list_${NAME.substring(1)}`;
							link.innerText = NAME;
							element.appendChild(link);
						}
						else
						{
							image.classList.add('img-list');
							if (isItem)
								image.classList.add('cubic-img');
							image.src = testpath;
							image.setAttribute('uk-tooltip', `title:${NAME}; pos:right`);
							element.appendChild(image);
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
		setImmediate(() =>
		{
			this.blocks();
			this.items();
			this.tags();
			Template.updateLang(document.getElementById('content'), LANG);
		});
	}
}

module.exports = UtilityComponent;
