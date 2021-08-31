const path = require('path');
const fs = require('fs');
const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);
var LANG; UpdateLang();
function UpdateLang() { LANG = MCplugin.Lang('Recipe').Data; }

const Models = require('./model');
const LastMinecraftVersion = "1.17";
const Data = {
	Blocks: path.join(__dirname, '../utility/list/blocks', LastMinecraftVersion + '.json'),
	Items: path.join(__dirname, '../utility/list/items', LastMinecraftVersion + '.json')
}


class RecipeComponent
{
	static craft_table()
	{
		Template.render(document.getElementById('crafting_player'), 'craft_player.tp', {ID: "area_crafting_player"});
		Template.render(document.getElementById('crafting_table'), 'craft_table.tp', {ID: "area_crafting_table"});
		Template.render(document.getElementById('stonecutter'), 'stonecutter.tp', {ID: "area_stonecutter"});
		Template.render(document.getElementById('smithing_table'), 'smithing_table.tp', {ID: "area_smithing_table"});

		const Furnace = Template.getRaw('furnace.tp');
		Template.renderRaw(document.getElementById('furnace'), Template.parseRaw(Furnace, {ID:"area_furnace" }), 'furnace.tp', null);
		Template.renderRaw(document.getElementById('blast_furnace'), Template.parseRaw(Furnace, {ID:"area_blast_furnace" }), 'blast_furnace.tp', null);
		Template.renderRaw(document.getElementById('campfire'), Template.parseRaw(Furnace, {ID:"area_campfire" }), 'campfire.tp', null);
		Template.renderRaw(document.getElementById('smoker'), Template.parseRaw(Furnace, {ID:"area_smoker" }), 'smoker.tp', null);
	}
	static draw()
	{
		Template.render(document.getElementById('content'), 'recipe.tp', { Search: LANG.Options.Search });
		const _generateList = new GenerateList();
		this.craft_table();
		Template.updateLang(document.getElementById('content'), LANG);
		CreateRecipe.player();
	}
}

class CreateRecipe
{
	static player()
	{
		document.getElementById('crafting_player_validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let model = Models.crafting_player;
			const RECIPE_CASES = document.getElementById('area_crafting_player-cases');
			const RECIPE_RESULT = document.getElementById('area_crafting_player-result').querySelectorAll('img')[0].id;
			let temp_RECIPE_COUNT = document.getElementById('area_crafting_player-count').value;
			if (temp_RECIPE_COUNT <= 0) temp_RECIPE_COUNT = 1;
			else if (temp_RECIPE_COUNT > 64) temp_RECIPE_COUNT = 64;
			const RECIPE_COUNT = temp_RECIPE_COUNT;
			const FORM_INPUT = document.getElementById('crafting_player_form').elements;
			const FORM = {Shapeless: FORM_INPUT[0].checked, ExactPosition: FORM_INPUT[1].checked, Group: FORM_INPUT[2].value, Output: FORM_INPUT[3].value};
			
			if (FORM.Group)
				model.group = FORM.Group;
			else
				delete model['group'];
			if (FORM.Shapeless)
			{
				model.type = 'minecraft:crafting_shapeless';
				delete model['pattern'];
				delete model['key'];
				let ingredients = new Array();
				const ITEMS = RECIPE_CASES.querySelectorAll('img');
				for (let item of ITEMS)
					ingredients.push({ "item": "minecraft:"+ item.id });
				model.ingredients = ingredients;
			}
			else
			{
				model.type = 'minecraft:crafting_shaped';
				delete model['ingredients'];
				let alpha = 'A';
				const ItemList = new Array();
				const ItemKey = new Array();
				let patternTemp = [
					['', ''],
					['', '']
				];
				const ITEMS = RECIPE_CASES.querySelectorAll('div');
				const xmax = 1; const ymax = 1;
				//#region Fill patternTemp
				let x = 0; let y = 0;
				for (let item of ITEMS)
				{
					if (!item.hasChildNodes()) patternTemp[x][y] = ' ';
					else patternTemp[x][y] = item.children[0].id;
					x++;
					if (x > xmax) { y++; x = 0; }
					if (y > ymax) break ;
				}
				//#endregion
				//#region Transform block to key
				x = 0; y = 0;
				while (y < ymax + 1)
				{
					if (ItemList.indexOf(patternTemp[x][y]) < 0)
					{
						ItemList.push(patternTemp[x][y]);
						ItemKey.push(alpha);
						alpha = this.nextCharacter(alpha);
					}
					x++;
					if (x > xmax) { y++; x = 0; }
				}
				//#endregion
				//#region Key(s)
				let z = 0;
				let Length = ItemList.length;
				let jsonKey = {};
				while (z < Length)
				{
					if (ItemList[z] != ' ')
						jsonKey[ItemKey[z]] = { "item": "minecraft:" + ItemList[z] }
					z++;
				}
				//#endregion
				//#region Pattern
				
				//#endregion
			}
			model.result.item = "minecraft:"+ RECIPE_RESULT;
			model.result.count = RECIPE_COUNT;

			console.log(model);
		});
	}
	static nextCharacter(c) {
		return String.fromCharCode(c.charCodeAt(0) + 1);
	}
}

