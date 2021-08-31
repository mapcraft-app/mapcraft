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
			const RECIPE_CASES = document.getElementById('area_crafting_player-cases');
			const RECIPE_RESULT = document.getElementById('area_crafting_player-result');

			const FORM = document.getElementById('crafting_player_form').elements;
			for (let input of FORM)
				console.log(input.value);
		});
	}
}

class GenerateList
{
	constructor()
	{
		this._generateList();
	}
	_generateList()
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

		list = document.getElementById('items-list');
		jsonData = JSON.parse(fs.readFileSync(path.join(Data.Items), 'utf-8'));
		Template.cleanNode(list);
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
}

module.exports = RecipeComponent;
