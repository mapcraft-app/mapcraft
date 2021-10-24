const path = require('path');
const { MCplugin, MCipc, MCworkInProgress, MCutilities, MCtemplate } = require('mapcraft-api');
const Model = require('./model');

const _MCplugin = new MCplugin();
const Template = new MCtemplate(__dirname);
const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
let LANG = _MCplugin.Lang('Advancement');
function UpdateLang()
{
	LANG = _MCplugin.Lang('Advancement');
}

class Advancement
{
	static draw()
	{
		Template.render(document.getElementById('content'), 'advancement.tp', null);
	}
}

module.exports = Advancement;