class GenerateList
{
	constructor()
	{
		this._generateListBlock();
		this._generateListItem();
		document.getElementById('blocks-search').addEventListener('input', (event) => {
			event.preventDefault(); event.stopImmediatePropagation();
			this._searchInList(event.target, document.getElementById('blocks-list'), document.getElementById('error-blocks-list'));
		});
		document.getElementById('items-search').addEventListener('input', (event) => {
			event.preventDefault(); event.stopImmediatePropagation();
			this._searchInList(event.target, document.getElementById('items-list'), document.getElementById('error-items-list'));
		});
	}
	_generateListBlock()
	{
		let list = document.getElementById('blocks-list');
		let jsonData = JSON.parse(fs.readFileSync(path.join(Data.Blocks), 'utf-8'));
		Template.cleanNode(list);
		let trash = document.createElement('img'); trash.src = path.join(__dirname, '../../../../img/assets/trash.png'); trash.id = 'trash';
		trash.setAttribute('uk-tooltip', 'title:'+ LANG.Options.DeleteCase +'; pos: right');
		list.appendChild(trash);
		for (let id of jsonData)
		{
			let image = document.createElement('img');
			let testpath = path.join(__dirname, '../../../../img/assets/block', id.name + '.png');
			if (fs.existsSync(testpath))
				image.src = testpath;
			else
				image.src = path.join(__dirname, '../../../../img/assets/block', id.name + '.webp');
			image.id = id.name;
			image.setAttribute('uk-tooltip', 'title:'+id.name+'; pos:right');
			list.appendChild(image);
		}
	}
	_generateListItem()
	{
		let list = document.getElementById('items-list');
		let jsonData = JSON.parse(fs.readFileSync(path.join(Data.Items), 'utf-8'));
		Template.cleanNode(list);
		let trash = document.createElement('img'); trash.src = path.join(__dirname, '../../../../img/assets/trash.png'); trash.id = 'trash';
		trash.setAttribute('uk-tooltip', 'title:'+ LANG.Options.DeleteCase +'; pos: right');
		for (let id of jsonData)
		{
			let image = document.createElement('img');
			let testpath = path.join(__dirname, '../../../../img/assets/item', id.name + '.png');
			if (fs.existsSync(testpath))
				image.src = testpath;
			else
				image.src = path.join(__dirname, '../../../../img/assets/item', id.name + '.webp');
			image.id = id.name;
			image.setAttribute('uk-tooltip', 'title:'+id.name+'; pos:right');
			list.appendChild(image);
		}
	}
	_searchInList(input, list, error)
	{
		let imgs = list.getElementsByTagName('img');
		let isExist = false;
		let regex = new RegExp(input.value);
		if (!input.value)
		{
			error.style.display = "none";
			for (let i of imgs)
				i.style.removeProperty('display');
		}
		else
		{
			for (let i of imgs)
			{
				if (regex.test(i.id))
				{
					i.style.removeProperty('display');
					isExist = true;
				}
				else
					i.style.display = "none";
			}
			if (!isExist)
				error.style.removeProperty('display');
			else
				error.style.display = "none";
		}
	}
}

module.exports = RecipeComponent;
