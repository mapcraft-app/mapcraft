/*eslint-disable prefer-regex-literals*/
const path = require('path');
const fs = require('fs');
const { MCutilities } = require('mapcraft-api');
const IPC = require('mapcraft-api').MCipc;
const MCP = require('mapcraft-api').MCplugin;
const Temp = require('mapcraft-api').MCtemplate;
const Models = require('./model');

const MCplugin = new MCP();
const Template = new Temp(__dirname);
let IsLoadRecipe = false;
const outputRegExp = new RegExp('(?:formOutput$)', 'gm');
const checkedShapeless = new RegExp('(?:shapeless$)', 'gm');
const checkedExactPosition = new RegExp('(?:exactPosition$)', 'gm');
const Data = {
	Blocks: MCutilities.GetDataGameElement('blocks'),
	Items: MCutilities.GetDataGameElement('items'),
};
let LANG = MCplugin.Lang('Recipe').Data;
function UpdateLang()
{
	LANG = MCplugin.Lang('Recipe').Data;
}
const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const RecipesDirectory = path.join(LocalMapcraft.Data.DataPack, 'data', 'mapcraft-data', 'recipes');
if (!fs.existsSync(RecipesDirectory))
	fs.mkdirSync(RecipesDirectory, { recursive: true });

function testCase(IDofElement, error)
{
	if (!document.getElementById(IDofElement).children[0].id)
	{
		MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), error);
		throw new Error(error);
	}
}

class FillForm
{
	static main(event)
	{
		const pathFile = `${event.target.innerText}.json`;
		fs.readFile(path.join(RecipesDirectory, pathFile), { encoding: 'utf-8', flag: 'r' }, (err, data) =>
		{
			if (err)
				throw err;
			const _json = JSON.parse(data);
			document.getElementById('recipe-title').innerText = event.target.innerText;
			switch (_json.type)
			{
				case 'minecraft:crafting_shapeless':
					if (Object.prototype.hasOwnProperty.call(_json, 'isPlayer') && _json.isPlayer)
					{
						IPC.send('Recipes:signal-open-switcher', 0);
						this.craftTable(event.target.innerText, 'area_crafting_player', 'crafting_player_form', _json);
					}
					else
					{
						IPC.send('Recipes:signal-open-switcher', 1);
						this.craftTable(event.target.innerText, 'area_crafting_table', 'crafting_table_form', _json);
					}
					break;
				case 'minecraft:crafting_shaped':
					if (Object.prototype.hasOwnProperty.call(_json, 'isPlayer') && _json.isPlayer)
					{
						IPC.send('Recipes:signal-open-switcher', 0);
						this.craftTable(event.target.innerText, 'area_crafting_player', 'crafting_player_form', _json);
					}
					else
					{
						IPC.send('Recipes:signal-open-switcher', 1);
						this.craftTable(event.target.innerText, 'area_crafting_table', 'crafting_table_form', _json);
					}
					break;
				case 'minecraft:smelting':
					IPC.send('Recipes:signal-open-switcher', 2);
					this.furnace(event.target.innerText, 'area_furnace', 'area_furnace-form', _json);
					break;
				case 'minecraft:blasting':
					IPC.send('Recipes:signal-open-switcher', 3);
					this.furnace(event.target.innerText, 'area_blast_furnace', 'area_blast_furnace-form', _json);
					break;
				case 'minecraft:campfire_cooking':
					IPC.send('Recipes:signal-open-switcher', 4);
					this.furnace(event.target.innerText, 'area_campfire', 'area_campfire-form', _json);
					break;
				case 'minecraft:smoking':
					IPC.send('Recipes:signal-open-switcher', 5);
					this.furnace(event.target.innerText, 'area_smoker', 'area_smoker-form', _json);
					break;
				case 'minecraft:stonecutting':
					IPC.send('Recipes:signal-open-switcher', 6);
					this.stonecutter(event.target.innerText, 'area_stonecutter', 'area_stonecutter-form', _json);
					break;
				case 'minecraft:smithing':
					IPC.send('Recipes:signal-open-switcher', 7);
					this.smithingTable(event.target.innerText, 'area_smithing_table', 'area_smithing_table-form', _json);
					break;
				default:
					break;
			}
		});
	}

