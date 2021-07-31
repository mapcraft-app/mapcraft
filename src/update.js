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
const copyFilePath = {
	"Cutscene": [path.join(LocalMapcraft.Mapcraft, 'data/mapcraft/functions/built_in/cutscene/main.mcfunction')],
	"Music": [path.join(LocalMapcraft.Mapcraft, 'data/mapcraft/functions/built_in/music/main.mcfunction')],
	"Trigger": [path.join(LocalMapcraft.Mapcraft, 'data/mapcraft/functions/built_in/trigger/zone/detect.mcfunction'), path.join(LocalMapcraft.Mapcraft, 'data/mapcraft/functions/built_in/trigger/zone/execute.mcfunction')]
}

function copyFile()
{
	for (let id in copyFilePath)
	{
		for (let el in copyFilePath[id])
		{
			fs.copyFileSync(copyFilePath[id][el], path.join(__dirname, 'temp', path.basename(copyFilePath[id][el])));
		}
	}
}
function pastFile()
{
	for (let id in copyFilePath)
	{
		for (let el in copyFilePath[id])
		{
			fs.copyFileSync(path.join(__dirname, 'temp', path.basename(copyFilePath[id][el])), copyFilePath[id][el]);
		}
	}
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
		let _data = {
			software: res1.data,
			datapack: res2.data,
			resourcepack: res3.data,
			count: 0
		};
		if (Object.keys(_data.software).length && _data.software.version !== this.APIVersion.software) _data.count++;
		if (Object.keys(_data.datapack).length && _data.datapack.version !== this.APIVersion.datapack) _data.count++;
		if (Object.keys(_data.resourcepack).length && _data.resourcepack.version !== this.APIVersion.resourcepack) _data.count++;
		this.json = _data;
	}

	async datapack()
	{
		fs.mkdir(path.join(__dirname, 'temp'), {recursive: false}, () => {
			const _path = path.join(__dirname, 'temp', json.datapack.version + '.zip');
			console.log("tata");
			download(json.datapack.url, _path, (err) => {
				if (err)
				{
					console.error(err);
					return ;
				}
				copyFile();
				let Resource = new AdmZip(_path);
				Resource.extractAllTo(LocalMapcraft.Mapcraft, true);
				pastFile();
			});
		});
	}
	async resourcepack()
	{
		fs.mkdir(path.join(__dirname, 'temp'), {recursive: false}, () => {
			const _path = path.join(__dirname, 'temp', json.resourcepack.version + '.zip');
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
		IPC.send('Update:make-update', "test");
		/*if (this._OSType === 'win32')
			this._url = this.json.windows.archive.url;
		else if (this._OSType === 'darwin')
			this._url = this.json.macOS.archive.url;
		else
			this._url = this.json.linux.archive.url;
		fs.mkdir(path.join(__dirname, 'temp'), {recursive: false}, (err) => {
			const _path = path.join(__dirname, 'temp', json.software.version + '.zip');
			download(json.software.url, _path, (err) => {
				if (err)
				{
					console.error(err);
					return ;
				}
				IPC.send('Update:make-update', _path);
			});
		});*/
	}
}

module.exports = Update;
