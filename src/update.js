const path = require('path');
const OS = require('os');
const fs = require('fs');
const axios = require('axios');
const { MCipc, MCutilities } = require('mapcraft-api');

const zipPath = (path.basename(process.env.AppPath) === 'app.asar')
	? path.join(process.env.AppPath, '..', 'app.asar.unpacked', 'node_modules', '7zip-min')
	: path.join(process.env.AppPath, 'node_modules', '7zip-min');
const _7zip = require(zipPath); // eslint-disable-line import/no-dynamic-require

class Update
{
	constructor()
	{
		const localMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const pack = {
			AppData: JSON.parse(fs.readFileSync(path.join(process.env.AppDataPath, 'manifest'), { encoding: 'utf-8', flag: 'r' })),
			Datapack: null,
			ResourcePack: null,
		};
		if (fs.existsSync(path.join(localMapcraft.Mapcraft, 'version'), { encoding: 'utf-8', flag: 'r' }))
			pack.Datapack = fs.readFileSync(path.join(localMapcraft.Mapcraft, 'version'), { encoding: 'utf-8', flag: 'r' });
		if (fs.existsSync(path.join(localMapcraft.Data.ResourcePack, '..', 'mapcraft', 'version'), { encoding: 'utf-8', flag: 'r' }))
			pack.ResourcePack = fs.readFileSync(path.join(localMapcraft.Data.ResourcePack, '..', 'mapcraft', 'version'), { encoding: 'utf-8', flag: 'r' });
		this.APIVersion = {
			datapack: String(pack.Datapack),
			resourcepack: String(pack.ResourcePack),
			software: String(pack.AppData.version.software),
		};
		this._OSType = OS.platform();
		this.json = {};
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const tempDir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp');
		if (!fs.existsSync(tempDir))
			fs.mkdirSync(tempDir, { recursive: true });
	}

	getJson()
	{
		return this.json;
	}

	getCurrentVersion()
	{
		return this.APIVersion;
	}

