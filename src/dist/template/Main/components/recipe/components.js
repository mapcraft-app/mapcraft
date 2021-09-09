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
let IsLoadRecipe = false;
const outputRegExp = new RegExp('(?:formOutput$)', 'gm');
const checkedShapeless = new RegExp('(?:shapeless$)', 'gm');
const checkedExactPosition = new RegExp('(?:exactPosition$)', 'gm');

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
			let UL = document.createElement('ul'); UL.classList.add('uk-list', 'uk-list-square', 'list-ul'); UL.id = group + "-list";
			main_div.appendChild(UL);
			newAccordion.appendChild(main_a); newAccordion.appendChild(main_div);
			document.getElementById('sound-list').appendChild(newAccordion);
		};
		Template.cleanNode(document.getElementById('sound-list'));
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
							IsLoadRecipe = true;
							FillForm.main(event);
						});
					});
				}
			}
		});
	}

	static draw()
	{
		UpdateLang();
		Template.render(document.getElementById('content'), 'recipe.tp', { Search: LANG.Options.Search });
		const _generateList = new GenerateList();
		document.getElementById('recipe-title').innerText = 'crafting_recipe';
		this.craft_table();
		this.recipe_list();
		this.UpdateEvent();
		this.CleanIfTabChange();
		Template.updateLang(document.getElementById('content'), LANG);
		CreateRecipe.setEvent();
	}

	static UpdateEvent()
	{
		document.querySelectorAll('ul[id="recipe-switcher"] > li').forEach(element => {
			if (element.classList.contains('uk-active'))
			{
				let _checkboxExact, _checkboxShapeless;
				element.querySelectorAll('input').forEach(_input => {
					if (checkedShapeless.test(_input.id))
						_checkboxShapeless = _input;
					else if (checkedExactPosition.test(_input.id))
						_checkboxExact = _input;
					if (outputRegExp.test(_input.id))
					{
						_input.addEventListener('input', (event) => {
							document.getElementById('recipe-title').innerText = event.target.value;
						});
					}
					else
						_input.removeEventListener('input', () => {;});
				});
				_checkboxShapeless.addEventListener('input', (event) => {
					if (event.target.checked)
						_checkboxExact.checked = false;
				});
				_checkboxExact.addEventListener('input', (event) => {
					if (event.target.checked)
						_checkboxShapeless.checked = false;
				});
			}
		});
	}

	static CleanIfTabChange()
	{
		document.getElementById('recipe-switcher').addEventListener('beforehide', () => {
			if (!IsLoadRecipe)
			{
				document.getElementById('recipe-title').innerText = 'crafting_recipe';
				document.querySelectorAll('div[class="case"]').forEach((_case) => {
					Template.cleanNode(_case);
				});
				document.querySelectorAll('input').forEach((input) => {
					if (input.type === 'number')
						input.value = input.min;
					else if (input.type === 'checkbox')
						input.checked = false;
					else
					{
						if (outputRegExp.test(input.id)) input.value = 'crafting_recipe';
						else input.value = '';
					}
				});
			}
			IsLoadRecipe = false;
		});
		document.getElementById('recipe-switcher').addEventListener('show', () => {
			this.UpdateEvent();
		});
	}
}

