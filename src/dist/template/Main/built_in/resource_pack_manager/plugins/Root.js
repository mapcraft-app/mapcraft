const fs = require('fs');
const path = require('path');

const MAPCRAFT = JSON.parse(localStorage.getItem('Mapcraft')).Data.ResourcePack;
const defaultMCmeta = {
	pack: {
		pack_format: 8,
		description: 'Mapcraft-data resource pack',
	},
};
const saveData = {
	mcmeta: undefined,
	img: undefined,
};

class Root
{
	constructor()
	{
		this.previewImage();
		fs.readdir(MAPCRAFT, { encoding: 'utf-8', withFileTypes: false }, (err, files) =>
		{
			if (err)
				throw new Error(err);
			if (files.indexOf('pack.mcmeta') === -1)
				fs.writeFileSync(path.join(MAPCRAFT, 'pack.mcmeta'), JSON.stringify(defaultMCmeta, null, 4));
			if (files.indexOf('pack.png') === -1)
				fs.copyFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'img', 'icon', 'icon.png'), path.join(MAPCRAFT, 'pack.png'));
			saveData.mcmeta = JSON.parse(fs.readFileSync(path.join(MAPCRAFT, 'pack.mcmeta'), { encoding: 'utf-8', flag: 'r' }));
			saveData.img = path.join(MAPCRAFT, 'pack.png');
			document.getElementById('root-description').value = saveData.mcmeta.pack.description;
			document.getElementById('root-packPreview').src = saveData.img;
		});
	}

	destructor()
	{
		saveData.mcmeta.description = document.getElementById('root-description').value;
		fs.writeFile(path.join(MAPCRAFT, 'pack.mcmeta'), JSON.stringify(saveData, null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
		{
			if (err)
				throw new Error(err);
		});
		fs.copyFile(document.getElementById('root-packPreview').src, path.join(MAPCRAFT, 'pack.png'), (err) =>
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
