const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const MC = require('../../js/Mapcraft');
const Temp = require('../../js/MCtemplate');
const Template = new Temp(__dirname);
const Database = require('better-sqlite3');

function GetLang()
{
	let data;
	try { data = JSON.parse(fs.readFileSync(path.join(__dirname, './lang', MC.GetConfig().Env.Lang + '.json'))) }
	catch (err) { throw err }
	return (data);
}; let LANG = GetLang();

class MainComponent
{	
	static main()
	{
		Template.render(document.body, 'main.tp', null);
	}
	static tab()
	{
		let HTML = '';
		let isUsers = false;
		let Component = Template.getRaw('table.tp');
		let Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		if (!Mapcraft.DBPath)
		{
			app.relaunch()
			app.quit();
		}
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		let sql = db.prepare('SELECT Username, UUID FROM User');
		for (let user of sql.iterate())
		{
			isUsers = true;
			HTML += Template.parseRaw(Component, {link: 'https://crafatar.com/avatars/'+ user.UUID +'?size=40' , username: user.Username});
		}
		if (!isUsers)
			Template.renderRaw(document.getElementById('generateTab'), 'No User', 'table.tp', null);
		else
			Template.renderRaw(document.getElementById('generateTab'), HTML, 'table.tp', null);
		db.close();
	}
	/* Interface for component */
	static draw()
	{
		this.main();
		this.tab();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
	}
}

module.exports = MainComponent;
