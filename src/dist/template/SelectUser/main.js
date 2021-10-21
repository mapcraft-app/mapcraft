const Database = require('better-sqlite3');
const https = require('https');
const Component = require('./components');
const MC = require('../../js/Mapcraft');
const MCutilities = require('../../js/MCutilities');
const IPC = require('../../js/MCipc');

const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const LANG = MCutilities.GetLang(__dirname, MC.GetConfig().Env.Lang);

function CreateAlert(type, DOMelement, str)
{
	const alert = document.createElement('div');
	alert.classList.add(`uk-alert-${type}`);
	alert.setAttribute('uk-alert', '');
	const closeButton = document.createElement('a');
	closeButton.classList.add('uk-alert-close');
	closeButton.setAttribute('uk-close', '');
	const text = document.createElement('p').appendChild(document.createTextNode(str));
	alert.appendChild(closeButton);
	alert.appendChild(text);
	DOMelement.appendChild(alert);
}

function UserConnected(Username)
{
	const db = Database(Mapcraft.DBPath, { verbose: console.log });
	const sql = db.prepare('UPDATE User SET IsConnected = 1 WHERE Username = ?');
	sql.run(Username);
	db.close();
}

function IfUserExist()
{
	if (localStorage.getItem('Mapcraft_User'))
	{
		const db = Database(Mapcraft.DBPath, { verbose: console.log });
		const sql = db.prepare('SELECT count(*) FROM User');
		const isUser = sql.get()['count(*)'];
		const ret = JSON.parse(localStorage.getItem('Mapcraft_User'));
		if (isUser > 0 && ret.Username && ret.Remember === true)
		{
			UserConnected(ret.Username);
			IPC.send('User:close-window', Mapcraft.DBPath, ret);
		}
	}
}
IfUserExist();

window.addEventListener('DOMContentLoaded', () =>
{
	Component.draw();

	//Submit form
	document.getElementById('Choose-User').addEventListener('click', () =>
	{
		const checkbox = document.getElementsByName('select_user');
		for (let i = 0; i < checkbox.length; i++)
			if (checkbox[i].checked)
			{
				const Username = checkbox[i].value;
				const db = Database(Mapcraft.DBPath, { verbose: console.log });
				const sqlUser = db.prepare('SELECT UUID FROM User WHERE Username = ?');
				const { UUID } = sqlUser.get(Username);
				db.close();
				const Remember = document.getElementById('remember').checked;
				const ret = {
					Username,
					UUID,
					Remember,
				};
				localStorage.setItem('Mapcraft_User', JSON.stringify(ret));
				UserConnected(Username);
				IPC.send('User:close-window', Mapcraft.DBPath, ret);
				return;
			}
		CreateAlert('danger', document.getElementById('alert-main'), LANG.Modal.Error.NoUser);
	});

	//Create user
	document.getElementById('form-createUser').addEventListener('submit', (event) =>
	{
		event.preventDefault();
		const addUserToDB = (name, uuid) =>
		{
			const db = Database(Mapcraft.DBPath, { verbose: console.log });
			const sqlUser = db.prepare('SELECT Username FROM User WHERE Username = ?');
			if (sqlUser.get(name) !== undefined && sqlUser.get(name).Username)
			{
				CreateAlert('danger', document.getElementById('alert'), LANG.Modal.Error.IsExist);
			}
			else
			{
				const sql = db.prepare('INSERT INTO User (Username, UUID) VALUES (?, ?)');
				const info = sql.run(name, uuid);
				console.log(info.changes);
				event.target[1].value = ''; // eslint-disable-line
				Component.tab();
			}
			db.close();
		};

		//#region Check online if player exist
		const req = https.request(
			{
				hostname: 'api.mojang.com',
				path: `/users/profiles/minecraft/${event.target[1].value}`,
				method: 'GET',
			},
			(res) =>
			{
				if (res.statusCode !== 200)
					CreateAlert('warning', document.getElementById('alert'), LANG.Modal.Error.UserNotExist);
				else
					res.on('data', (data) =>
					{
						const JsonData = JSON.parse(data);
						addUserToDB(JsonData.name, JsonData.id);
					});
			},
		);
		req.end();
		//#endregion
	});
});