	static craftTable(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASES = document.getElementById(`${nameOfId}-cases`).querySelectorAll('div');
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`);
		const RECIPE_COUNT = document.getElementById(`${nameOfId}-count`);
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		for (const __case of RECIPE_CASES)
			if (__case.hasChildNodes())
				Template.cleanNode(__case);
		Template.cleanNode(RECIPE_RESULT);
		if (json.type === 'minecraft:crafting_shapeless')
		{
			RECIPE_FORM[0].checked = true;
			let _case = 0;
			for (const ingredient of json.ingredients)
				RECIPE_CASES[_case++].appendChild(this.getSrcImage(ingredient.item.match(/(?<=^minecraft:).*/gm)[0]));
		}
		else
		{
			RECIPE_FORM[0].checked = false;
			let _case = 0;
			let row = 0;
			let coef = 0;
			if (Object.prototype.hasOwnProperty.call(json, 'isPlayer') && json.isPlayer)
				coef = 2;
			else
				coef = 3;
			for (const line of json.pattern)
			{
				_case = row * coef;
				const items = Array.from(line);
				for (const item of items)
				{
					const key = this.getItemWithKey(json, item);
					if (key !== undefined)
						RECIPE_CASES[_case++].appendChild(this.getSrcImage(key));
					else if (item === ' ')
						++_case;
				}
				row++;
			}
		}
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_COUNT.value = json.result.count;
		if (Object.prototype.hasOwnProperty.call(json, 'exactPosition'))
			RECIPE_FORM[1].checked = json.exactPosition;
		else
			RECIPE_FORM[1].checked = false;
		if (Object.prototype.hasOwnProperty.call(json, 'group'))
			RECIPE_FORM[2].value = json.group;
		else
			RECIPE_FORM[2].value = '';
		RECIPE_FORM[3].value = nameOfFile;
	}

	static furnace(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASE = document.getElementById(`${nameOfId}-cases`).querySelectorAll('div')[0];
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`);
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		Template.cleanNode(RECIPE_CASE);
		Template.cleanNode(RECIPE_RESULT);

