const { Mapcraft, MCutilities, MCtemplate } = require('mapcraft-api');
const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

//const Drawing = require(path.join(globalThis.src.js, 'Drawing', 'drawing'));

const LANG = MCutilities.getLang(__dirname, Mapcraft.config.Env.Lang);
const TEMPLATE = new MCtemplate(path.join(__dirname, 'template'));
let content;

class Component
{
	static main()
	{
		content = document.getElementById('content');
		TEMPLATE.render(content, 'resource_pack_manager.tp', LANG.Data);
		TEMPLATE.render(content.querySelector('#pack-mcmeta'), 'pack_mcmeta.tp', null);
		TEMPLATE.updateLang(content, LANG.Data);
		this.#unpackResource();
	}

	static #unpackResource()
	{
		const archivePath = path.join(Mapcraft.config.Env.GamePath, 'versions');
		const baseVersion = Mapcraft.config.Minecraft.SelectedVersion;
		fsPromise.readdir(archivePath, { encoding: 'utf-8', withFileTypes: true })
			.then((files) =>
			{
				const regex = new RegExp(`${baseVersion}(?!-)`);
				const correctVersion = [];
				for (const file of files)
					if (file.isDirectory() && regex.test(file.name))
						correctVersion.push(file.name.split('.'));
				return correctVersion.sort().map((el) => el.join('.'));
			})
			.then((versions) =>
			{
				content.querySelector('.version #print-version').innerText = versions[versions.length - 1];
			});
	}
}

module.exports = Component;
