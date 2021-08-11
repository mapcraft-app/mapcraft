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
		let _data = {
			software: res1.data,
			datapack: res2.data,
			resourcepack: res3.data,
			update: res1.data.update,
			count: 0
		};
		if (Object.keys(_data.software).length && _data.software.version !== this.APIVersion.software) _data.count++;
		if (Object.keys(_data.datapack).length && _data.datapack.version !== this.APIVersion.datapack) _data.count++;
		if (Object.keys(_data.resourcepack).length && _data.resourcepack.version !== this.APIVersion.resourcepack) _data.count++;
		this.json = _data;
	}

	async datapack()
	{
		const temp_dir = path.join(__dirname, '../../../temp');
		fs.mkdir(temp_dir, {recursive: false}, (err) => {
			const _path = path.join(temp_dir, json.datapack.version + '.zip');
			download(json.datapack.url, _path, (err) => {
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
			const _path = path.join(temp_dir, json.resourcepack.version + '.zip');
			download(json.resourcepack.url, _path, (err) => {
				if (err)
				{
					console.error(err);
					return ;
				}
				let Resource = new AdmZip(_path);
				Resource.extractAllTo(path.join(LocalMapcraft.SavePath, '../../resourcepacks/Mapcraft'), true);
			});
		});
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
