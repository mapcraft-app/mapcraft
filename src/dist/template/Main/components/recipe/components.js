const path = require('path');
const fs = require('fs');
const IPC = require('../../../../js/MCipc');
const MCutilities = require('../../../../js/MCutilities');
const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);
var LANG; UpdateLang();
function UpdateLang() { LANG = MCplugin.Lang('Recipe').Data; }

const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const RecipesDirectory = path.join(LocalMapcraft.Data.DataPack, 'data', 'mapcraft-data', 'recipes');
if (!fs.existsSync(RecipesDirectory)) fs.mkdirSync(RecipesDirectory);

const Models = require('./model');

const LastMinecraftVersion = "1.17";
const Data = {
	Blocks: path.join(__dirname, '../utility/list/blocks', LastMinecraftVersion + '.json'),
	Items: path.join(__dirname, '../utility/list/items', LastMinecraftVersion + '.json')
}

//#region General function
function CreateAlert(type, DOMelement, str)
{
	let alert = document.createElement('div');
	alert.classList.add('uk-alert-' + type);
	alert.setAttribute('uk-alert', '');
	let closeButton = document.createElement('a');
	closeButton.classList.add('uk-alert-close');
	closeButton.setAttribute('uk-close', '');
	let text = document.createElement('p').appendChild(document.createTextNode(str));
	alert.appendChild(closeButton);
	alert.appendChild(text);
	DOMelement.appendChild(alert);
}
//#endregion

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


	static recipe_list()
	{
		let createAccordion = (group) => {
			let newAccordion = document.createElement('li');
			let main_a = document.createElement('a'); main_a.classList.add('uk-accordion-title'); main_a.href = "#"; main_a.innerText = group;
			let main_div = document.createElement('div'); main_div.classList.add('uk-accordion-content');
			let UL = document.createElement('ul'); UL.classList.add('uk-list', 'uk-list-square'); UL.id = group + "-list";
			main_div.appendChild(UL);
			newAccordion.appendChild(main_a); newAccordion.appendChild(main_div);
			document.getElementById('sound-list').appendChild(newAccordion);
		};
		
		createAccordion('default');
		fs.readdir(RecipesDirectory, {encoding: 'utf-8', withFileTypes: false}, (err, files) => {
			if (err) throw err;
			for (let file of files)
			{
				if (path.extname(file) === '.json')
				{
					fs.readFile(path.join(RecipesDirectory, file), {encoding: 'utf-8', flag: 'r'}, (err, data) => {
						if (err) throw err;
						const _json = JSON.parse(data);
						if (!document.getElementById(_json.group + '-list') && _json.hasOwnProperty('group'))
							createAccordion(_json.group);
						let newItem = document.createElement('li'); newItem.innerText = path.basename(file, '.json');
						if (_json.hasOwnProperty('group'))
							document.getElementById(_json.group + "-list").appendChild(newItem);
						else
							document.getElementById("default-list").appendChild(newItem);
						newItem.addEventListener('click', (event) => {
							this.FillForm(event);
						});
					});
				}
			}
		});
	}

	static FillForm(event)
	{
		const pathFile = event.target.innerText + '.json';
		fs.readFile(path.join(RecipesDirectory, pathFile), {encoding: 'utf-8', flag: 'r'}, (err, data) => {
			if (err) throw err;
			data;
		});
	}

	static draw()
	{
		UpdateLang();
		Template.render(document.getElementById('content'), 'recipe.tp', { Search: LANG.Options.Search });
		const _generateList = new GenerateList();
		this.craft_table();
		this.recipe_list();
		Template.updateLang(document.getElementById('content'), LANG);
		CreateRecipe.setEvent();
	}
}

