const path = require('path');
const fs = require('fs');
const MC = require('../../js/Mapcraft');
const IPC = require('../../js/MCipc');
const Component = require('./components');
const Up = require('../../../update'), Update = new Up();

window.addEventListener('DOMContentLoaded', () => {
	document.title = Component.getLang().Update;

	Component.draw();

	ifUpdated = (data, version) => {
		if (Object.keys(data).length && data.version !== version) return true;
		return false;
	};
	
	let _async = async () => {
		await Update.checkUpdate();
		let data = Update.getJson();

		/*if (data.count === 0)
			IPC.send('Update:close-modal');
		else */if (data.count === 1)
			document.getElementById('text-title').innerText = Component.getLang().One;
		else
			document.getElementById('text-title').innerText = Component.getLang().Multi;
		
		if (ifUpdated(data.software, Update.getCurrentVersion().software))
			document.getElementById('text-software').innerHTML = '<p><span uk-icon="download" class="span-download"></span>'+ Component.getLang().IsUpdate.Software +'</p>';
		else
			document.getElementById('text-software').innerHTML = '<p><span uk-icon="check" class="span-check"></span>'+ Component.getLang().IsNotUpdate.Software +'</p>';
		
		if (ifUpdated(data.datapack, Update.getCurrentVersion().datapack))
			document.getElementById('text-datapack').innerHTML = '<p><span uk-icon="download" class="span-download"></span>'+ Component.getLang().IsUpdate.Datapack +'</p>';
		else
			document.getElementById('text-datapack').innerHTML = '<p><span uk-icon="check" class="span-check"></span>'+ Component.getLang().IsNotUpdate.Datapack +'</p>';
		
		if (ifUpdated(data.resourcepack, Update.getCurrentVersion().resourcepack))
			document.getElementById('text-resourcepack').innerHTML = '<p><span uk-icon="download" class="span-download"></span>'+ Component.getLang().IsUpdate.ResourcePack +'</p>';
		else
			document.getElementById('text-resourcepack').innerHTML = '<p><span uk-icon="check" class="span-check"></span>'+ Component.getLang().IsNotUpdate.ResourcePack +'</p>';
		
		document.getElementById('close-update').addEventListener('click', () => {
			IPC.send('Update:close-modal')
		});
		document.getElementById('make-update').addEventListener('click', () => {
			document.getElementById('form').innerHTML = '';
			document.getElementById('spinner-update').style.display = 'block';
			let _async = async () => {
				if (ifUpdated(data.software, Update.getCurrentVersion().software))
				{
					if (ifUpdated(data.datapack, Update.getCurrentVersion().datapack))
						await Update.datapack();
					if (ifUpdated(data.resourcepack, Update.getCurrentVersion().resourcepack))
						await Update.resourcepack();
					await Update.software();
				}
				else
				{
					if (ifUpdated(data.datapack, Update.getCurrentVersion().datapack))
						await Update.datapack();
					if (ifUpdated(data.resourcepack, Update.getCurrentVersion().resourcepack))
						await Update.resourcepack();
					fs.rm(path.join(__dirname, 'temp'), { recursive: true, force: true });
				}
			}; _async();
		});
	}; _async();
});
