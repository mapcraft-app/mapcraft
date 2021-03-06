const fs = require('fs');
const path = require('path');
const Md = require('markdown-it');
const { MCipc } = require('mapcraft-api');
const Component = require('./components');
const Up = require('../../../update');

const Update = new Up();
const Markdown = new Md();

window.addEventListener('DOMContentLoaded', () =>
{
	document.title = Component.getLang().Update;

	Component.draw();

	const ifUpdated = (data, version) =>
	{
		if (Object.keys(data).length && data.version !== version)
			return true;
		return false;
	};

	const _async = async () =>
	{
		await Update.checkUpdate();
		const data = Update.getJson();
		if (data.count === 0)
		{
			MCipc.send('Update:close-modal');
			return;
		}
		if (data.count === 1)
			document.getElementById('text-title').innerText = Component.getLang().One;
		else
			document.getElementById('text-title').innerText = Component.getLang().Multi;
		document.getElementById('validation-button').style.display = 'block';

		if (ifUpdated(data.software, Update.getCurrentVersion().software))
		{
			document.getElementById('text-software').innerHTML = `<p><span uk-icon="download" class="span-download"></span>${Component.getLang().IsUpdate.Software}</p>`;
			document.querySelector('[target="text-software"]').innerHTML = Markdown.render(data.software.description);
		}
		else
		{
			document.getElementById('text-software').innerHTML = `<p><span uk-icon="check" class="span-check"></span>${Component.getLang().IsNotUpdate.Software}</p>`;
		}

		if (ifUpdated(data.datapack, Update.getCurrentVersion().datapack))
		{
			document.getElementById('text-datapack').innerHTML = `<p><span uk-icon="download" class="span-download"></span>${Component.getLang().IsUpdate.Datapack}</p>`;
			document.querySelector('[target="text-datapack"]').innerHTML = Markdown.render(data.datapack.description);
		}
		else
		{
			document.getElementById('text-datapack').innerHTML = `<p><span uk-icon="check" class="span-check"></span>${Component.getLang().IsNotUpdate.Datapack}</p>`;
		}
		if (ifUpdated(data.resourcepack, Update.getCurrentVersion().resourcepack))
		{
			document.getElementById('text-resourcepack').innerHTML = `<p><span uk-icon="download" class="span-download"></span>${Component.getLang().IsUpdate.ResourcePack}</p>`;
			document.querySelector('[target="text-resourcepack"]').innerHTML = Markdown.render(data.resourcepack.description);
		}
		else
		{
			document.getElementById('text-resourcepack').innerHTML = `<p><span uk-icon="check" class="span-check"></span>${Component.getLang().IsNotUpdate.ResourcePack}</p>`;
		}
		MCipc.send('Update:open-window');

		document.getElementById('close-update').addEventListener('click', () =>
		{
			MCipc.send('Update:close-modal');
		});
		document.getElementById('make-update').addEventListener('click', () =>
		{
			Component.cleanNode(document.getElementById('form'), true);
			document.body.style.height = '100%';
			document.getElementById('spinner-update').style.display = 'flex';
			const _async2 = async () =>
			{
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
					const localMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
					if (ifUpdated(data.datapack, Update.getCurrentVersion().datapack))
						await Update.datapack();
					if (ifUpdated(data.resourcepack, Update.getCurrentVersion().resourcepack))
						await Update.resourcepack();
					fs.rm(path.join(localMapcraft.TempPath, 'mapcraftTemp'), { recursive: true, force: true }, () =>
					{
						Update.updateManifest();
						MCipc.send('Update:close-modal');
					});
				}
			}; _async2();
		});
	}; _async();
});
