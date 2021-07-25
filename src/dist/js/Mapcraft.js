const fs = require('fs');
const OS = require('os');
const path = require('path');
const Process = require('process');

// API const
const OSType = OS.platform();
const APIVersion = '0.0.1';
const DefaultLang = 'en_US';
const ComponentsLink = path.join(__dirname, '../template/Main/components.json');

class MC
{
	constructor()
	{
		if (!fs.existsSync('config.json'))
			this.ResetConfigFile();
	}
	ResetConfigFile()
	{
		let linkToGame;
		if (OS.platform() === 'win32')
			linkToGame =  Process.env.APPDATA;
		else if (OS.platform() === 'linux')
			linkToGame = Process.env.HOME;
		else if (OS.platform() === 'darwin')
			linkToGame = Process.env.HOME;
		let config = {
			Env: {
				OS: OSType,
				TempPath: OS.tmpdir(),
				GamePath: linkToGame,
				SavePath: null,
				Lang: DefaultLang,
				Components: ComponentsLink,
				APIVersion: APIVersion
			},
			Data: {
				ResourcePack: 'Mapcraft-resource',
				DataPack: 'Mapcraft-data'
			}
		}
		config.Env.GamePath = path.join(config.Env.GamePath + '/.minecraft');
		config.Env.SavePath = path.join(config.Env.GamePath + '/saves');
		fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
	}
	UpdateConfig(temp, data, save, lang, resourcepack, datapack)
	{
		let config = {
			Env: {
				OS: OSType,
				TempPath: temp,
				GamePath: data,
				SavePath: save,
				Lang: lang,
				Components: ComponentsLink,
				APIVersion: APIVersion
			},
			Data: {
				ResourcePack: resourcepack,
				DataPack: datapack
			}
		}
		fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
	}
	// Getters
	GetConfig()
	{
		return (JSON.parse(fs.readFileSync('config.json', 'utf-8')));
	}
	GetLang()
	{
		return (this.GetConfig().Env.Lang);
	}
}

module.exports = new MC();
