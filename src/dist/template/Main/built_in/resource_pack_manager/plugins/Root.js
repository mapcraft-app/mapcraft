const fs = require('fs');
const { MCutilities } = require('mapcraft-api');
const path = require('path');

class Root
{
	constructor(lang)
	{
		this.lang = lang;
		this.resPack = JSON.parse(localStorage.getItem('Mapcraft')).Data.ResourcePack;
		this.defaultMCmeta = {
			pack: {
				pack_format: 8,
				description: 'Mapcraft-data resource pack',
			},
		};
		this.saveData = {
			mcmeta: undefined,
			img: undefined,
		};

		this.previewImage();
		fs.readdir(this.resPack, { encoding: 'utf-8', withFileTypes: false }, (err, files) =>
		{
			if (err)
				throw new Error(err);
			if (files.indexOf('pack.mcmeta') === -1)
				fs.writeFileSync(path.join(this.resPack, 'pack.mcmeta'), JSON.stringify(this.defaultMCmeta, null, 4));
			if (files.indexOf('pack.png') === -1)
				fs.copyFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'img', 'icon', 'icon.png'), path.join(this.resPack, 'pack.png'));
			this.saveData.mcmeta = JSON.parse(fs.readFileSync(path.join(this.resPack, 'pack.mcmeta'), { encoding: 'utf-8', flag: 'r' }));
			this.saveData.img = path.join(this.resPack, 'pack.png');
			document.getElementById('root-description').value = this.saveData.mcmeta.pack.description;
			document.getElementById('root-packPreview').src = this.saveData.img;
		});

		document.getElementById('root-description').addEventListener('input', (e) =>
		{
			this.saveData.mcmeta.pack.description = e.target.value;
		});

		document.getElementById('root-save').addEventListener('click', (e) =>
		{
			e.preventDefault();
			e.stopImmediatePropagation();
			this.save();
		});
	}

	destructor()
	{
		this.save();
	}

	save()
	{
		const img = document.createElement('img');
		img.src = this.saveData.img;
		img.addEventListener('load', () =>
		{
			const { height, width } = img;
			if (height !== width)
				MCutilities.createAlert('warning', document.getElementById('resource-alert'), this.lang.Plugin.Image.Explanation);
			else
				fs.writeFile(path.join(this.resPack, 'pack.mcmeta'), JSON.stringify(this.saveData.mcmeta, null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
				{
					if (err)
						throw new Error(err);
					if (path.join(this.resPack, 'pack.png') !== this.saveData.img)
						fs.copyFile(this.saveData.img, path.join(this.resPack, 'pack.png'), (_err) =>
						{
							if (_err)
								throw new Error(_err);
							MCutilities.createAlert('success', document.getElementById('resource-alert'), this.lang.General.Success);
						});
					else
						MCutilities.createAlert('success', document.getElementById('resource-alert'), this.lang.General.Success);
				});
		});
	}

	previewImage()
	{
		document.getElementById('root-pack').addEventListener('change', (e) =>
		{
			e.preventDefault();

			if (e.target.files.length === 0)
				return;
			if (e.target.files[0].type !== 'image/png')
			{
				MCutilities.createAlert('warning', document.getElementById('pack-alert'), this.lang.Plugin.Image.Explanation);
				return;
			}
			this.saveData.img = e.target.files[0].path;
			const src = URL.createObjectURL(e.target.files[0]);
			const preview = document.getElementById('root-packPreview');
			preview.src = src;

			const img = document.createElement('img');
			img.src = src;
			img.addEventListener('load', () =>
			{
				const { height, width } = img;
				if (height !== width)
					MCutilities.createAlert('warning', document.getElementById('pack-alert'), this.lang.Plugin.Image.Explanation);
			});
		});
	}
}

module.exports = Root;
