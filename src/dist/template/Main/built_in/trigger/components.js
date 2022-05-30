const Database = require('better-sqlite3');
const path = require('path');
const { MCipc, MCplugin, MCtemplate, MCworkInProgress } = require('mapcraft-api');
const Trigger = require('../../../../js/built_in/Trigger');

const Plugins = new MCplugin();
const Template = new MCtemplate(__dirname);

const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));

let LANG = Plugins.lang('Trigger');
function UpdateLang()
{
	LANG = Plugins.lang('Trigger');
}

class TriggerComponent
{
	static _main()
	{
		Template.render(document.getElementById('content'), 'trigger.tp', null);
		DetectSubmitForm(); // eslint-disable-line
	}

	static tab()
	{
		let HTML = '';
		const Component = Template.getRaw('list.tp');
		const _Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const db = Database(_Mapcraft.DBPath, { verbose: console.log });
		const sql = db.prepare('SELECT * FROM Trigger');
		for (const trigger of sql.iterate())
			HTML += Template.parseRaw(Component, {
				ID: trigger.ID,
				Name: trigger.Name,
				X1: trigger.X1,
				Y1: trigger.Y1,
				Z1: trigger.Z1,
				X2: trigger.X2,
				Y2: trigger.Y2,
				Z2: trigger.Z2,
			});
		if (HTML)
			Template.renderRaw(document.getElementById('trigger-tab'), HTML, 'list.tp', null);
		else
			Template.renderRaw(document.getElementById('trigger-tab'), '<h3 lang="Tab.NoTrigger"></h3>', 'list.tp', null);
		db.close();
		EditExecuteFile(); // eslint-disable-line
		RemoveTrigger(); // eslint-disable-line
	}

	static main()
	{
		UpdateLang();
		this._main();
		this.tab();
		Template.updateLang(document.getElementById('content'), LANG.Data);
	}
}

//#region  MCipc signal
MCipc.receive('Shell:execute-command', (command) =>
{
	if (command.Command !== 'trigger')
		return;
	MCipc.send('Trigger:signal-open-modal', command);
});
// #endregion

//#region  Miscellaneous functions
function createAlert(type, DOMelement, str)
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

function DetectSubmitForm()
{
	document.querySelector('#form-trigger-create').addEventListener('submit', (event) =>
	{
		event.preventDefault();
		MCworkInProgress.open();
		const form = Array.from(event.target.elements);
		const db = Database(Mapcraft.DBPath, { verbose: console.log });
		const sqlName = db.prepare('SELECT Name FROM Trigger WHERE Name = ?');
		const ret = sqlName.get(form[0].value);
		if (ret !== undefined && ret.Name)
		{
			createAlert('warning', document.getElementById('form-trigger-alert'), LANG.Data.Error.NameExist);
		}
		else
		{
			let sql = db.prepare('INSERT INTO Trigger (Name, X1, Y1, Z1, X2, Y2, Z2) VALUES (?, ?, ?, ?, ?, ?, ?)');
			sql.run(form[0].value, form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value);
			sql = db.prepare('SELECT ID FROM Trigger WHERE Name = ?');
			const _ret = sql.get(form[0].value);
			Trigger.CreateTrigger(_ret.ID, form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, false);
			for (const id in form)
				if (form[id].type === 'text')
					form[id].value = '';
				else
					form[id].value = 0;
			TriggerComponent.tab();
		}
		db.close();
		MCworkInProgress.close();
	});
	document.querySelector('#form-trigger-edit').addEventListener('submit', (event) =>
	{
		event.preventDefault();
		MCworkInProgress.open();
		const form = Array.from(event.target.elements);
		const db = Database(Mapcraft.DBPath, { verbose: console.log });
		const sql = db.prepare('UPDATE Trigger SET Name = ?, X1 = ?, Y1 = ?, Z1 = ?, X2 = ?, Y2 = ?, Z2 = ? WHERE ID = ?');
		sql.run(form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, form[7].value, form[0].value);
		Trigger.CreateTrigger(form[0].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value, form[7].value, true);
		TriggerComponent.tab();
		db.close();
		MCworkInProgress.close();
	});
}

function RemoveTrigger()
{
	document.querySelector('#full-delete-tab').addEventListener('click', (event) =>
	{
		event.preventDefault();
		event.stopImmediatePropagation();
		MCworkInProgress.open();
		document.querySelector('#full-delete-tab').checked = false;
		const db = Database(Mapcraft.DBPath, { verbose: console.log });
		let isDelete = false;
		const sqlName = db.prepare('DELETE FROM Trigger WHERE ID = ?');
		for (const input of document.querySelectorAll('input[name="form-checkbox"]'))
			if (input.checked)
			{
				isDelete = true;
				sqlName.run(input.value);
				Trigger.RemoveTrigger(input.value);
			}
		if (isDelete)
			TriggerComponent.tab();
		db.close();
		MCworkInProgress.close();
	});

	for (const input of document.querySelectorAll('button[name="form-button-delete"]'))
		input.addEventListener('click', () =>
		{
			MCworkInProgress.open();
			const ID = input.parentNode.parentNode.firstElementChild.firstElementChild.value;
			const db = Database(Mapcraft.DBPath, { verbose: console.log });
			const sqlName = db.prepare('DELETE FROM Trigger WHERE ID = ?');
			sqlName.run(ID);
			Trigger.RemoveTrigger(ID);
			TriggerComponent.tab();
			db.close();
			MCworkInProgress.close();
		});
}

function EditExecuteFile()
{
	for (const input of document.querySelectorAll('button[name="form-button-modify"]'))
		input.addEventListener('click', () =>
		{
			const ID = input.parentNode.parentNode.firstElementChild.firstElementChild.value;
			const ExecutePath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/trigger', ID.toString(), 'execute.mcfunction');
			MCipc.send('Editor:open', ExecutePath);
		});
}
// #endregion

module.exports = TriggerComponent;