class FillForm
{
	static main(event)
	{
		const pathFile = event.target.innerText + '.json';
		fs.readFile(path.join(RecipesDirectory, pathFile), {encoding: 'utf-8', flag: 'r'}, (err, data) => {
			if (err) throw err;
			let _json = JSON.parse(data);
			document.getElementById('recipe-title').innerText = event.target.innerText;
			switch (_json.type)
			{
				case 'minecraft:crafting_shapeless':
					if (_json.hasOwnProperty('isPlayer') && _json.isPlayer)
					{
						IPC.send('Recipes:signal-open-switcher', 0);
						this.craftTable(event.target.innerText, 'area_crafting_player', 'crafting_player_form', _json);
					}
					else
					{
						IPC.send('Recipes:signal-open-switcher', 1);
						this.craftTable(event.target.innerText, 'area_crafting_table', 'crafting_table_form', _json);
					}
				break ;
				case 'minecraft:crafting_shaped' :
					if (_json.hasOwnProperty('isPlayer') && _json.isPlayer)
					{
						IPC.send('Recipes:signal-open-switcher', 0);
						this.craftTable(event.target.innerText, 'area_crafting_player', 'crafting_player_form', _json);
					}
					else
					{
						IPC.send('Recipes:signal-open-switcher', 1);
						this.craftTable(event.target.innerText, 'area_crafting_table', 'crafting_table_form', _json);
					}
				break ;
				case 'minecraft:smelting' :
					IPC.send('Recipes:signal-open-switcher', 2);
					this.furnace(event.target.innerText, 'area_furnace', 'area_furnace-form', _json);
				break ;
				case 'minecraft:blasting' :
					IPC.send('Recipes:signal-open-switcher', 3);
					this.furnace(event.target.innerText, 'area_blast_furnace', 'area_blast_furnace-form', _json);
				break ;
				case 'minecraft:campfire_cooking' :
					IPC.send('Recipes:signal-open-switcher', 4);
					this.furnace(event.target.innerText, 'area_campfire', 'area_campfire-form', _json);
				break ;
				case 'minecraft:smoking' :
					IPC.send('Recipes:signal-open-switcher', 5);
					this.furnace(event.target.innerText, 'area_smoker', 'area_smoker-form', _json);
				break ;
				case 'minecraft:stonecutting' :
					IPC.send('Recipes:signal-open-switcher', 6);
					this.stonecutter(event.target.innerText, 'area_stonecutter', 'area_stonecutter-form', _json);
				break ;
				case 'minecraft:smithing' :
					IPC.send('Recipes:signal-open-switcher', 7);
					this.smithing_table(event.target.innerText, 'area_smithing_table', 'area_smithing_table-form', _json);
				break ;
			}
		});
	}

	static craftTable(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASES = document.getElementById(nameOfId + '-cases').querySelectorAll('div');
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result');
		const RECIPE_COUNT = document.getElementById(nameOfId + '-count');
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		for (let __case of RECIPE_CASES)
		{
			if (__case.hasChildNodes())
				Template.cleanNode(__case);
		}
		Template.cleanNode(RECIPE_RESULT);
		if (json.type === 'minecraft:crafting_shapeless')
		{
			RECIPE_FORM[0].checked = true;
			let _case = 0;
			for (let ingredient of json.ingredients)
				RECIPE_CASES[_case++].appendChild(this.getSrcImage(ingredient.item.match(/(?<=^minecraft:).*/gm)[0]));
		}
		else
		{
			RECIPE_FORM[0].checked = false;
			let _case = 0, row = 0, coef;
			if (json.hasOwnProperty('isPlayer') && json.isPlayer) coef = 2;
			else coef = 3;
			for (let line of json.pattern)
			{
				_case = row * coef;
				let items = Array.from(line);
				for (let item of items)
				{
					let key = this.getItemWithKey(json, item);
					if (key != undefined)
						RECIPE_CASES[_case++].appendChild(this.getSrcImage(key));
					else if (item === ' ') ++_case;
				}
				row++;
			}
		}
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_COUNT.value = json.result.count;

		if (json.hasOwnProperty('exactPosition')) RECIPE_FORM[1].checked = json.exactPosition;
		else RECIPE_FORM[1].checked = false;
		if (json.hasOwnProperty('group')) RECIPE_FORM[2].value = json.group;
		else RECIPE_FORM[2].value = '';
		RECIPE_FORM[3].value = nameOfFile;
	}

