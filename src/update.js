'use strict';
const path = require('path');
const OS = require('os');
const fs = require('fs');
const http = require('http');
const https = require('https');
const axios = require('axios');
const AdmZip = require('adm-zip');
const IPC = require('./dist/js/MCipc');

const LocalMapcraft = JSON.parse(localStorage.getItem('Mapcraft'));

async function downloadSync(url, destination)
{
	const response = await axios({
		method: 'GET',
		url: url,
		responseType: 'stream'
	});
	response.data.pipe(fs.createWriteStream(destination));
	return new Promise((resolve, reject) => {
		response.data.on('end', () => {
			resolve();
		});
		response.data.on('error', () => {
			reject();
		});
	});
}

function download(url, destination, callback)
{
	const file = fs.createWriteStream(destination);
	let httpMethod;
	if (url.indexOf(('https://')) !== -1)
		httpMethod = https;
	else
		httpMethod = http;
	const request = httpMethod.get(url, (response) => {
		if (response.statusCode !== 200)
			return callback(response.statusCode + ' error to ' + url);
		response.pipe(file);
		file.on('finish', () => {
			file.close(callback);
		});
	});
	request.on('error', (err) => {
		fs.unlink(destination);
		callback(err.message);
	});
	file.on('error', (err) => {
		fs.unlink(destination);
		callback(err.message);
	});
}

class Update {
	constructor()
	{
		let pack = JSON.parse(fs.readFileSync(path.join(__dirname, './manifest'), {encoding: 'utf-8', flag: 'r'}));
		this.APIVersion = pack.version;
		this._OSType = OS.platform();
		this.json;
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
	async installBase()
	{
		await this.checkUpdate();
		let ret = {data: false, res: false};
		const temp_dir = path.join(__dirname, './temp');
		const datapack_path = path.join(temp_dir, this.json.datapack.version + '.zip');
		const resourcepack_path = path.join(temp_dir, this.json.resourcepack.version + '.zip');

		fs.mkdirSync(temp_dir, {recursive: true});
		if (!fs.existsSync(LocalMapcraft.Mapcraft))
		{
			download(this.json.datapack.url, datapack_path, (err) => {
				if (err) { console.error(err); return ; }
				let Resource = new AdmZip(datapack_path);
				Resource.extractAllTo(LocalMapcraft.Mapcraft, true);
				ret.data = true;
			});
		} else { ret.data = true; }
		if (!fs.existsSync(path.join(LocalMapcraft.SavePath, '../../resourcepacks/mapcraft')))
		{
			download(this.json.resourcepack.url, resourcepack_path, (err) => {
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
				console.log('Update executable not finish to download, retry in 2s');
		}
	}
	async datapack()
	{
		const temp_dir = path.join(__dirname, '../../../temp');
		fs.mkdir(temp_dir, {recursive: false}, (err) => {
			const _path = path.join(temp_dir, this.json.datapack.version + '.zip');
			download(this.json.datapack.url, _path, (err) => {
				if (err)
				{
					console.error(err);
					return ;
				}
				let Resource = new AdmZip(_path);
				Resource.extractAllTo(LocalMapcraft.Mapcraft, true);
			});
		});
	}
	async resourcepack()
	{
		const temp_dir = path.join(__dirname, '../../../temp');
		fs.mkdir(temp_dir, {recursive: false}, () => {
			const _path = path.join(temp_dir, this.json.resourcepack.version + '.zip');
			download(this.json.resourcepack.url, _path, (err) => {
				if (err)
				{
					console.error(err);
					return ;
				}
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
		const temp_dir = path.join(__dirname, '../../../temp');
		fs.mkdir(temp_dir, {recursive: false}, (err) => {
			let _download_url;
			if (OS.platform() === 'win32') _download_url = this.json.software.windows.archive.url;
			else if (OS.platform() === 'darwin') _download_url = this.json.software.darwin.archive.url;
			else _download_url = this.json.software.linux.archive.url;
			const _path = path.join(temp_dir, 'update_archive.zip');
			download(_download_url, _path, (err) => {
				if (err)
				{
					console.error(err);
					return ;
				}
				IPC.send('Update:make-update', temp_dir, _path, path.join(temp_dir, 'output'));
			});
		});
	}
}

module.exports = Update;
