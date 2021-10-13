const fs = require('fs');
const OS = require('os');
const path = require('path');
const Process = require('process');

// API const
const OSType = OS.platform();
const pack = JSON.parse(fs.readFileSync(path.join(__dirname, '../../manifest'), {encoding: 'utf-8', flag: 'r'}));
const APIVersion = pack.version;
const DefaultLang = pack.default_lang;
const ComponentsLink = path.join(__dirname, '../template/Main/components.json');

class MC
{
	constructor()
	{
		if (!fs.existsSync('config.json'))
			this.ResetConfigFile();
		this.UpdateAPIVersion();
	}
	UpdateAPIVersion()
	{
		let data = JSON.parse(fs.readFileSync(path.join(process.env.AppDataPath, 'config.json'), {encoding: 'utf-8', flag: 'r'}));
		data.Env.APIVersion = APIVersion;
		fs.writeFileSync(path.join(process.env.AppDataPath, 'config.json'), JSON.stringify(data, null, 4), {encoding: 'utf-8', flag: 'w'});
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
				AppDataPath : process.env.AppDataPath,
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
		fs.writeFileSync(path.join(process.env.AppDataPath, 'config.json'), JSON.stringify(config, null, 4), {encoding: 'utf-8', flag: 'w'});
	}
	UpdateConfig(temp, data, save, lang, resourcepack, datapack)
	{
		let config = {
			Env: {
				OS: OSType,
				TempPath: temp,
				AppDataPath : process.env.AppDataPath,
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
		fs.writeFileSync(path.join(process.env.AppDataPath, 'config.json'), JSON.stringify(config, null, 4), {encoding: 'utf-8', flag: 'w'});
	}
	// Getters
	GetConfig()
	{
		return (JSON.parse(fs.readFileSync(path.join(process.env.AppDataPath, 'config.json'), {encoding: 'utf-8', flag: 'r'})));
	}
	GetLang()
	{
		return (this.GetConfig().Env.Lang);
	}
}

module.exports = new MC();
