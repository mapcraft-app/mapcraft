'use strict';
const path = require('path');
const OS = require('os');
const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');
const IPC = require('./dist/js/MCipc');
const MCutilities = require('./dist/js/MCutilities');

class Update {
	constructor()
	{
		let pack = JSON.parse(fs.readFileSync(path.join(__dirname, './manifest'), {encoding: 'utf-8', flag: 'r'}));
		this.APIVersion = pack.version;
		this._OSType = OS.platform();
		this.json;
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const temp_dir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp');
		if (!fs.existsSync(temp_dir)) fs.mkdirSync(temp_dir, {recursive: true});
	}
	getJson() { return this.json; }
	getCurrentVersion() { return this.APIVersion; }
	async checkUpdate()
	{
		//#region software
		const res1 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/software'
		});
		const res2 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/datapack'
		});
		const res3 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/resourcepack'
		});
		const res4 = await axios({
			method: 'get',
			url: 'https://api.mapcraft.app/update'
		});
		let _data = {
			software: res1.data,
			datapack: res2.data,
			resourcepack: res3.data,
			update: res1.data.update,
			updateProgram: res4.data,
			count: 0
		};
		if (Object.keys(_data.software).length && _data.software.version !== this.APIVersion.software) _data.count++;
		if (Object.keys(_data.datapack).length && _data.datapack.version !== this.APIVersion.datapack) _data.count++;
		if (Object.keys(_data.resourcepack).length && _data.resourcepack.version !== this.APIVersion.resourcepack) _data.count++;
		this.json = _data;
	}
	async addNecessaryTools()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		let ret = {data: false, res: false};
		const temp_dir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'addNecessaryTools');
		const datapack_path = path.join(temp_dir, 'datapacks.zip');
		const resourcepack_path = path.join(temp_dir, 'resourcepacks.zip');

		if (!fs.existsSync(temp_dir)) fs.mkdirSync(temp_dir, {recursive: true});
		if (!fs.existsSync(LocalMapcraft.Data.ResourcePack))
		{
			MCutilities.download('https://download.mapcraft.app/srcs/res/resourcepacks.zip', resourcepack_path, (err) => {
				if (err) { console.error(err); return ; }
				let Resource = new AdmZip(resourcepack_path);
				Resource.extractAllTo(LocalMapcraft.Data.ResourcePack, true);
				ret.data = true;
			});
		} else { ret.data = true; }
		if (!fs.existsSync(LocalMapcraft.Data.DataPack))
		{
			MCutilities.download('https://download.mapcraft.app/srcs/res/datapacks.zip', datapack_path, (err) => {
				if (err) { console.error(err); return ; }
				let Resource = new AdmZip(datapack_path);
				Resource.extractAllTo(LocalMapcraft.Data.DataPack, true);
				ret.res = true;
			});
		} else { ret.res = true; }

		let interval = setInterval(wait, 2000);
		function wait() {
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
		let ret = {data: false, res: false};
		const temp_dir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'installBase');
		const datapack_path = path.join(temp_dir, 'base_datapack.zip');
		const resourcepack_path = path.join(temp_dir, 'base_resourcepack.zip');

		if (!fs.existsSync(temp_dir)) fs.mkdirSync(temp_dir, {recursive: true});
		if (!fs.existsSync(LocalMapcraft.Mapcraft))
		{
			console.log(this.json.datapack.url, datapack_path);
			MCutilities.download(this.json.datapack.url, datapack_path, (err) => {
				if (err) { console.error(err); return ; }
				let Resource = new AdmZip(datapack_path);
				Resource.extractAllTo(LocalMapcraft.Mapcraft, true);
				ret.data = true;
			});
		} else { ret.data = true; }
		if (!fs.existsSync(path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft')))
		{
			console.log(this.json.resourcepack.url, resourcepack_path);
			MCutilities.download(this.json.resourcepack.url, resourcepack_path, (err) => {
				if (err) { console.error(err); return ; }
				let Resource = new AdmZip(resourcepack_path);
				Resource.extractAllTo(path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft'), true);
				ret.res = true;
			});
		} else { ret.res = true; }

		let interval = setInterval(wait, 2000);
		function wait() {
			if (ret.data === true && ret.res === true)
			{
				clearInterval(interval);
				fs.rmSync(temp_dir, {recursive: true, force: true});
				IPC.send('Start:is-selected-world');
			}
			else
				console.log('Base system not finish to download, retry in 2s');
		}
	}
	async datapack()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const temp_dir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'datapack');
		fs.mkdir(temp_dir, {recursive: true}, (err) => {
			const _path = path.join(temp_dir, this.json.datapack.version + '.zip');
			MCutilities.download(this.json.datapack.url, _path, (err) => {
				if (err) { console.error(err); return ; }
				let Resource = new AdmZip(_path);
				Resource.extractAllTo(LocalMapcraft.Mapcraft, true);
			});
		});
	}
	async resourcepack()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const temp_dir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'resourcepack');
		fs.mkdir(temp_dir, {recursive: true}, () => {
			const _path = path.join(temp_dir, this.json.resourcepack.version + '.zip');
			MCutilities.download(this.json.resourcepack.url, _path, (err) => {
				if (err) { console.error(err); return ; }
				let Resource = new AdmZip(_path);
				Resource.extractAllTo(path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft'), true);
			});
		});
	}
	updateManifest()
	{
		var data = JSON.parse(fs.readFileSync(path.join(__dirname, './manifest'), {encoding: 'utf-8', flag: 'r'}));
		data.version.datapack = this.json.datapack.version;
		data.version.resourcepack = this.json.resourcepack.version;
		data.version.software = this.json.software.version;
		data.version.update = this.json.updateProgram.version;
		fs.writeFileSync(path.join(__dirname, './manifest'), JSON.stringify(data, null, 4));
	}

	async software()
	{
		const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
		const temp_dir = path.join(LocalMapcraft.TempPath, 'mapcraftTemp', 'software');
		fs.mkdir(temp_dir, {recursive: true}, (err) => {
			let _download_url, _mapcraft_soft;
			if (OS.platform() === 'win32')
			{
				_download_url = this.json.software.windows.archive.url;
				_mapcraft_soft = path.join(__dirname, '../../../', 'mapcraft.exe');
			}
			else if (OS.platform() === 'darwin')
			{
				_download_url = this.json.software.darwin.archive.url;
				_mapcraft_soft = path.join(__dirname, '../../../', 'mapcraft');
			}
			else
			{
				_download_url = this.json.software.linux.archive.url;
				_mapcraft_soft = path.join(__dirname, '../../../', 'mapcraft');
			}
			const _path = path.join(temp_dir, 'update_archive.zip');
			MCutilities.download(_download_url, _path, (err) => {
				if (err) { console.error(err); return ; }
				IPC.send('Update:make-update', _mapcraft_soft, temp_dir, _path, path.join(__dirname, '../../../'));
			});
		});
	}
}

module.exports = Update;
