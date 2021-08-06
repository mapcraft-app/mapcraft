const MC = require('../../js/Mapcraft');
const IPC = require('../../js/MCipc');
const Database = require('better-sqlite3');
const https = require('https');
const Component = require('./components');

var Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));

function CreateAlert(type, DOMelement, str)
{
	let alert = document.createElement('div');
	alert.classList.add('uk-alert-' + type);
	alert.setAttribute('uk-alert', '');
	let closeButton = document.createElement('a');
	closeButton.classList.add('uk-alert-close');
	closeButton.setAttribute('uk-close', '');
	let text = document.createElement('p').appendChild(document.createTextNode(str));
	alert.appendChild(closeButton);
	alert.appendChild(text);
	DOMelement.appendChild(alert);
}

function UserConnected(Username)
{
	let db = Database(Mapcraft.DBPath, { verbose: console.log });
	const sql = db.prepare('UPDATE User SET IsConnected = 1 WHERE Username = ?');
	sql.run(Username);
	db.close();
}

function IfUserExist()
{
	if (localStorage.getItem('Mapcraft_User'))
	{
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		const sql = db.prepare('SELECT count(*) FROM User');
		const isUser = sql.get()["count(*)"];
		let ret = JSON.parse(localStorage.getItem('Mapcraft_User'));
		if (isUser > 0 && ret.Username && ret.Remember === true)
		{
			UserConnected(ret.Username);
			IPC.send('User:close-window', Mapcraft.DBPath, ret);
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	IfUserExist();
	Component.draw();
	// Submit form
	document.getElementById('Choose-User').addEventListener('click', (event) => {
		let checkbox = document.getElementsByName('select_user');
		for (let i = 0; i < checkbox.length; i++)
		{
			if (checkbox[i].checked)
			{
				let Username = checkbox[i].value;
				let db = Database(Mapcraft.DBPath, { verbose: console.log });
				const sql_User = db.prepare('SELECT UUID FROM User WHERE Username = ?');
				let UUID = sql_User.get(Username).UUID
				db.close();
				let Remember = document.getElementById('remember').checked;
				let ret = {
					Username: Username,
					UUID: UUID,
					Remember: Remember
				};
				localStorage.setItem('Mapcraft_User', JSON.stringify(ret));
				UserConnected(Username);
				IPC.send('User:close-window', Mapcraft.DBPath, ret);
				return ;
			}
		}
		CreateAlert('danger', document.getElementById('alert-main'), MC.GetLang().SelectUser.Modal.Error.NoUser);
	});
	// Create user
	document.getElementById('form-createUser').addEventListener('submit', (event) => {
		event.preventDefault();
		let addUserToDB = (name, uuid) => {
			let db = Database(Mapcraft.DBPath, { verbose: console.log });
			const sql_User = db.prepare('SELECT Username FROM User WHERE Username = ?');
			if (sql_User.get(name) !== undefined && sql_User.get(name).Username)
				CreateAlert('danger', document.getElementById('alert'), MC.GetLang().SelectUser.Modal.Error.IsExist);
			else
			{
				const sql = db.prepare('INSERT INTO User (Username, UUID) VALUES (?, ?)');
				const info = sql.run(name, uuid);
				console.log(info.changes);
				event.target[1].value = '';
				Component.tab();
			}
			db.close();
		};

		//#region Check online if player exist
		const req = https.request(
			{
				hostname: 'api.mojang.com',
				path: '/users/profiles/minecraft/' + event.target[1].value,
				method: 'GET'
			},
			res => {
				if (res.statusCode !== 200)
				{
					CreateAlert('warning', document.getElementById('alert'), MC.GetLang().SelectUser.Modal.Error.UserNotExist);
					return ;
				}
				else
				{
					res.on('data', data => {
						let JsonData = JSON.parse(data);
						addUserToDB(JsonData.name, JsonData.id);
					});
				}
			}
		);
		req.end();
		//#endregion
	});
});
