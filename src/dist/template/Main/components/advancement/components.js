const path = require('path');
const IPC = require('../../../../js/MCipc');
const MCP = require('../../../../js/MCplugin');
const MCworkInProgress = require('../../../../js/MCworkInProgress');
const MCutilities = require('../../../../js/MCutilities');
const Temp = require('../../../../js/MCtemplate');

const MCplugin = new MCP();
const Template = new Temp(__dirname);
const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
let LANG = MCplugin.Lang('Advancement');
function UpdateLang()
{
	LANG = MCplugin.Lang('Advancement');
}

class Advancement
{
	static draw()
	{
		Template.render(document.getElementById('content'), 'advancement.tp', null);
	}
}

module.exports = Advancement;
