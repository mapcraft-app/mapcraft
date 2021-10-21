const path = require('path');
const fs = require('fs');
const MC = require('../../js/Mapcraft');
const MCutilities = require('../../js/MCutilities');
const IPC = require('../../js/MCipc');
const Up = require('../../../update');
const Component = require('./components');
const { CreateDB } = require('../../js/MCdatabase');

const LANG = MCutilities.GetLang(__dirname, MC.GetConfig().Env.Lang);

async function MakeInstallationOfBase()
{
	const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
	const Update = new Up();
	//#region Install necessary tools
	if (!fs.existsSync(LocalMapcraft.Data.ResourcePack) || !fs.existsSync(LocalMapcraft.Data.DataPack))
	{
		document.getElementById('textWaitModal').innerText = LANG.WaitModal.CustomResource;
		await Update.addNecessaryTools();
	}
	//#endregion
	//#region Install base resource if not present
	if (!fs.existsSync(LocalMapcraft.Mapcraft) || !fs.existsSync(path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft')))
	{
		document.getElementById('textWaitModal').innerText = LANG.WaitModal.BaseResource;
		await Update.installBase();
	}
	else
	{
		fs.rmSync(path.join(LocalMapcraft.TempPath, 'mapcraftTemp'), { recursive: true, force: true });
		IPC.send('Start:is-selected-world');
	}
}

window.addEventListener('DOMContentLoaded', () =>
{
	Component.drawFullComponent();
	/*Options */
	document.querySelector('#option-TempPath').addEventListener('click', () =>
	{
		IPC.send('Dialog:open-directory', 'TempPath', document.getElementById('TempPath').value);
	});
	document.querySelector('#option-GamePath').addEventListener('click', () =>
	{
		IPC.send('Dialog:open-directory', 'GamePath', document.getElementById('GamePath').value);
	});
	document.querySelector('#option-SavePath').addEventListener('click', () =>
	{
		IPC.send('Dialog:open-directory', 'SavePath', document.getElementById('SavePath').value);
	});
	IPC.receive('Dialog:selected-directory', (data, element) =>
	{
		if (data.canceled === false)
		{
			const _value = data.filePaths[0];
			document.getElementById(element).value = _value;
		}
	});
	document.getElementById('option-button-save').addEventListener('click', () =>
	{
		if (document.getElementById('modal-option').classList.contains('uk-open'))
		{
			if (!document.getElementById('ResourcePath').value)
				document.getElementById('ResourcePath').value = 'Mapcraft-resource';
			if (!document.getElementById('DataPath').value)
				document.getElementById('DataPath').value = 'Mapcraft-data';
			MC.UpdateConfig(document.getElementById('TempPath').value, document.getElementById('GamePath').value, document.getElementById('SavePath').value, document.getElementById('option-Lang').value, document.getElementById('ResourcePath').value, document.getElementById('DataPath').value);
			Component.drawSaveConfig(document.getElementById('start-selection'));
		}
	});
	document.getElementById('option-button-reset').addEventListener('click', () =>
	{
		MC.ResetConfigFile();
		Component.drawResetConfig(document.getElementById('start-selection'), document.getElementById('start-option'));
	});

	/*Selection */
	document.getElementById('start-selection').addEventListener('click', (event) =>
	{
		let _ID;
		if (event.target)
		{
			if (event.target.classList.contains('start-card'))
				_ID = event.target.id;
			if (event.target.parentNode.tagName === 'DIV' && event.target.parentNode.classList.contains('start-card'))
				_ID = event.target.parentNode.id;
		}
		if (_ID)
		{
			document.querySelector('html').classList.add('uk-modal-page');
			const element = document.getElementById('modal-loadSave');
			element.classList.add('uk-modal', 'uk-flex', 'uk-open');
			element.setAttribute('aria-expanded', 'true');
			const _Name = document.getElementById(_ID).childNodes[3].textContent;
			const Mapcraft = {
				ID: _ID,
				Name: _Name,
				SavePath: path.join(MC.GetConfig().Env.SavePath, _Name),
				TempPath: MC.GetConfig().Env.TempPath,
				Mapcraft: path.join(MC.GetConfig().Env.SavePath, _Name, 'datapacks', 'mapcraft'),
				DBPath: path.join(MC.GetConfig().Env.SavePath, _Name, 'data.db'),
				Data: {
					DataPack: path.join(MC.GetConfig().Env.SavePath, _Name, 'datapacks', MC.GetConfig().Data.DataPack),
					ResourcePack: path.join(MC.GetConfig().Env.SavePath, '../resourcepacks', `${_Name}-${MC.GetConfig().Data.ResourcePack}`),
				},
			};
			localStorage.setItem('Mapcraft', JSON.stringify(Mapcraft));
			if (!fs.existsSync(Mapcraft.DBPath))
				try
				{
					const newDb = new CreateDB(Mapcraft.DBPath);
					if (!newDb)
						throw new Error('Database creation failed');
				}
				catch (err)
				{
					throw new Error(err);
				}
			MakeInstallationOfBase();
		}
	});
});
