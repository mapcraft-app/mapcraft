const fs = require('fs');
const path = require('path');

class Root
{
	constructor()
	{
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
	}

	destructor()
	{
		this.save();
	}

	save()
	{
		this.saveData.mcmeta.description = document.getElementById('root-description').value;
		fs.writeFile(path.join(this.resPack, 'pack.mcmeta'), JSON.stringify(this.saveData, null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
		{
			if (err)
				throw new Error(err);
		});
		fs.copyFile(document.getElementById('root-packPreview').src, path.join(this.resPack, 'pack.png'), (err) =>
		{
			if (err)
				throw new Error(err);
		});
	}

	previewImage()
	{
		document.getElementById('root-pack').addEventListener('change', (e) =>
		{
			e.preventDefault();
			const src = URL.createObjectURL(e.target.files[0]);
			const preview = document.getElementById('root-packPreview');
			preview.src = src;
			const img = document.createElement('img');
			img.src = src;
			img.addEventListener('load', () =>
			{
				const { height, width } = img;
				if (height !== width)
					console.error('image is not cube');
				else
					console.log('image is a cube');
			});
		});
	}
}

module.exports = Root;
