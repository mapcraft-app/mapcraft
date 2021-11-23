/*eslint-disable prefer-regex-literals*/
const path = require('path');
const fs = require('fs');
const MCP = require('mapcraft-api').MCplugin;
const Temp = require('mapcraft-api').MCtemplate;

const MCplugin = new MCP();
const Template = new Temp(__dirname);

const Data = {
	Blocks: path.join(__dirname, '/list/blocks'),
	Items: path.join(__dirname, '/list/items'),
	Tags: path.join(__dirname, '/list/tags'),
};

let LANG = MCplugin.Lang('Utility').Data;

const UpdateLang = () =>
{
	LANG = MCplugin.Lang('Utility').Data;
};

//#region Search system
function searchInList(input, list, error)
{
	const newError = error;
	const tr = list.getElementsByTagName('tr');
	const isNumber = (!Number.isNaN(input.value));
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
		{
			if (isNumber)
			{
				if (i.getElementsByTagName('td')[1].innerText !== input.value)
				{
					i.style.display = 'none';
				}
				else
				{
					i.style.display = 'table-row';
					isExist = true;
				}
			}
			else if (!isNumber && regex.test(i.getElementsByTagName('td')[2].innerText))
			{
				i.style.display = 'table-row';
				isExist = true;
			}
			else if (!isNumber)
			{
				i.style.display = 'none';
			}
			if (!isExist)
				newError.style.display = 'block';
			else
				newError.style.display = 'none';
		}
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

	//#region Blocks
	static _generateListBlock(version)
	{
		let x = 0;
		const list = document.getElementById('blocks-list');
		const jsonData = JSON.parse(fs.readFileSync(path.join(Data.Blocks, `${version}.json`), 'utf-8'));
		Template.cleanNode(list);
		for (const id of jsonData)
		{
			const image = document.createElement('img');
			const testpath = path.join(__dirname, '../../../../img/assets/block', `${id.name}.png`);
			if (fs.existsSync(testpath))
				image.src = testpath;
			else
				image.src = path.join(__dirname, '../../../../img/assets/block', `${id.name}.webp`);
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
		this._generateListBlock(document.getElementById('blocks-version').value);
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
		document.getElementById('blocks-version').addEventListener('change', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			this._generateListBlock(event.target.value);
			document.getElementById('blocks-search').value = '';
		});
		document.getElementById('block-download').addEventListener('click', () =>
		{
			const link = document.createElement('a');
			link.download = `${document.getElementById('blocks-version').value}.json`;
			link.href = path.join(__dirname, 'list/blocks', link.download);
			link.click();
		});
	}
	//#endregion

	//#region Items
	static _generateListItem(version)
	{
		let x = 0;
		const list = document.getElementById('items-list');
		const jsonData = JSON.parse(fs.readFileSync(path.join(Data.Items, `${version}.json`), 'utf-8'));
		Template.cleanNode(list);
		for (const id of jsonData)
		{
			const image = document.createElement('img');
			const testpath = path.join(__dirname, '../../../../img/assets/item', `${id.name}.png`);
			if (fs.existsSync(testpath))
				image.src = testpath;
			else
				image.src = path.join(__dirname, '../../../../img/assets/item', `${id.name}.webp`);
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
		this._generateListItem(document.getElementById('items-version').value);
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
		document.getElementById('items-version').addEventListener('change', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			this._generateListItem(event.target.value);
			document.getElementById('items-search').value = '';
		});
		document.getElementById('item-download').addEventListener('click', () =>
		{
			const link = document.createElement('a');
			link.download = `${document.getElementById('items-version').value}.json`;
			link.href = path.join(__dirname, 'list/items', link.download);
			link.click();
		});
	}
	//#endregion

	//#region Tags
	static _generateTagItem(version)
	{
		const list = document.getElementById('tags-list');
		const jsonData = JSON.parse(fs.readFileSync(path.join(Data.Tags, `${version}.json`), 'utf-8'));
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
						const image = document.createElement('img');
						let testpath = String;
						let isItem = false;
						if (fs.existsSync(path.join(__dirname, '../../../../img/assets/block', `${NAME}.png`)))
						{
							testpath = path.join(__dirname, '../../../../img/assets/block', `${NAME}.png`);
						}
						else if (fs.existsSync(path.join(__dirname, '../../../../img/assets/block', `${NAME}.webp`)))
						{
							testpath = path.join(__dirname, '../../../../img/assets/block', `${NAME}.webp`);
						}
						else if (fs.existsSync(path.join(__dirname, '../../../../img/assets/item', `${NAME}.png`)))
						{
							testpath = path.join(__dirname, '../../../../img/assets/item', `${NAME}.png`);
							isItem = true;
						}
						else
						{
							testpath = path.join(__dirname, '../../../../img/assets/item', `${NAME}.webp`);
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
		this._generateTagItem(document.getElementById('tags-version').value);
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
		document.getElementById('tags-version').addEventListener('change', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			this._generateTagItem(event.target.value);
			document.getElementById('tags-search').value = '';
		});
		document.getElementById('tags-download').addEventListener('click', () =>
		{
			const link = document.createElement('a');
			link.download = `${document.getElementById('tags-version').value}.json`;
			link.href = path.join(__dirname, 'list/tags', link.download);
			link.click();
		});
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
