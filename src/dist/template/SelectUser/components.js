const { app } = require('electron');
const Database = require('better-sqlite3');
const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');

const Template = new MCtemplate(__dirname);
const LANG = MCutilities.GetLang(__dirname, Mapcraft.config.Env.Lang);

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
		const Component = Template.getRaw('table.tp');
		const _Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		if (!_Mapcraft.DBPath)
		{
			app.relaunch();
			app.quit();
		}
		const db = Database(_Mapcraft.DBPath, { verbose: console.log });
		const sql = db.prepare('SELECT Username, UUID FROM User');
		for (const user of sql.iterate())
		{
			isUsers = true;
			HTML += Template.parseRaw(Component, { link: `https://crafatar.com/avatars/${user.UUID}?size=40`, username: user.Username });
		}
		if (!isUsers)
			Template.renderRaw(document.getElementById('generateTab'), 'No User', 'table.tp', null);
		else
			Template.renderRaw(document.getElementById('generateTab'), HTML, 'table.tp', null);
		db.close();
	}

	/*Interface for component */
	static draw()
	{
		this.main();
		this.tab();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
	}
}

module.exports = MainComponent;
