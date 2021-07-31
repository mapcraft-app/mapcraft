const fs = require('fs');
const path = require('path');
const MC = require('../../js/Mapcraft');
const Temp = require('../../js/MCtemplate'), Template = new Temp(__dirname);

function GetLang()
{
	let data;
	try { data = JSON.parse(fs.readFileSync(path.join(__dirname, './lang', MC.GetConfig().Env.Lang + '.json'))) }
	catch (err) { throw err }
	return (data);
}; let LANG = GetLang();

class Component
{	
	/* Component */
	static getLang() { return LANG = GetLang(); }
	static main()
	{
		Template.render(document.body, 'main.tp', null);
	}
	static draw()
	{
		LANG = GetLang();
		this.main();
		Template.updateLang(document.body, LANG);
	}
}

module.exports = Component;
