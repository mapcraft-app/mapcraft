const path = require('path');
const fs = require('fs');
const WorkInProgress = require('../../../../js/MCworkInProgress');
const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);
const Data = {
	Blocks: path.join(__dirname, '/list/blocks'),
	Items: path.join(__dirname, '/list/items')
}
var LANG; UpdateLang();
function UpdateLang() { LANG = MCplugin.Lang('Utility').Data; }

class UtilityComponent
{
	static utility()
	{
		Template.render(document.getElementById('content'), 'utility.tp', { BlocksIcon: LANG.Menu.Blocks.Icon, ItemsIcon: LANG.Menu.Items.Icon });
	}
	//#region Blocks
	static _generateListBlock(version)
	{
		let x = 0;
		let list = document.getElementById('blocks-list');
		let jsonData = JSON.parse(fs.readFileSync(path.join(Data.Blocks, version +'.json'), 'utf-8'));
		Template.cleanNode(list);
		for (let id of jsonData)
		{
			let image = document.createElement('img'); image.src = path.join(__dirname, '../../../../img/assets/block', id.name + '.png');
			let element = document.createElement('tr');
			let element_id = document.createElement('td'); element_id.innerText = ++x;
			let element_image = document.createElement('td'); element_image.appendChild(image);
			let element_name = document.createElement('td'); element_name.innerText = id.name;
			element.appendChild(element_id); element.appendChild(element_image); element.appendChild(element_name);
			list.appendChild(element);
		}
	}
	static blocks()
	{
		Template.render(document.getElementById('utility-tab-blocks'), 'blocks.tp', { Search: LANG.Search, Download: LANG.Download});
		this._generateListBlock(document.getElementById('blocks-version').value);
		document.getElementById('disabled-form').addEventListener('submit', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
		});
		document.getElementById('blocks-search').addEventListener('input', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			searchInList(event.target, document.getElementById('blocks-list'), document.getElementById('error-block-list'));
		});
		document.getElementById('blocks-version').addEventListener('change', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			this._generateListBlock(event.target.value);
			document.getElementById('blocks-search').value = "";
		});
		document.getElementById('block-download').addEventListener('click', () => {
			let link = document.createElement('a');
			link.download = document.getElementById('blocks-version').value + '.json';
			link.href = path.join(__dirname, 'list/blocks', link.download);
			console.log(link.href);
			link.click();
		});
	}
	//#endregion
	//#region Items
	static _generateListItem(version)
	{
		let x = 0;
		let list = document.getElementById('items-list');
		let jsonData = JSON.parse(fs.readFileSync(path.join(Data.Items, version +'.json'), 'utf-8'));
		Template.cleanNode(list);
		for (let id of jsonData)
		{
			let image = document.createElement('img'); image.src = path.join(__dirname, '../../../../img/assets/item', id.name + '.png');
			let element = document.createElement('tr');
			let element_id = document.createElement('td'); element_id.innerText = ++x;
			let element_image = document.createElement('td'); element_image.appendChild(image);
			let element_name = document.createElement('td'); element_name.innerText = id.name;
			element.appendChild(element_id); element.appendChild(element_image); element.appendChild(element_name);
			list.appendChild(element);
		}
	}
	static items()
	{
		Template.render(document.getElementById('utility-tab-items'), 'items.tp', { Search: LANG.Search, Download: LANG.Download});
		this._generateListItem(document.getElementById('items-version').value);
		document.getElementById('disabled-form').addEventListener('submit', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
		});
		document.getElementById('items-search').addEventListener('input', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			searchInList(event.target, document.getElementById('items-list'), document.getElementById('error-item-list'));
		});
		document.getElementById('items-version').addEventListener('change', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			this._generateListItem(event.target.value);
			document.getElementById('items-search').value = "";
		});
		document.getElementById('item-download').addEventListener('click', () => {
			let link = document.createElement('a');
			link.download = document.getElementById('items-version').value + '.json';
			link.href = path.join(__dirname, 'list/items', link.download);
			console.log(link.href);
			link.click();
		});
	}
	//#endregion
	static draw()
	{
		UpdateLang();
		this.utility();
		this.blocks();
		this.items();
		Template.updateLang(document.getElementById('content'), LANG);
	}
}

function searchInList(input, list, error)
{
	let tr = list.getElementsByTagName('tr');
	let isNumber = (!isNaN(input.value)) ? true : false;
	let isExist = false;
	let regex = new RegExp(input.value);
	if (!input.value)
	{
		error.style.display = "none";
		for (let i of tr)
			i.style.display = "table-row";
	}
	else
	{
		for (let i of tr)
		{
			if (isNumber)
			{
				if (i.getElementsByTagName('td')[1].innerText != input.value)
					i.style.display = "none";
				else
				{
					i.style.display = "table-row";
					isExist = true;
				}
			}
			else
			{
				if (regex.test(i.getElementsByTagName('td')[2].innerText))
				{
					i.style.display = "table-row";
					isExist = true;
				}
				else
					i.style.display = "none";
			}
		}
		if (!isExist)
			error.style.display = "block";
		else
			error.style.display = "none";
	}
}

module.exports = UtilityComponent;
