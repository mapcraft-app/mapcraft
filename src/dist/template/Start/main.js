const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const MC = require('../../js/Mapcraft');
const IPC = require('../../js/MCipc');
const Component = require('./components');
const { CreateDB, ManageDB } = require('../../js/MCdatabase');

function GetLang()
{
	let data;
	try { data = JSON.parse(fs.readFileSync(path.join(__dirname, './lang', MC.GetConfig().Env.Lang + '.json'))) }
	catch (err) { throw err }
	return (data);
}; let LANG = GetLang();

window.addEventListener('DOMContentLoaded', () => {
	Component.drawFullComponent();
	/* Options */
	document.getElementById('start-option').addEventListener('click', (event) => {
		if (event.target)
		{
			if (((event.target.tagName == 'a' && event.target.id === 'option-TempPath'))
				|| (event.target.tagName == 'svg' && event.target.parentNode.id === 'option-TempPath'))
			{
				let path = document.getElementById('TempPath').value;
				IPC.send('Dialog:open-directory', 'TempPath', path);
			}
			if (((event.target.tagName == 'a' && event.target.id === 'option-GamePath'))
				|| (event.target.tagName == 'svg' && event.target.parentNode.id === 'option-GamePath'))
			{
				let path = document.getElementById('GamePath').value;
				IPC.send('Dialog:open-directory', 'GamePath', path);
			}
			if (((event.target.tagName == 'a' && event.target.id === 'option-SavePath'))
				|| (event.target.tagName == 'svg' && event.target.parentNode.id === 'option-SavePath'))
			{
				let path = document.getElementById('SavePath').value;
				IPC.send('Dialog:open-directory', 'SavePath', path);
			}
		}
	});
	IPC.receive('Dialog:selected-directory', (data, element) => {
		if (data.canceled === false)
			document.getElementById(element).value = data.filePaths[0];
	});
	document.getElementById('option-button-save').addEventListener('click', () => {
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
	document.getElementById('option-button-reset').addEventListener('click', () => {
		MC.ResetConfigFile();
		Component.drawResetConfig(document.getElementById('start-selection'), document.getElementById('start-option'));
	});
	/* Selection */
	document.getElementById('start-selection').addEventListener('click', (event) => {
		let ID;
		if (event.target)
		{
			if (event.target.classList.contains('start-card'))
				ID = event.target.id;
			if (event.target.parentNode.tagName === 'DIV' && event.target.parentNode.classList.contains('start-card'))
				ID = event.target.parentNode.id;
		}
		if (ID)
		{
			document.querySelector('html').classList.add('uk-modal-page');
			let element = document.getElementById('modal-loadSave');
			element.classList.add('uk-modal','uk-flex','uk-open');
			element.setAttribute('aria-expanded', 'true');
			let Name = document.getElementById(ID).childNodes[3].textContent;
			let Mapcraft = {
				ID: ID,
				Name: Name,
				SavePath: path.join(MC.GetConfig().Env.SavePath, Name),
				Mapcraft: path.join(MC.GetConfig().Env.SavePath, Name, 'datapacks', 'mapcraft'),
				DBPath: path.join(MC.GetConfig().Env.SavePath, Name, 'data.db'),
				Data : {
					DataPack: path.join(MC.GetConfig().Env.SavePath, Name, 'datapacks', MC.GetConfig().Data.DataPack),
					ResourcePack: path.join(MC.GetConfig().Env.SavePath, '../resourcepacks', Name + '-' + MC.GetConfig().Data.ResourcePack)
				}
			}
			localStorage.setItem('Mapcraft', JSON.stringify(Mapcraft)); 
			if (!fs.existsSync(Mapcraft.DBPath))
				new CreateDB(Mapcraft.DBPath);

			let LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
			const Up = require('../../../update'), Update = new Up();
			//#region Install necessary tools
			if (!fs.existsSync(Mapcraft.Data.ResourcePack) || !fs.existsSync(Mapcraft.Data.DataPack))
			{
				document.getElementById('textWaitModal').innerText = LANG.WaitModal.CustomResource;
				Update.addNecessaryTools();
			}
			//#endregion
			//#region Install base resource if not present
			if (!fs.existsSync(LocalMapcraft.Mapcraft) || !fs.existsSync(path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft')))
			{
				document.getElementById('textWaitModal').innerText = LANG.WaitModal.BaseResource;
				Update.installBase();
			}
			else
			{
				fs.rmSync(path.join(__dirname, '../../temp'), {recursive: true, force: true});
				IPC.send('Start:is-selected-world');
			}
			//#endregion
		}
	});
});