	async checkUpdate()
	{
		//#region  software
		const res1 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/software',
		});
		const res2 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/datapack',
		});
		const res3 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/resourcepack',
		});
		const res4 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/update',
		});
		const _data = {
			software: res1.data,
			datapack: res2.data,
			resourcepack: res3.data,
			update: res1.data.update,
			updateProgram: res4.data,
			count: 0,
		};
		if (Object.keys(_data.software).length && _data.software.version !== this.APIVersion.software)
			_data.count++;

		console.log(_data.datapack.version, this.APIVersion.datapack);
		if (Object.keys(_data.datapack).length && _data.datapack.version !== this.APIVersion.datapack)
			_data.count++;
		if (Object.keys(_data.resourcepack).length && _data.resourcepack.version !== this.APIVersion.resourcepack)
			_data.count++;
		this.json = _data;
	}

	async addNecessaryTools()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const ret = { data: false, res: false };
		const tempDir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'addNecessaryTools');
		const datapackPath = path.join(tempDir, 'datapacks.zip');
		const resourcepackPath = path.join(tempDir, 'resourcepacks.zip');

		if (!fs.existsSync(tempDir))
			fs.mkdirSync(tempDir, { recursive: true });
		if (!fs.existsSync(LocalMapcraft.Data.ResourcePack))
			MCutilities.download('https://download.mapcraft.app/srcs/res/resourcepacks.zip', resourcepackPath, (err) =>
			{
				if (err)
				{
					console.error(err);
					return;
				}
				_7zip.unpack(resourcepackPath, LocalMapcraft.Data.ResourcePack, (_err) =>
				{
					if (_err)
						throw new Error(_err);
					ret.data = true;
				});
			});
		else
			ret.data = true;
		if (!fs.existsSync(LocalMapcraft.Data.DataPack))
			MCutilities.download('https://download.mapcraft.app/srcs/res/datapacks.zip', datapackPath, (err) =>
			{
				if (err)
				{
					console.error(err);
					return;
				}
				_7zip.unpack(datapackPath, LocalMapcraft.Data.DataPack, (_err) =>
				{
					if (_err)
						throw new Error(_err);
					ret.res = true;
				});
			});
		else
			ret.res = true;
		const interval = setInterval(wait, 2000); // eslint-disable-line
		function wait()
		{
			if (ret.data === true && ret.res === true)
				clearInterval(interval);
			else
				console.log('Necessary tools not finish to download, retry in 2s');
		}
	}

	async installBase()
	{
		await this.checkUpdate();
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const ret = { data: false, res: false };
		const tempDir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'installBase');
		const datapackPath = path.join(tempDir, 'base_datapack.zip');
		const resourcepackPath = path.join(tempDir, 'base_resourcepack.zip');

		if (!fs.existsSync(tempDir))
			fs.mkdirSync(tempDir, { recursive: true });
		if (!fs.existsSync(LocalMapcraft.Mapcraft))
		{
			console.log(this.json.datapack.url, datapackPath);
			MCutilities.download(this.json.datapack.url, datapackPath, (err) =>
			{
				if (err)
				{
					console.error(err);
					return;
				}
				_7zip.unpack(datapackPath, LocalMapcraft.Mapcraft, (_err) =>
				{
					if (_err)
						throw new Error(_err);
					ret.data = true;
				});
			});
		}
		else
		{
			ret.data = true;
		}
		if (!fs.existsSync(path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft')))
		{
			console.log(this.json.resourcepack.url, resourcepackPath);
			MCutilities.download(this.json.resourcepack.url, resourcepackPath, (err) =>
			{
				if (err)
				{
					console.error(err);
					return;
				}
				_7zip.unpack(resourcepackPath, path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft'), (_err) =>
				{
					if (_err)
						throw new Error(_err);
					ret.res = true;
				});
			});
		}
		else
		{
			ret.res = true;
		}

		const interval = setInterval(wait, 2000);  // eslint-disable-line
		function wait()
		{
			if (ret.data === true && ret.res === true)
			{
				clearInterval(interval);
				fs.rmSync(tempDir, { recursive: true, force: true });
				MCipc.send('Start:is-selected-world');
			}
			else
			{
				console.log('Base system not finish to download, retry in 2s');
			}
		}
	}

	async datapack()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const tempDir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'datapack');
		const promise = new Promise((resolve, reject) =>
		{
			fs.mkdir(tempDir, { recursive: true }, () =>
			{
				const _path = path.join(tempDir, `${this.json.datapack.version}.zip`);
				MCutilities.download(this.json.datapack.url, _path, (err) =>
				{
					if (err)
						reject(err.message);
					_7zip.unpack(_path, LocalMapcraft.Mapcraft, (_err) =>
					{
						if (_err)
							throw new Error(_err);
						resolve('200');
					});
				});
			});
		});
		return Promise.resolve(await promise);
	}

	async resourcepack()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const tempDir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'resourcepack');
		const promise = new Promise((resolve, reject) =>
		{
			fs.mkdir(tempDir, { recursive: true }, () =>
			{
				const _path = path.join(tempDir, `${this.json.resourcepack.version}.zip`);
				MCutilities.download(this.json.resourcepack.url, _path, (err) =>
				{
					if (err)
						reject(err.message);
					_7zip.unpack(_path, path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft'), (_err) =>
					{
						if (_err)
							throw new Error(_err);
						resolve('200');
					});
				});
			});
		});
		return Promise.resolve(await promise);
	}

	updateManifest()
	{
		const data = JSON.parse(fs.readFileSync(path.join(process.env.AppDataPath, 'manifest'), { encoding: 'utf-8', flag: 'r' }));
		data.version.software = this.json.software.version;
		data.version.update = this.json.updateProgram.version;
		fs.writeFileSync(path.join(process.env.AppDataPath, 'manifest'), JSON.stringify(data, null, 4));
	}

	async software()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const tempDir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'software');
		fs.mkdir(tempDir, { recursive: true }, () =>
		{
			let downloadUrl = String;
			let mapcraftSoft = String;
			if (OS.platform() === 'win32')
			{
				downloadUrl = this.json.software.windows.archive.url;
				mapcraftSoft = path.join(__dirname, '../../../', 'mapcraft.exe');
			}
			else if (OS.platform() === 'darwin')
			{
				downloadUrl = this.json.software.darwin.archive.url;
				mapcraftSoft = path.join(__dirname, '../../../', 'mapcraft');
			}
			else
			{
				downloadUrl = this.json.software.linux.archive.url;
				mapcraftSoft = path.join(__dirname, '../../../', 'mapcraft');
			}
			const _path = path.join(tempDir, 'update_archive.zip');
			MCutilities.download(downloadUrl, _path, (err) =>
			{
				if (err)
				{
					console.error(err);
					return;
				}
				MCipc.send('Update:make-update', mapcraftSoft, tempDir, _path, path.join(__dirname, '../../../'));
			});
		});
	}
}

module.exports = Update;
