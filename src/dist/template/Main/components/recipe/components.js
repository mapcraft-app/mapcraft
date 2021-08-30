const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);

var LANG; UpdateLang();
function UpdateLang() { LANG = MCplugin.Lang('Recipe').Data; }

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
		Template.render(document.getElementById('content'), 'recipe.tp', null);
		this.craft_table();
		Template.updateLang(document.getElementById('content'), LANG);
	}
}

module.exports = RecipeComponent;
