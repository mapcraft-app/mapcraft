const Database = require('better-sqlite3');
const path = require('path');
const MC = require('../../../../js/Mapcraft');
const IPC = require('../../../../js/MCipc');
const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);

const Trigger = require('../../../../js/built_in/Trigger');

var Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));

var LANG; UpdateLang();
function UpdateLang() { LANG = MCplugin.Lang('Trigger'); }

const WorkProgress = {
	open: () => {
		IPC.send('WorkProgress:signal-open-modal');
	},
	close: () => {
		IPC.send('WorkProgress:signal-close-modal');
	}
}

class TriggerComponent
{
	static main()
	{
		Template.render(document.getElementById('content'), 'trigger.tp', null);
		DetectSubmitForm();
	}
	static tab()
	{
		let HTML = '';
		let Component = Template.getRaw('list.tp');
		let Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		let sql = db.prepare('SELECT * FROM Trigger');
		for (let trigger of sql.iterate())
			HTML += Template.parseRaw(Component, { ID:trigger.ID, Name:trigger.Name, X1:trigger.X1, Y1:trigger.Y1, Z1:trigger.Z1, X2:trigger.X2, Y2:trigger.Y2, Z2:trigger.Z2 });
		if (HTML)
			Template.renderRaw(document.getElementById('trigger-tab'), HTML, 'list.tp', null);
		else
			Template.renderRaw(document.getElementById('trigger-tab'), '<h3 lang="Tab.NoTrigger"></h3>', 'list.tp', null);
		db.close();
		EditExecuteFile()
		RemoveTrigger();
	}
	static draw()
	{
		UpdateLang();
		this.main();
		this.tab();
		Template.updateLang(document.getElementById('content'), LANG.Data);
	}
}

//#region IPC signal
IPC.receive('Shell:execute-command', (command) => {
	if (command.Command !== 'trigger')
		return ;
	IPC.send('Trigger:signal-open-modal', command);
});
//#endregion

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

function DetectSubmitForm()
{
	document.querySelector('#form-trigger-create').addEventListener('submit', (event) => {
		event.preventDefault();
		WorkProgress.open();
		let form = Array.from(event.target.elements);
		let db = Database(Mapcraft.DBPath, {verbose: console.log });
		const sql_Name = db.prepare('SELECT Name FROM Trigger WHERE Name = ?');
		let ret = sql_Name.get(form[0].value);
		if (ret !== undefined && ret.Name)
			CreateAlert('warning', document.getElementById('form-trigger-alert'), LANG.Data.Error.NameExist);
		else
		{
			let sql = db.prepare('INSERT INTO Trigger (Name, X1, Y1, Z1, X2, Y2, Z2) VALUES (?, ?, ?, ?, ?, ?, ?)');
			sql.run(form[0].value, form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value);
			sql = db.prepare('SELECT ID FROM Trigger WHERE Name = ?');
			let ret = sql.get(form[0].value);
			Trigger.CreateTrigger(ret.ID, form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, false);
			for (let id in form)
			{
				if (form[id].type === 'text')
					form[id].value = '';
				else
					form[id].value = 0;
			}
			TriggerComponent.tab();
		}
		db.close();
		WorkProgress.close();
	});
	document.querySelector('#form-trigger-edit').addEventListener('submit', (event) => {
		event.preventDefault();
		WorkProgress.open();
		let form = Array.from(event.target.elements);
		let db = Database(Mapcraft.DBPath, {verbose: console.log });
		const sql = db.prepare('UPDATE Trigger SET Name = ?, X1 = ?, Y1 = ?, Z1 = ?, X2 = ?, Y2 = ?, Z2 = ? WHERE ID = ?');
		sql.run(form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, form[7].value, form[0].value);
		Trigger.CreateTrigger(form[0].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, form[7].value, true);
		TriggerComponent.tab();
		db.close();
		WorkProgress.close();
	});
}

function RemoveTrigger()
{
	document.querySelector('#full-delete-tab').addEventListener('click', (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		WorkProgress.open();
		document.querySelector('#full-delete-tab').checked = false;
		let db = Database(Mapcraft.DBPath, {verbose: console.log });
		let isDelete = false;
		const sql_Name = db.prepare('DELETE FROM Trigger WHERE ID = ?');
		for (let input of document.querySelectorAll('input[name="form-checkbox"]'))
		{
			if (input.checked)
			{
				isDelete = true;
				sql_Name.run(input.value);
				Trigger.RemoveTrigger(input.value);
			}
		}
		if (isDelete)
			TriggerComponent.tab();
		db.close();
		WorkProgress.close();
	});

	for (let input of document.querySelectorAll('button[name="form-button-delete"]'))
	{
		input.addEventListener('click', () => {
			WorkProgress.open();
			let ID = input.parentNode.parentNode.firstElementChild.firstElementChild.value;
			let db = Database(Mapcraft.DBPath, {verbose: console.log });
			const sql_Name = db.prepare('DELETE FROM Trigger WHERE ID = ?');
			sql_Name.run(ID);
			Trigger.RemoveTrigger(ID);
			TriggerComponent.tab();
			db.close();
			WorkProgress.close();
		});
	}
}

function EditExecuteFile()
{
	const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
	for (let input of document.querySelectorAll('button[name="form-button-modify"]'))
	{
		input.addEventListener('click', () => {
			let ID = input.parentNode.parentNode.firstElementChild.firstElementChild.value;
			let ExecutePath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/trigger', ID.toString(), 'execute.mcfunction');
			IPC.send('Editor:open', ExecutePath);
		});
	}
}

module.exports = TriggerComponent;
