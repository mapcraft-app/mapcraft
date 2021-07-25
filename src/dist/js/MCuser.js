const Database = require('better-sqlite3');
const fs = require('fs');
const https = require('https');
const path = require('path');
const userFile = path.join(__dirname, '../../user');
const userIcon = path.join(__dirname, '../../icon.png');

class User
{
	static connected(Username, UUID)
	{
		let Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		const sql = db.prepare('UPDATE User SET IsConnected = 1 WHERE Username = ?');
		sql.run(Username);
		db.close();
		fs.writeFileSync(userFile, JSON.stringify({ Username:Username, UUID:UUID, DBpath:Mapcraft.DBPath }, null, 4));
	}
	static disconnected()
	{
		let json = JSON.parse(fs.readFileSync(userFile, 'utf-8'));
		if (json)
		{
			let db = Database(json.DBpath, { verbose: console.log });
			const sql = db.prepare('UPDATE User SET IsConnected = 0 WHERE Username = ?');
			sql.run(json.Username);
			db.close();
			fs.unlink(userFile, (err) => {
				if (err)
					throw (err);
			});
		}
	}
}

module.exports = User;