class CreateRecipe
{
	static generateCraftingTable_2_3(nameOfId, optionFormId, is3x3 = false)
	{
		let model = Models.crafting_player;
		const RECIPE_CASES = document.getElementById(nameOfId + '-cases');
		let case_count = (is3x3) ? 9 : 4;
		let case_x = 0;
		let check_empty_cases = RECIPE_CASES.querySelectorAll('div');
		for (let _case of check_empty_cases)
			if (!_case.hasChildNodes()) ++case_x;
		if (case_x === case_count)
			throw 'No item on recipe cases';
		try {
			document.getElementById(nameOfId + '-result').querySelectorAll('img')[0].id;
		} catch (e) {
			throw 'No item on result case';
		}
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result').querySelectorAll('img')[0].id;
		let temp_RECIPE_COUNT = document.getElementById(nameOfId + '-count').value;
		if (temp_RECIPE_COUNT <= 0) temp_RECIPE_COUNT = 1;
		else if (temp_RECIPE_COUNT > 64) temp_RECIPE_COUNT = 64;
		const RECIPE_COUNT = temp_RECIPE_COUNT;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
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
			let jsonKey = {};
			let jsonPattern = new Array();
			const ItemList = new Array();
			const ItemKey = new Array();
			let patternTemp, rowMAX, colMAX;
			if (!is3x3)
			{
				rowMAX = 1;
				colMAX = 1;
				patternTemp = [
					['', ''],
					['', '']
				];
			}
			else
			{
				rowMAX = 2;
				colMAX = 2;
				patternTemp = [
					['', '', ''],
					['', '', ''],
					['', '', '']
				];
			}
			const ITEMS = RECIPE_CASES.querySelectorAll('div');
			//#region Fill patternTemp
			let row = 0; let col = 0;
			for (let item of ITEMS)
			{
				if (!item.hasChildNodes())
					patternTemp[row][col] = ' ';
				else 
					patternTemp[row][col] = item.children[0].id;
				col++;
				if (col > colMAX) { row++; col = 0; }
				if (row > rowMAX) break ;
			}
			//#endregion
			//#region Transform block to key
			row = 0; col = 0;
			while (row <= rowMAX)
			{
				if (ItemList.indexOf(patternTemp[row][col]) < 0)
				{
					ItemList.push(patternTemp[row][col]);
					ItemKey.push(alpha);
					alpha = this.nextCharacter(alpha);
				}
				col++;
				if (col > colMAX) { row++; col = 0; }
			}
			//#endregion
			//#region Key(s)
			let z = 0;
			let Length = ItemList.length;
			while (z < Length)
			{
				if (ItemList[z] != ' ')
					jsonKey[ItemKey[z]] = { "item": "minecraft:" + ItemList[z] }
				z++;
			}
			model.key = jsonKey;
			//#endregion
			//#region Pattern
			row = 0; col = 0;
			while (row <= rowMAX)
			{
				let index = ItemList.indexOf(patternTemp[row][col]);
				if (ItemList[index] != ' ')
					patternTemp[row][col] = ItemKey[index];
				else
					patternTemp[row][col] = ' ';
				col++;
				if (col > colMAX) { row++; col = 0; }
			}
			//#endregion
			//#region Reduce pattern & generate final pattern
			if (!FORM.ExactPosition)
			{
				let test;
				//#region Remove empty row
				row = 0; col = 0;
				while (row <= rowMAX)
				{
					test = false;
					col = 0;
					while (col <= colMAX)
					{
						if (patternTemp[row][col] != ' ') { test = true; break; }
						col++;
					}
					if (!test)
					{
						patternTemp.splice(row, 1);
						--rowMAX;
					}
					row++;
				}
				//#endregion
				//#region Remove empty column
				row = 0; col = 0;			
				while (col <= colMAX)
				{
					test = false;
					row = 0;
					while (row <= rowMAX)
					{
						if (patternTemp[row][col] != ' ') { test = true; break; }
						row++;
					}
					if (!test)
					{
						row = 0;
						while (row <= rowMAX)
							patternTemp[row++].splice(col, 1);
						--colMAX;
					}
					col++;
				}
				//#endregion
			}
			for (let row of patternTemp)
				jsonPattern.push(row.join(''));
			model.pattern = jsonPattern;
			//#endregion
		}
		model.result.item = "minecraft:"+ RECIPE_RESULT;
		model.result.count = parseInt(RECIPE_COUNT, 10);
		return ({data: model, output: FORM.Output});
	}
	
	static generateFurnace(nameOfId, optionFormId, type)
	{
		let model = Models.furnace;
		try {
			document.getElementById(nameOfId + '-cases').querySelectorAll('div')[0].children[0].id;
		} catch (e) {
			throw 'No item on recipe case';
		}
		const RECIPE_CASE = document.getElementById(nameOfId + '-cases').querySelectorAll('img')[0].id;
		try {
			document.getElementById(nameOfId + '-result').querySelectorAll('img')[0].id
		} catch (e) {
			throw 'No item on result case';	
		}
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result').querySelectorAll('img')[0].id;
		let temp_RECIPE_COUNT = document.getElementById(nameOfId + '-count').value;
		if (temp_RECIPE_COUNT <= 0) temp_RECIPE_COUNT = 1;
		else if (temp_RECIPE_COUNT > 64) temp_RECIPE_COUNT = 64;
		const RECIPE_COUNT = temp_RECIPE_COUNT;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
		let temp_TIME = FORM_INPUT[1].value;
		if (temp_TIME < 0) temp_TIME = 0
		const FORM = {Experience: FORM_INPUT[0].value, Time: (temp_TIME * 20), Group: FORM_INPUT[2].value, Output: FORM_INPUT[3].value};
		
		model.type = 'minecraft:' + type;
		model.ingredient = {
			"item": "minecraft:" + RECIPE_CASE
		};
		model.result = "minecraft:" + RECIPE_RESULT;
		model.experience = parseFloat(FORM.Experience);
		model.cookingtime = parseFloat(FORM.Time);
		if (FORM.Group) model.group = FORM.Group;
		else delete model['group'];
		return ({data: model, output: FORM.Output});
	}

	static generateStoneCutter(nameOfId, optionFormId, type)
	{
		let model = Models.stonecutter;
		try {
			document.getElementById(nameOfId + '-cases').children[0].id;
		} catch (e) {
			throw 'No item on recipe case';
		}
		const RECIPE_CASE = document.getElementById(nameOfId + '-cases').children[0].id;
		try {
			document.getElementById(nameOfId + '-result').children[0].id;
		} catch (e) {
			throw 'No item on result case';	
		}
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result').children[0].id;
		let temp_RECIPE_COUNT = document.getElementById(nameOfId + '-count').value;
		if (temp_RECIPE_COUNT <= 0) temp_RECIPE_COUNT = 1;
		else if (temp_RECIPE_COUNT > 64) temp_RECIPE_COUNT = 64;
		const RECIPE_COUNT = temp_RECIPE_COUNT;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
		const FORM = {Group: FORM_INPUT[0].value, Output: FORM_INPUT[1].value};
		model.type = "minecraft:" + type;
		if (FORM.Group) model.group = FORM.Group;
		else delete model['group'];
		model.ingredient.item = 'minecraft:' + RECIPE_CASE;
		model.result = 'minecraft:' + RECIPE_RESULT;
		model.count = parseInt(RECIPE_COUNT, 10);
		return ({data: model, output: FORM.Output});
	}

	static generateSmithingTable(nameOfId, optionFormId, type)
	{
		let model = Models.smithing_table;
		try {
			document.getElementById(nameOfId + '-cases-add-one').children[0].id;
		} catch (e) {
			throw 'No item on base recipe case';
		}
		const RECIPE_CASE_BASE = document.getElementById(nameOfId + '-cases-add-one').children[0].id;
		try {
			document.getElementById(nameOfId + '-cases-add-two').children[0].id;
		} catch (e) {
			throw 'No item on addition recipe case';	
		}
		const RECIPE_CASE_ADD = document.getElementById(nameOfId + '-cases-add-two').children[0].id;
		try {
			document.getElementById(nameOfId + '-result').children[0].id;
		} catch (e) {
			throw 'No item on addition recipe case';	
		}
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result').children[0].id;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
		const FORM = {Group: FORM_INPUT[0].value, Output: FORM_INPUT[1].value};
		model.type = type;
		if (FORM.Group) model.group = FORM.Group;
		else delete model['group'];
		model.base.item = 'minecraft:' + RECIPE_CASE_BASE;
		model.addition.item = 'minecraft:' + RECIPE_CASE_ADD;
		model.result.item = 'minecraft:' + RECIPE_RESULT;
		return ({data: model, output: FORM.Output});
	}

	static setEvent()
	{
		this.player();
		this.craft_table();
		this.furnace();
		this.blast_furnace();
		this.campfire();
		this.smoker();
		this.stonecutter();
		this.smithing_table();
	}
	static player()
	{
		document.getElementById('crafting_player_validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateCraftingTable_2_3('area_crafting_player', 'crafting_player_form', false);
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
	}
	static craft_table()
	{
		document.getElementById('crafting_table_validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateCraftingTable_2_3('area_crafting_table', 'crafting_table_form', true);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
			console.log(__ret);
		});
	}
	static furnace()
	{
		document.getElementById('area_furnace-validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateFurnace('area_furnace', 'area_furnace-form', 'smelting');
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
			console.log(__ret);
		});
	}
	static blast_furnace()
	{
		document.getElementById('area_blast_furnace-validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateFurnace('area_blast_furnace', 'area_blast_furnace-form', 'blasting');
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
			console.log(__ret);
		});
	}
	static campfire()
	{
		document.getElementById('area_campfire-validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateFurnace('area_campfire', 'area_campfire-form', 'campfire_cooking');
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
			console.log(__ret);
		});
	}
	static smoker()
	{
		document.getElementById('area_smoker-validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateFurnace('area_smoker', 'area_smoker-form', 'smoking');
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
			console.log(__ret);
		});
	}
	static stonecutter()
	{
		document.getElementById('area_stonecutter-validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateStoneCutter('area_stonecutter', 'area_stonecutter-form', 'stonecutting');
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
			console.log(__ret);
		});
	}
	static smithing_table()
	{
		document.getElementById('area_smithing_table-validation').addEventListener('click', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try {
				__ret = this.generateSmithingTable('area_smithing_table', 'area_smithing_table-form', 'smithing');
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
			console.log(__ret);
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

class FileManagement
{
	static check(data, nameFile)
	{
		if (!MCutilities.CheckIfStringIsLegalCharacter(nameFile))
			throw (LANG.Options.Output + ' ' + LANG.ContainIllegalCharacter);
		else if (!MCutilities.CheckIfStringIsLegalCharacter(data.group))
			throw (LANG.Options.Group + ' ' + LANG.ContainIllegalCharacter);
		else
		{
			if (fs.existsSync(path.join(RecipesDirectory, nameFile + '.json')))
			{
				IPC.send('Recipes:signal-is-exist');
				document.getElementById('ModalIsExist-Yes').addEventListener('click', () => {
					this.createFile(data, nameFile);
				});
			}
			else
				this.createFile(data, nameFile);
		}
	}
	static createFile(data, nameFile)
	{
		fs.writeFile(path.join(RecipesDirectory, nameFile + '.json'), JSON.stringify(data, null, 4), {encoding:'utf-8', flag:'w'}, (err) => {
			if (err) throw err;
			CreateAlert('success', document.getElementById('recipe-error'), LANG.FileCreationSuccess);
		});
	}
	static deleteFile(nameFile)
	{
		fs.access(path.join(RecipesDirectory, nameFile + '.json'), fs.constants.F_OK, (err) => {
			if (!err)
			{
				fs.rm(path.join(RecipesDirectory, nameFile + '.json'), {force: true}, (err) => {
					if (err) throw err;
				});
			}
		});
	}
}

module.exports = RecipeComponent;
