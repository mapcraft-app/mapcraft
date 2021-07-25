const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

class CreateDB
{
	constructor(link)
	{
		this.db = new Database(link, { verbose: console.log });
		console.log(__dirname);
		this.AddTable();
	}
	AddTable()
	{
		this._AddTableUser();
		this._AddTableTrigger();
		this._AddTableCutscene();
	}
	/* ===== */
	_AddTableUser()
	{
		this.db.exec(fs.readFileSync(path.join(__dirname, '../sql/mc_user.sql'), 'utf8'));
	}
	_AddTableTrigger()
	{
		this.db.exec(fs.readFileSync(path.join(__dirname, '../sql/mc_trigger.sql'), 'utf8'));
	}
	_AddTableCutscene()
	{
		this.db.exec(fs.readFileSync(path.join(__dirname, '../sql/mc_cutscene.sql'), 'utf8'));
		this.db.exec(fs.readFileSync(path.join(__dirname, '../sql/mc_cutscene_point.sql'), 'utf8'));
	}
}

class ManageDB
{
	;
}

module.exports = { CreateDB, ManageDB };