	static furnace(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASE = document.getElementById(nameOfId + '-cases').querySelectorAll('div')[0];
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result');
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		Template.cleanNode(RECIPE_CASE);
		Template.cleanNode(RECIPE_RESULT);

		RECIPE_CASE.appendChild(this.getSrcImage(json.ingredient.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_FORM[0].value = json.experience;
		RECIPE_FORM[1].value = json.cookingtime / 20;
		if (json.hasOwnProperty('group')) RECIPE_FORM[2].value = json.group;
		else RECIPE_FORM[2].value = '';
		RECIPE_FORM[3].value = nameOfFile;
	}

	static stonecutter(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASE = document.getElementById(nameOfId + '-cases');
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result');
		const RECIPE_COUNT = document.getElementById(nameOfId + '-count');
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		Template.cleanNode(RECIPE_CASE);
		Template.cleanNode(RECIPE_RESULT);

		RECIPE_CASE.appendChild(this.getSrcImage(json.ingredient.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_COUNT.value = json.count;
		if (json.hasOwnProperty('group')) RECIPE_FORM[0].value = json.group;
		else RECIPE_FORM[0].value = '';
		RECIPE_FORM[1].value = nameOfFile;
	}

	static smithing_table(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASE_ADD_ONE = document.getElementById(nameOfId + '-cases-add-one');
		const RECIPE_CASE_ADD_TWO = document.getElementById(nameOfId + '-cases-add-two');
		const RECIPE_RESULT = document.getElementById(nameOfId + '-result');
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		Template.cleanNode(RECIPE_CASE_ADD_ONE);
		Template.cleanNode(RECIPE_CASE_ADD_TWO);
		Template.cleanNode(RECIPE_RESULT);

		RECIPE_CASE_ADD_ONE.appendChild(this.getSrcImage(json.base.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_CASE_ADD_TWO.appendChild(this.getSrcImage(json.addition.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.item.match(/(?<=^minecraft:).*/gm)[0]));
		if (json.hasOwnProperty('group')) RECIPE_FORM[0].value = json.group;
		else RECIPE_FORM[0].value = '';
		RECIPE_FORM[1].value = nameOfFile;
	}

	static getItemWithKey(json, _key)
	{
		for (let element in json.key)
		{
			if (element === _key)
				return (json.key[_key].item.match(/(?<=^minecraft:).*/gm)[0]);
		}
		return (undefined);
	}

	static getSrcImage(item)
	{
		let image = document.createElement('img'); image.id = item;
		let testBlockPath = path.join(__dirname, '../../../../img/assets/block', item);
		let testItemPath = path.join(__dirname, '../../../../img/assets/item', item);
		if (fs.existsSync(testBlockPath + '.png'))
		{ image.src = testBlockPath + '.png'; image.classList.add('debug_block'); }
		else if (fs.existsSync(testBlockPath + '.webp'))
		{ image.src = testBlockPath + '.webp'; image.classList.add('debug_block'); }
		else if (fs.existsSync(testItemPath + '.png'))
		{ image.src = testItemPath + '.png'; image.classList.add('craft_fire_and_cross'); }
		else
		{ image.src = testItemPath + '.webp'; image.classList.add('craft_fire_and_cross'); }
		return (image);
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
					alpha = MCutilities.GetNextCharacterInAlphabet(alpha);
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
		model.isPlayer = (is3x3) ? false : true;
		model.exactPosition = (!FORM.ExactPosition) ? false : true;
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
		model.type = 'minecraft:' + type;
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
		model.type = 'minecraft:' + type;
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
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
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
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
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
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
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
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
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
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
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
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
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
				FileManagement.check(__ret.data, __ret.output);
			} catch (__error) {
				CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
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
			RecipeComponent.recipe_list();
		});
	}
	static deleteFile(nameFile)
	{
		fs.access(path.join(RecipesDirectory, nameFile + '.json'), fs.constants.F_OK, (err) => {
			if (!err)
			{
				fs.rm(path.join(RecipesDirectory, nameFile + '.json'), {force: true}, (err) => {
					if (err) throw err;
					RecipeComponent.recipe_list();
				});
			}
		});
	}
}

module.exports = RecipeComponent;