		RECIPE_CASE.appendChild(this.getSrcImage(json.ingredient.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_FORM[0].value = json.experience;
		RECIPE_FORM[1].value = json.cookingtime / 20;
		if (Object.prototype.hasOwnProperty.call(json, 'group'))
			RECIPE_FORM[2].value = json.group;
		else
			RECIPE_FORM[2].value = '';
		RECIPE_FORM[3].value = nameOfFile;
	}

	static stonecutter(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASE = document.getElementById(`${nameOfId}-cases`);
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`);
		const RECIPE_COUNT = document.getElementById(`${nameOfId}-count`);
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		Template.cleanNode(RECIPE_CASE);
		Template.cleanNode(RECIPE_RESULT);

		RECIPE_CASE.appendChild(this.getSrcImage(json.ingredient.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_COUNT.value = json.count;
		if (Object.prototype.hasOwnProperty.call(json, 'group'))
			RECIPE_FORM[0].value = json.group;
		else
			RECIPE_FORM[0].value = '';
		RECIPE_FORM[1].value = nameOfFile;
	}

	static smithingTable(nameOfFile, nameOfId, optionFormId, json)
	{
		const RECIPE_CASE_ADD_ONE = document.getElementById(`${nameOfId}-cases-add-one`);
		const RECIPE_CASE_ADD_TWO = document.getElementById(`${nameOfId}-cases-add-two`);
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`);
		const RECIPE_FORM = document.getElementById(optionFormId).elements;
		Template.cleanNode(RECIPE_CASE_ADD_ONE);
		Template.cleanNode(RECIPE_CASE_ADD_TWO);
		Template.cleanNode(RECIPE_RESULT);

		RECIPE_CASE_ADD_ONE.appendChild(this.getSrcImage(json.base.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_CASE_ADD_TWO.appendChild(this.getSrcImage(json.addition.item.match(/(?<=^minecraft:).*/gm)[0]));
		RECIPE_RESULT.appendChild(this.getSrcImage(json.result.item.match(/(?<=^minecraft:).*/gm)[0]));
		if (Object.prototype.hasOwnProperty.call(json, 'group'))
			RECIPE_FORM[0].value = json.group;
		else
			RECIPE_FORM[0].value = '';
		RECIPE_FORM[1].value = nameOfFile;
	}

	static getItemWithKey(json, _key)
	{
		for (const element in json.key)
			if (element === _key)
				return (json.key[_key].item.match(/(?<=^minecraft:).*/gm)[0]);
		return (undefined);
	}

	static getSrcImage(item)
	{
		const image = document.createElement('img'); image.id = item;
		const testBlockPath = path.join(__dirname, '../../../../img/assets/block', item);
		const testItemPath = path.join(__dirname, '../../../../img/assets/item', item);
		if (fs.existsSync(`${testBlockPath}.png`))
		{
			image.src = `${testBlockPath}.png`;
			image.classList.add('debug_block');
		}
		else if (fs.existsSync(`${testBlockPath}.webp`))
		{
			image.src = `${testBlockPath}.webp`;
			image.classList.add('debug_block');
		}
		else if (fs.existsSync(`${testItemPath}.png`))
		{
			image.src = `${testItemPath}.png`;
			image.classList.add('craft_fire_and_cross');
		}
		else
		{
			image.src = `${testItemPath}.webp`;
			image.classList.add('craft_fire_and_cross');
		}
		return (image);
	}
}

class RecipeComponent
{
	static craftTable()
	{
		Template.render(document.getElementById('crafting_player'), 'craft_player.tp', { ID: 'area_crafting_player' });
		Template.render(document.getElementById('crafting_table'), 'craft_table.tp', { ID: 'area_crafting_table' });
		Template.render(document.getElementById('stonecutter'), 'stonecutter.tp', { ID: 'area_stonecutter' });
		Template.render(document.getElementById('smithing_table'), 'smithing_table.tp', { ID: 'area_smithing_table' });

		const Furnace = Template.getRaw('furnace.tp');
		Template.renderRaw(document.getElementById('furnace'), Template.parseRaw(Furnace, { ID: 'area_furnace' }), 'furnace.tp', null);
		Template.renderRaw(document.getElementById('blast_furnace'), Template.parseRaw(Furnace, { ID: 'area_blast_furnace' }), 'blast_furnace.tp', null);
		Template.renderRaw(document.getElementById('campfire'), Template.parseRaw(Furnace, { ID: 'area_campfire' }), 'campfire.tp', null);
		Template.renderRaw(document.getElementById('smoker'), Template.parseRaw(Furnace, { ID: 'area_smoker' }), 'smoker.tp', null);
	}

	static recipeList()
	{
		const createAccordion = (group) =>
		{
			const newAccordion = document.createElement('li');
			const mainA = document.createElement('a');
			mainA.classList.add('uk-accordion-title');
			mainA.href = '#';
			mainA.innerText = group;

			const mainDiv = document.createElement('div');
			mainDiv.classList.add('uk-accordion-content');
			const UL = document.createElement('ul');
			UL.classList.add('uk-list', 'uk-list-square', 'list-ul');
			UL.id = `${group}-list`;
			mainDiv.appendChild(UL);
			newAccordion.appendChild(mainA); newAccordion.appendChild(mainDiv);
			document.getElementById('sound-list').appendChild(newAccordion);
		};
		Template.cleanNode(document.getElementById('sound-list'));
		createAccordion('default');
		fs.readdir(RecipesDirectory, { encoding: 'utf-8', withFileTypes: false }, (err, files) =>
		{
			if (err)
				throw err;
			for (const file of files)
				if (path.extname(file) === '.json')
					fs.readFile(path.join(RecipesDirectory, file), { encoding: 'utf-8', flag: 'r' }, (err2, data) =>
					{
						if (err2)
							throw err2;
						const _json = JSON.parse(data);
						if (!document.getElementById(`${_json.group}-list`) && Object.prototype.hasOwnProperty.call(_json, 'group'))
							createAccordion(_json.group);
						const newItem = document.createElement('li');
						newItem.innerText = path.basename(file, '.json');
						if (Object.prototype.hasOwnProperty.call(_json, 'group'))
							document.getElementById(`${_json.group}-list`).appendChild(newItem);
						else
							document.getElementById('default-list').appendChild(newItem);
						newItem.addEventListener('click', (event) =>
						{
							sessionStorage.setItem('recipe-selected', file);
							IsLoadRecipe = true;
							FillForm.main(event);
						});
					});
		});
	}

	static main()
	{
		UpdateLang();
		Template.render(document.getElementById('content'), 'recipe.tp', { Search: LANG.Options.Search });
		const _generateList = new GenerateList(); // eslint-disable-line
		document.getElementById('recipe-title').innerText = 'crafting_recipe';
		this.craftTable();
		this.recipeList();
		this.UpdateEvent();
		this.CleanIfTabChange();
		Template.updateLang(document.getElementById('content'), LANG);
		CreateRecipe.setEvent(); // eslint-disable-line
	}

	static UpdateEvent()
	{
		document.querySelectorAll('ul[id="recipe-switcher"] > li').forEach((element) =>
		{
			if (element.classList.contains('uk-active'))
			{
				let _checkboxExact;
				let _checkboxShapeless;
				element.querySelectorAll('input').forEach((_input) =>
				{
					if (checkedShapeless.test(_input.id))
						_checkboxShapeless = _input;
					else if (checkedExactPosition.test(_input.id))
						_checkboxExact = _input;
					if (outputRegExp.test(_input.id))
						_input.addEventListener('input', (event) =>
						{
							document.getElementById('recipe-title').innerText = event.target.value;
						});
					else
						_input.removeEventListener('input', () =>
						{});
				});
				if (_checkboxShapeless)
					_checkboxShapeless.addEventListener('input', (event) =>
					{
						if (event.target.checked)
							_checkboxExact.checked = false;
					});
				if (_checkboxExact)
					_checkboxExact.addEventListener('input', (event) =>
					{
						if (event.target.checked)
							_checkboxShapeless.checked = false;
					});
			}
		});
	}

	static CleanIfTabChange(bypass = false)
	{
		const _function = () =>
		{
			document.getElementById('recipe-title').innerText = 'crafting_recipe';
			document.querySelectorAll('div[class="case"]').forEach((_case) =>
			{
				Template.cleanNode(_case);
			});
			document.querySelectorAll('input').forEach((input) =>
			{
				const newInput = input;
				if (newInput.type === 'number')
					newInput.value = newInput.min;
				else if (newInput.type === 'checkbox')
					newInput.checked = false;
				else if (outputRegExp.test(newInput.id))
					newInput.value = 'crafting_recipe';
				else
					newInput.value = '';
			});
		};
		if (bypass === true)
			_function();
		else
			document.getElementById('recipe-switcher').addEventListener('beforehide', () =>
			{
				if (!IsLoadRecipe)
					_function();
				IsLoadRecipe = false;
			});
		document.getElementById('recipe-switcher').addEventListener('show', () =>
		{
			this.UpdateEvent();
		});
	}
}

class FileManagement
{
	static check(data, nameFile)
	{
		if (!MCutilities.CheckIfStringIsLegalCharacter(nameFile))
		{
			throw new Error(`${LANG.Options.Output} ${LANG.ContainIllegalCharacter}`);
		}
		else if (!MCutilities.CheckIfStringIsLegalCharacter(data.group))
		{
			throw new Error(`${LANG.Options.Group} ${LANG.ContainIllegalCharacter}`);
		}
		else if (fs.existsSync(path.join(RecipesDirectory, `${nameFile}.json`)))
		{
			IPC.send('Recipes:signal-is-exist');
			document.getElementById('ModalIsExist-Yes').addEventListener('click', () =>
			{
				this.createFile(data, nameFile);
			});
		}
		else
		{
			this.createFile(data, nameFile);
		}
	}

	static createFile(data, nameFile)
	{
		fs.writeFile(path.join(RecipesDirectory, `${nameFile}.json`), JSON.stringify(data, null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
		{
			if (err)
				throw new Error(err);
			MCutilities.CreateAlert('success', document.getElementById('recipe-error'), LANG.FileCreationSuccess);
			RecipeComponent.recipeList();
		});
	}

	static deleteFile(nameFile)
	{
		fs.access(path.join(RecipesDirectory, nameFile), fs.constants.F_OK, (err) =>
		{
			if (err)
				return;
			fs.rm(path.join(RecipesDirectory, nameFile), { force: true }, (err2) =>
			{
				if (err2)
					throw new Error(err2);
				RecipeComponent.recipeList();
				RecipeComponent.CleanIfTabChange(true);
			});
		});
	}
}

class CreateRecipe
{
	static generateCraftingTableTwoThree(nameOfId, optionFormId, is3x3 = false)
	{
		const model = Models.crafting_player;
		const RECIPE_CASES = document.getElementById(`${nameOfId}-cases`);
		const caseCount = (is3x3) ? 9 : 4;
		let caseX = 0;
		const checkEmptyCases = RECIPE_CASES.querySelectorAll('div');
		for (const _case of checkEmptyCases)
			if (!_case.hasChildNodes())
				++caseX;
		if (caseX === caseCount)
			throw new Error('No item on recipe cases');
		testCase(`${nameOfId}-result`, 'No item on result case');
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`).querySelectorAll('img')[0].id;
		let TEMP_RECIPE_COUNT = document.getElementById(`${nameOfId}-count`).value;
		if (TEMP_RECIPE_COUNT <= 0)
			TEMP_RECIPE_COUNT = 1;
		else if (TEMP_RECIPE_COUNT > 64)
			TEMP_RECIPE_COUNT = 64;
		const RECIPE_COUNT = TEMP_RECIPE_COUNT;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
		const FORM = { Shapeless: FORM_INPUT[0].checked, ExactPosition: FORM_INPUT[1].checked, Group: FORM_INPUT[2].value, Output: FORM_INPUT[3].value };

		if (FORM.Group)
			model.group = FORM.Group;
		else
			delete model.group;
		if (FORM.Shapeless)
		{
			model.type = 'minecraft:crafting_shapeless';
			delete model.pattern;
			delete model.key;
			const ingredients = [];
			const ITEMS = RECIPE_CASES.querySelectorAll('img');
			for (const item of ITEMS)
				ingredients.push({ item: `minecraft:${item.id}` });
			model.ingredients = ingredients;
		}
		else
		{
			model.type = 'minecraft:crafting_shaped';
			delete model.ingredients;
			let alpha = 'A';
			const jsonKey = {};
			const jsonPattern = [];
			const ItemList = [];
			const ItemKey = [];
			let patternTemp;
			let rowMAX;
			let colMAX;
			if (!is3x3)
			{
				rowMAX = 1;
				colMAX = 1;
				patternTemp = [
					['', ''],
					['', ''],
				];
			}
			else
			{
				rowMAX = 2;
				colMAX = 2;
				patternTemp = [
					['', '', ''],
					['', '', ''],
					['', '', ''],
				];
			}
			const ITEMS = RECIPE_CASES.querySelectorAll('div');
			//#region Fill patternTemp
			let row = 0; let col = 0;
			for (const item of ITEMS)
			{
				if (!item.hasChildNodes())
					patternTemp[row][col] = ' ';
				else
					patternTemp[row][col] = item.children[0].id;
				col++;
				if (col > colMAX)
				{
					row++;
					col = 0;
				}
				if (row > rowMAX)
					break;
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
				if (col > colMAX)
				{
					row++;
					col = 0;
				}
			}
			//#endregion
			//#region Key(s)
			let z = 0;
			const Length = ItemList.length;
			while (z < Length)
			{
				if (ItemList[z] !== ' ')
					jsonKey[ItemKey[z]] = { item: `minecraft:${ItemList[z]}` };
				z++;
			}
			model.key = jsonKey;
			//#endregion
			//#region Pattern
			row = 0; col = 0;
			while (row <= rowMAX)
			{
				const index = ItemList.indexOf(patternTemp[row][col]);
				if (ItemList[index] !== ' ')
					patternTemp[row][col] = ItemKey[index];
				else
					patternTemp[row][col] = ' ';
				col++;
				if (col > colMAX)
				{
					row++;
					col = 0;
				}
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
						if (patternTemp[row][col] !== ' ')
						{
							test = true;
							break;
						}
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
						if (patternTemp[row][col] !== ' ')
						{
							test = true;
							break;
						}
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
			for (const _row of patternTemp)
				jsonPattern.push(_row.join(''));
			model.pattern = jsonPattern;
			//#endregion
		}
		model.result.item = `minecraft:${RECIPE_RESULT}`;
		model.result.count = parseInt(RECIPE_COUNT, 10);
		model.isPlayer = !(is3x3);
		model.exactPosition = !(!FORM.ExactPosition);
		return ({ data: model, output: FORM.Output });
	}

	static generateFurnace(nameOfId, optionFormId, type)
	{
		const model = Models.furnace;
		testCase(`${nameOfId}-cases`, 'No item on recipe case');
		const RECIPE_CASE = document.getElementById(`${nameOfId}-cases`).querySelectorAll('img')[0].id;
		testCase(`${nameOfId}-result`, 'No item on result case');
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`).querySelectorAll('img')[0].id;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
		let TEMP_TIME = FORM_INPUT[1].value;
		if (TEMP_TIME < 0)
			TEMP_TIME = 0;
		const FORM = { Experience: FORM_INPUT[0].value, Time: (TEMP_TIME * 20), Group: FORM_INPUT[2].value, Output: FORM_INPUT[3].value };

		model.type = `minecraft:${type}`;
		model.ingredient = { item: `minecraft:${RECIPE_CASE}` };
		model.result = `minecraft:${RECIPE_RESULT}`;
		model.experience = parseFloat(FORM.Experience);
		model.cookingtime = parseFloat(FORM.Time);
		if (FORM.Group)
			model.group = FORM.Group;
		else
			delete model.group;
		return ({ data: model, output: FORM.Output });
	}

	static generateStoneCutter(nameOfId, optionFormId, type)
	{
		const model = Models.stonecutter;
		testCase(`${nameOfId}-cases`, 'No item on recipe case');
		const RECIPE_CASE = document.getElementById(`${nameOfId}-cases`).children[0].id;
		testCase(`${nameOfId}-result`, 'No item on result case');
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`).children[0].id;
		let TEMP_RECIPE_COUNT = document.getElementById(`${nameOfId}-count`).value;
		if (TEMP_RECIPE_COUNT <= 0)
			TEMP_RECIPE_COUNT = 1;
		else if (TEMP_RECIPE_COUNT > 64)
			TEMP_RECIPE_COUNT = 64;
		const RECIPE_COUNT = TEMP_RECIPE_COUNT;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
		const FORM = { Group: FORM_INPUT[0].value, Output: FORM_INPUT[1].value };
		model.type = `minecraft:${type}`;
		if (FORM.Group)
			model.group = FORM.Group;
		else
			delete model.group;
		model.ingredient.item = `minecraft:${RECIPE_CASE}`;
		model.result = `minecraft:${RECIPE_RESULT}`;
		model.count = parseInt(RECIPE_COUNT, 10);
		return ({ data: model, output: FORM.Output });
	}

	static generateSmithingTable(nameOfId, optionFormId, type)
	{
		const model = Models.smithing_table;
		testCase(`${nameOfId}-cases-add-one`, 'No item on base recipe case');
		const RECIPE_CASE_BASE = document.getElementById(`${nameOfId}-cases-add-one`).children[0].id;
		testCase(`${nameOfId}-cases-add-two`, 'No item on addition recipe case');
		const RECIPE_CASE_ADD = document.getElementById(`${nameOfId}-cases-add-two`).children[0].id;
		testCase(`${nameOfId}-result`, 'No item on addition recipe case');
		const RECIPE_RESULT = document.getElementById(`${nameOfId}-result`).children[0].id;
		const FORM_INPUT = document.getElementById(optionFormId).elements;
		const FORM = { Group: FORM_INPUT[0].value, Output: FORM_INPUT[1].value };
		model.type = `minecraft:${type}`;
		if (FORM.Group)
			model.group = FORM.Group;
		else
			delete model.group;
		model.base.item = `minecraft:${RECIPE_CASE_BASE}`;
		model.addition.item = `minecraft:${RECIPE_CASE_ADD}`;
		model.result.item = `minecraft:${RECIPE_RESULT}`;
		return ({ data: model, output: FORM.Output });
	}

	static setEvent()
	{
		this.player();
		this.craftTable();
		this.furnace();
		this.blastFurnace();
		this.campfire();
		this.smoker();
		this.stonecutter();
		this.smithingTable();
	}

	static player()
	{
		document.getElementById('crafting_player_validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateCraftingTableTwoThree('area_crafting_player', 'crafting_player_form', false);
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('crafting_player_delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}

	static craftTable()
	{
		document.getElementById('crafting_table_validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateCraftingTableTwoThree('area_crafting_table', 'crafting_table_form', true);
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('crafting_table_delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}

	static furnace()
	{
		document.getElementById('area_furnace-validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateFurnace('area_furnace', 'area_furnace-form', 'smelting');
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('area_furnace-delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}

	static blastFurnace()
	{
		document.getElementById('area_blast_furnace-validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateFurnace('area_blast_furnace', 'area_blast_furnace-form', 'blasting');
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('area_blast_furnace-delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}

	static campfire()
	{
		document.getElementById('area_campfire-validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateFurnace('area_campfire', 'area_campfire-form', 'campfire_cooking');
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('area_campfire-delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}

	static smoker()
	{
		document.getElementById('area_smoker-validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateFurnace('area_smoker', 'area_smoker-form', 'smoking');
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('area_smoker-delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}

	static stonecutter()
	{
		document.getElementById('area_stonecutter-validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateStoneCutter('area_stonecutter', 'area_stonecutter-form', 'stonecutting');
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('area_stonecutter-delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}

	static smithingTable()
	{
		document.getElementById('area_smithing_table-validation').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			let __ret;
			try
			{
				__ret = this.generateSmithingTable('area_smithing_table', 'area_smithing_table-form', 'smithing');
				FileManagement.check(__ret.data, __ret.output);
			}
			catch (__error)
			{
				MCutilities.CreateAlert('warning', document.getElementById('recipe-error'), __error);
			}
		});
		document.getElementById('area_smithing_table-delete').addEventListener('click', (event) =>
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			if (sessionStorage.getItem('recipe-selected'))
				FileManagement.deleteFile(sessionStorage.getItem('recipe-selected'));
		});
	}
}

class GenerateList
{
	constructor()
	{
		this._generateListBlock();
		this._generateListItem();
		document.getElementById('blocks-search').addEventListener('input', (event) =>
		{
			event.preventDefault(); event.stopImmediatePropagation();
			this._searchInList(event.target, document.getElementById('blocks-list'), document.getElementById('error-blocks-list'));
		});
		document.getElementById('items-search').addEventListener('input', (event) =>
		{
			event.preventDefault(); event.stopImmediatePropagation();
			this._searchInList(event.target, document.getElementById('items-list'), document.getElementById('error-items-list'));
		});
	}

	_generateListBlock()
	{
		const list = document.getElementById('blocks-list');
		const jsonData = Data.Blocks;
		Template.cleanNode(list);
		const trash = document.createElement('img'); trash.src = path.join(__dirname, '../../../../img/assets/trash.png'); trash.id = 'trash';
		trash.setAttribute('uk-tooltip', `title:${LANG.Options.DeleteCase}; pos: right`);
		list.appendChild(trash);
		for (const id of jsonData)
		{
			const image = document.createElement('img');
			const testpath = path.join(__dirname, '../../../../img/assets/block', `${id.name}.png`);
			if (fs.existsSync(testpath))
				image.src = testpath;
			else
				image.src = path.join(__dirname, '../../../../img/assets/block', `${id.name}.webp`);
			image.id = id.name;
			image.setAttribute('uk-tooltip', `title:${id.name}; pos:right`);
			list.appendChild(image);
		}
	}

	_generateListItem()
	{
		const list = document.getElementById('items-list');
		const jsonData = Data.Items;
		Template.cleanNode(list);
		const trash = document.createElement('img'); trash.src = path.join(__dirname, '../../../../img/assets/trash.png'); trash.id = 'trash';
		trash.setAttribute('uk-tooltip', `title:${LANG.Options.DeleteCase}; pos: right`);
		for (const id of jsonData)
		{
			const image = document.createElement('img');
			const testpath = path.join(__dirname, '../../../../img/assets/item', `${id.name}.png`);
			if (fs.existsSync(testpath))
				image.src = testpath;
			else
				image.src = path.join(__dirname, '../../../../img/assets/item', `${id.name}.webp`);
			image.id = id.name;
			image.setAttribute('uk-tooltip', `title:${id.name}; pos:right`);
			list.appendChild(image);
		}
	}

	_searchInList(input, list, error)
	{
		const newError = error;
		const imgs = list.getElementsByTagName('img');
		let isExist = false;
		const regex = new RegExp(input.value);
		if (!input.value)
		{
			newError.style.display = 'none';
			for (const i of imgs)
				i.style.removeProperty('display');
		}
		else
		{
			for (const i of imgs)
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
}

module.exports = RecipeComponent;
