const fs = require('fs');
const path = require('path');
const JsonABC = require('jsonabc');
const MC = require('../../../../js/Mapcraft');
const IPC = require('../../../../js/MCipc');
const Music = require('../../../../js/built_in/Music');
const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);

const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const SoundsJsonLink = path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft', 'sounds.json');
const SoundsLink = path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds');
const Namespace = 'mapcraft:'

var MusicID = 0;

const WorkProgress = {
	open: () => {
		IPC.send('WorkProgress:signal-open-modal');
	},
	close: () => {
		IPC.send('WorkProgress:signal-close-modal');
	}
}

function CreateAlert(type, DOMelement, str)
{
	let alert = document.createElement('div');
	alert.classList.add('uk-alert-' + type);
	alert.setAttribute('uk-alert', '');
	let closeButton = document.createElement('a');
	closeButton.classList.add('uk-alert-close');
	closeButton.setAttribute('uk-close', '');
	let text = document.createElement('p').appendChild(document.createTextNode(str));
	alert.appendChild(closeButton);
	alert.appendChild(text);
	DOMelement.appendChild(alert);
}

class MusicComponent
{
	static main()
	{
		Template.render(document.getElementById('content'), 'music.tp', null);

		Template.updateLang(document.getElementById('content'), MCplugin.Lang('Music').Data);
		this.createForm();
		DeleteMusic();
	}
	static createForm()
	{
		Template.render(document.getElementById('ModalAddMusic'), 'music_form_create.tp', null);
		Template.updateLang(document.getElementById('ModalAddMusic'), MCplugin.Lang('Music').Data);
		MusicForm();
		
	}
	static musicList(isReload = false)
	{
		const IsExist = (json, key, ret = 0) => {
			if (json.hasOwnProperty(key))
			{
				if (!ret)
					return (true);
				let Value = eval('json.' + key);
				if (typeof(Value) === 'boolean')
				{
					if (Value)
						Value = '<span class="uk-label uk-label-success boolean-badge" uk-icon="check" uk-tooltip="title: true; pos: right"></span>';
					else
						Value = '<span class="uk-label uk-label-danger boolean-badge" uk-icon="ban" uk-tooltip="title: false; pos: right"></span>';
				}
				return (Template.parseRaw('<li>{Object}: {Value}</li>', {Object: key, Value: Value}))
			}
			return (false);
		}

		fs.readFile(SoundsJsonLink, 'utf-8', (err, data) => {
			if (err)
			{
				CreateAlert('danger', document.getElementById('music-error'), 'sounds.json : ' + err);
				return ;
			}
			try {
				data = JSON.parse(data.trim());
				data = JsonABC.sortObj(data);
			} catch (err) {
				CreateAlert('warning', document.getElementById('music-error'), 'sounds.json : ' + err);
				return ;
			}

			let HTML = '';
			let Link = '';
			let ID = 0;
			MusicID = 0;
			for (let i in data)
			{
				let HTMLlist = '';
				if (IsExist(data[i], 'id'))
				{
					HTMLlist += IsExist(data[i], 'id', true);
					ID = data[i].id;
					if (parseInt(ID, 10) > MusicID)
						MusicID = parseInt(ID, 10);
				}
				if (IsExist(data[i], 'category'))
					HTMLlist += IsExist(data[i], 'category', true);
				if (IsExist(data[i], 'replace'))
					HTMLlist += IsExist(data[i], 'replace', true);
				if (IsExist(data[i], 'subtitle'))
					HTMLlist += IsExist(data[i], 'subtitle', true);
				if (data[i].hasOwnProperty('sounds') && Array.isArray(data[i].sounds))
				{
					HTMLlist += '<li class="uk-margin-left"><ul uk-accordion>';
					let Sounds = data[i].sounds;
					let SoundList = '';
					let SoundArray = new Array();
					for (let i in Sounds)
					{
						if (typeof(Sounds[i]) === 'object')
						{
							if (IsExist(Sounds[i], 'name'))
							{
								Link = Sounds[i].name.replace(/(.*):/, '');
								SoundList += IsExist(Sounds[i], 'name', true);
							}
							if (IsExist(Sounds[i], 'volume'))
								SoundList += IsExist(Sounds[i], 'volume', true);
							if (IsExist(Sounds[i], 'pitch'))
								SoundList += IsExist(Sounds[i], 'pitch', true);
							if (IsExist(Sounds[i], 'weight'))
								SoundList += IsExist(Sounds[i], 'weight', true);
							if (IsExist(Sounds[i], 'stream'))
								SoundList += IsExist(Sounds[i], 'stream', true);
							if (IsExist(Sounds[i], 'attenuation_distance'))
								SoundList += IsExist(Sounds[i], 'attenuation_distance', true);
							if (IsExist(Sounds[i], 'preload'))
								SoundList += IsExist(Sounds[i], 'preload', true);
							if (IsExist(Sounds[i], 'type'))
								SoundList += IsExist(Sounds[i], 'type', true);
						}
						else
							SoundArray.push(Sounds[i]);
					}
					if (SoundArray)
					{
						SoundList += '<li><ul class="uk-list uk-list-square">';
						for (let i in SoundArray)
							SoundList += '<li>'+ SoundArray[i] +'</li>';
						SoundList += '</ul></li>';
					}
					HTMLlist += Template.parseRaw(Template.getRaw('music_list.tp'), {Name: 'sounds', List: SoundList}) + '</ul>';
				}
				let Class = '';
				if (isReload && document.getElementById('music_player').getAttribute('name') === i)
					Class = 'class="uk-open"';
				HTML += Template.parseRaw(Template.getRaw('music_list.tp'), {Name: i, Link: Link, ID: ID, Class: Class, List: HTMLlist});
			}
			Template.renderRaw(document.getElementById('sound-list'), HTML, 'music_list.tp', null);
			PrintSoundElement();
			SubmitForm();
		});
	}
	static draw()
	{
		this.main();
		this.musicList();
	}
}

function MusicForm()
{
	document.querySelector('#add-music-form-Directory-click').addEventListener('click', () => {
		let value = document.getElementById('add-music-form-Directory').value;
		if (!value)
			value = path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds');
		else
			value = path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds', value);
		IPC.send('Dialog:open-directory', 'add-music-form-Directory', value);
	});
	IPC.receive('Dialog:selected-directory', (data, element) => {
		let BaseLink = path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds');
		BaseLink = BaseLink.replace(/(\/)/g, '\/\/');
		BaseLink = BaseLink.replace(/(\\)/g, '\\\\');
		const regex = new RegExp('(' + BaseLink + ')', 'g');
		if (regex.test(data.filePaths[0]))
		{
			document.getElementById('add-music-form-Directory-Error').style.display = 'none';
			if (data.canceled === false)
				document.getElementById(element).value = data.filePaths[0].replace(regex, '');
		}
		else if (data.filePaths[0])
			document.getElementById('add-music-form-Directory-Error').style.display = 'block';
	});

	document.querySelector('#add-music-form').addEventListener('submit', (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		const DefaultID = 'add-music-form-';
		const [file] = event.target[DefaultID +'Upload'].files;
		const Name = event.target[DefaultID +'Name'].value;
		const JSONDirectory = (event.target[DefaultID +'Directory'].value.replace(/(\\)/g, '/')).replace(/^\//, '');
		const Directory = path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds', event.target[DefaultID +'Directory'].value);
		let sounds = fs.readFileSync(path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds.json'), 'utf-8');
		try { sounds = JSON.parse(sounds.trim()) }
		catch (err) {
			CreateAlert('warning', document.getElementById('ModalAddMusicError'), 'sounds.json : ' + err);
			return ;
		}
		//#region Check error
		const Error = MCplugin.Lang('Music').Data.Modal.Error;
		let isError = false;
		if (!file || file.type !== 'audio/ogg' || path.extname(file.name) !== '.ogg')
		{
			if (!file)
				CreateAlert('warning', document.getElementById('ModalAddMusicError'), Error.NoMusic);
			else if (file.type !== 'audio/ogg')
				CreateAlert('warning', document.getElementById('ModalAddMusicError'), Error.NoOGG);
			else if (path.extname(file.name) !== '.ogg')
				CreateAlert('warning', document.getElementById('ModalAddMusicError'), Error.IncorrectOGG);
			isError = true;
		}
		if (!Name)
		{
			CreateAlert('warning', document.getElementById('ModalAddMusicError'), Error.NoName);
			isError = true;
		}
		else if (!Name.match(/^[a-z0-9_]+$/i))
		{
			CreateAlert('warning', document.getElementById('ModalAddMusicError'), Error.ForbiddenName);
			isError = true;
		}
		if (!fs.existsSync(Directory))
		{
			CreateAlert('warning', document.getElementById('ModalAddMusicError'), Error.UnknownDir);
			isError = true;
		}
		let BaseLink = path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds');
		BaseLink = BaseLink.replace(/(\/)/g, '\/\/');
		BaseLink = BaseLink.replace(/(\\)/g, '\\\\');
		const regex = new RegExp('(' + BaseLink + ')', 'g');
		if (!regex.test(Directory))
		{
			CreateAlert('warning', document.getElementById('ModalAddMusicError'), Error.UnknownDir);
			isError = true;
		}
		if (sounds.hasOwnProperty(Name))
		{
			CreateAlert('warning', document.getElementById('ModalAddMusicError'), MCplugin.Lang('Music').Data.Modal.IncorrectPath);
			isError = true;
		}
		if (isError)
			return ;
		//#endregion

		//#region Add Music
		++MusicID;
		const NewName = Namespace + ((!JSONDirectory) ? (Name) : (JSONDirectory + '/' + Name));
		sounds[Name] = {
			id: parseInt(MusicID, 10),
			sounds: [
				{
					name: NewName
				}
			]
		};
		JsonABC.sortObj(sounds);
		fs.writeFile(path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds.json'), JSON.stringify(sounds, null, 4), 'utf-8', (err) => {
			if (err)
			{
				CreateAlert('danger', document.getElementById('ModalAddMusicError'), err);
				return ;
			}
		});
		fs.copyFile(file.path, path.join(Directory, Name + '.ogg'), (err) => {
			if (err)
			{
				CreateAlert('danger', document.getElementById('ModalAddMusicError'), err);
				return ;
			}

			//MusicModalPreview
			const MusicDuration = Math.round(document.getElementById('MusicModalPreview').duration) * 20;
			Music.CreateMusic(parseInt(MusicID, 10), Name, 'none', MusicDuration, false);
			MusicComponent.musicList();
			MusicComponent.createForm();
		});
		//#endregion
	});
}

function PrintSoundElement()
{
	for (let input of document.querySelectorAll('ul[id="sound-list"] > li'))
	{
		input.addEventListener('click', (event) => {
			const MusicName = input.getAttribute('music');
			
			if (music_player.getAttribute('name') === MusicName)
				return ;
			music_player.setAttribute('name', MusicName);
			music_player.src = path.join(SoundsLink, input.getAttribute('link').replace(/(.*):/, '') + '.ogg');
			let data = fs.readFileSync(SoundsJsonLink, 'utf-8');
			data = JSON.parse(data.trim())[MusicName];
			let Form = new GenerateForm((data.hasOwnProperty('id')) ? (data.id) : (null));
			Form.CreateForm(MusicName, data);
			document.getElementById('name-span').innerText = document.getElementById('name').value.match(/(.*):/)[0];
			document.getElementById('name').value = document.getElementById('name').value.replace(/(.*):/, '');
			document.getElementById('music-delete-modal').style.display = 'block';
		
			//#region Update Name of file in live
			document.getElementById('Sound_Name').addEventListener('input', (event) => {
				if (!event.target.value.match(/^[a-z0-9_]+$/i))
					document.getElementById('Sound_Name-Error').style.display = 'block';
				else
				{
					document.getElementById('Sound_Name-Error').style.display = 'none';
					let newName = document.getElementById('Sound_Name').value;
					let Oldname = document.getElementById('name').value.split('/');
					Oldname[Oldname.length - 1] = newName;
					document.getElementById('name').value = Oldname.join('/');
				}
			});
			document.getElementById('name').addEventListener('input', (event) => {
				if (!event.target.value.match(/^[a-z0-9_/]+$/i))
					document.getElementById('name-Error').style.display = 'block';
				else
				{
					document.getElementById('name-Error').style.display = 'none';
					let Oldname = document.getElementById('name').value.split('/');
					document.getElementById('Sound_Name').value = Oldname[Oldname.length - 1];
				}
			});
		//#endregion
		});
	}
	
}

function SubmitForm()
{
	document.getElementById('music-form').addEventListener('submit', (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
	//#region Init
		WorkProgress.open();
		
		const MusicDuration = Math.round(document.getElementById('music_player').duration) * 20;

		function ScreenError(type, err)
		{
			CreateAlert(type, document.getElementById('music-error'), err);
			WorkProgress.close();
		}
		
		let LinkTemp = {
			Old: document.querySelector('li[music="'+ document.getElementById('music_player').getAttribute('name') +'"]').getAttribute('link'),
			New: event.target['name'].value
		}
		let NewID = document.querySelector('li[music="'+ document.getElementById('music_player').getAttribute('name') +'"]').getAttribute('id');
		NewID = parseInt(NewID, 10);
		
		let Vars = {
			id: NewID,
			duration: MusicDuration,
			FileName: {
				NameIsChanging: false,
				Old: document.getElementById('music_player').getAttribute('name'),
				New: event.target['Sound_Name'].value
			},
			MusicLink: {
				Old: LinkTemp.Old,
				New: LinkTemp.New
			},
			FileLink: {
				Sounds: SoundsJsonLink,
				Old: path.join(SoundsLink, LinkTemp.Old + '.ogg'),
				New: path.join(SoundsLink, LinkTemp.New + '.ogg')
			},
			JSON: {
				Old: JSON.parse(fs.readFileSync(SoundsJsonLink, 'utf-8').trim()),
				New : {}
			}
		}
		if (Vars.FileName.Old !== Vars.FileName.New)
			Vars.FileName.NameIsChanging = true;
	//#endregion
	
	//#region Check value
		const Error = MCplugin.Lang('Music').Data.Modal.Error;
		if (!Vars.FileName.Old || !Vars.FileName.Old.match(/^[a-z0-9_]+$/i))
		{
			let str = (!Vars.FileName.Old) ? (Error.FileName.NotExist) : (Error.FileName.ForbiddenCharacters);
			ScreenError('warning', str);
			return ;
		}
		if (!Vars.FileName.New || !Vars.FileName.New.match(/^[a-z0-9_]+$/i))
		{
			let str = (!Vars.FileName.Old) ? (Error.FileName.NotExist) : (Error.FileName.ForbiddenCharacters);
			ScreenError('warning', str);
			return ;
		}
		try { fs.accessSync(Vars.FileLink.Old) }
		catch (err) {
			ScreenError('warning', Error.FileLink + '.ogg not found');
			return ;
		}
		if (!Vars.JSON.Old)
		{
			ScreenError('warning', Error.SoundsJson);
			return ;
		}
	//#endregion

	//#region Remove song
		const AudioPlayer = document.getElementById('music_player');
		AudioPlayer.pause();
		AudioPlayer.currentTime = 0;
		AudioPlayer.setAttribute('src', '');
	//#endregion

	//#region Create new json
		Vars.JSON.New['id'] = Vars.id;
		if (event.target['category'].value !== 'none')
			Vars.JSON.New['category'] = event.target['category'].value;
		if (event.target['replace'].checked)
			Vars.JSON.New['replace'] = event.target['replace'].checked;
		if (event.target['subtitle'].value)
			Vars.JSON.New['subtitle'] = event.target['subtitle'].value;
		
		Vars.JSON.New['sounds'] = [], Vars.JSON.New['sounds'][0] = {};
		if (event.target['attenuation_distance'].value && parseFloat(event.target['attenuation_distance'].value) !== 16)
			Vars.JSON.New.sounds[0]['attenuation_distance'] = parseFloat(event.target['attenuation_distance'].value);
		Vars.JSON.New.sounds[0]['name'] = Namespace + event.target['name'].value;
		if (event.target['pitch'].value && parseFloat(event.target['pitch'].value) !== 1)
			Vars.JSON.New.sounds[0]['pitch'] = parseFloat(event.target['pitch'].value);
		if (event.target['preload'].checked)
			Vars.JSON.New.sounds[0]['preload'] = event.target['preload'].checked;
		if (event.target['stream'].checked)
			Vars.JSON.New.sounds[0]['stream'] = event.target['stream'].checked;
		if (event.target['type'].value && event.target['type'].value !== 'sound')
			Vars.JSON.New.sounds[0]['type'] = event.target['type'].value;
		if (event.target['volume'].value && parseFloat(event.target['volume'].value) !== 1)
			Vars.JSON.New.sounds[0]['volume'] = parseFloat(event.target['volume'].value);
		if (event.target['weight'].value && parseFloat(event.target['weight'].value) !== 1)
			Vars.JSON.New.sounds[0]['weight'] = parseFloat(event.target['weight'].value);
	//#endregion
	
	//#region Modify
		if (Vars.FileName.NameIsChanging)
		{
			delete Vars.JSON.Old[Vars.FileName.Old];
			//#region Wait lock for make modification
			let RepeatInterval = setInterval(RenameFile(), 100);
			function RenameFile()
			{
				fs.open(Vars.FileLink.Old, 'r+', (err, fd) => {
					if (err && err.code === 'EBUSY')
						;
					else if (err && err.code === 'ENOENT')
						clearInterval(RepeatInterval);
					else
					{
						fs.close(fd, () => {
							fs.rename(Vars.FileLink.Old, Vars.FileLink.New, (err) => {
								if (err)
									console.error(err);
								AudioPlayer.setAttribute('src', Vars.FileLink.New);
								clearInterval(RepeatInterval);
							});
						});
					}
				});
			}
			//#endregion
		}
		Vars.JSON.Old[Vars.FileName.New] = Vars.JSON.New;
		Vars.JSON.Old = JsonABC.sortObj(Vars.JSON.Old);
		
		let FD = fs.openSync(Vars.FileLink.Sounds, 'w+');
		fs.writeFileSync(FD, JSON.stringify(Vars.JSON.Old, null, 4), { encoding: 'utf-8', mode: 0755 });
		fs.closeSync(FD);
		
		Music.CreateMusic(Vars.id, Vars.FileName.New, event.target['category'].value, Vars.duration, true);

		AudioPlayer.setAttribute('name', Vars.FileName.New);
		MusicComponent.musicList(true);
		CreateAlert('success', document.getElementById('music-error'), MCplugin.Lang('Music').Data.Success);
		WorkProgress.close();
	//#endregion
	});
}

function DeleteMusic()
{
	const Error = (err) => {
		if (err)
		{
			CreateAlert('danger', document.getElementById('modal-delete-error'), err);
			return (true);
		}
		return (false);
	}
	
	document.getElementById('music-delete-ok').addEventListener('click', (event) => {
		const Name = document.getElementById('music_player').getAttribute('name');
		const Link = document.getElementById('music_player').getAttribute('src');
		fs.readFile(SoundsJsonLink, 'utf-8', (err, data) => {
			if (Error(err))
				return ;
			try {
				data = JSON.parse(data.trim());
			} catch (err) {
				CreateAlert('warning', document.getElementById('modal-delete-error'), 'sounds.json : ' + err);
				return ;
			}
			const ID = data[Name].id;
			delete data[Name];
			fs.unlink(Link, (err) => {
				if (Error(err))
					return ;
			});
			fs.writeFile(path.join(Mapcraft.Data.ResourcePack, 'assets/mapcraft/sounds.json'), JSON.stringify(data, null, 4), 'utf-8', (err) => {
				if (Error(err))
					return ;
				document.getElementById('music-form').innerHTML = '';
				document.getElementById('music-delete-modal').style.display = 'none';
				document.getElementById('music_player').setAttribute('name', '');
				document.getElementById('music_player').setAttribute('src', '');
				Music.RemoveMusic(ID);
				MusicComponent.musicList();
			});
		});
	});
}

class GenerateForm
{
	constructor(ID)
	{
		const GenerateCommand = (ID) ? ('/scoreboard players set @s MC_Music '+ ID.toString()) : (null);
		this.FromStructure = JSON.parse(fs.readFileSync(path.join(__dirname, 'form_structure.json'), 'utf-8'));
		this.HTML = Template.parseRaw(Template.getRaw('music_form_id.tp'), {ID: 'ID_File', Copy: MCplugin.Lang('Music').Data.ClickCopy, Command: GenerateCommand});
		this.HTML += Template.parseRaw(Template.getRaw('music_form_input.tp'), {ID: 'Sound_Name', Name: 'Sound Name', Placeholder: ''});
		this.HTML += '<hr class="uk-divider-icon">';
	}
	
	CreateForm(MusicName, MusicJson)
	{
		for (let key in this.FromStructure)
		{
			if (Object.prototype.toString.call(this.FromStructure[key]) === '[object Array]')
				this.Redirect(key, this.FromStructure[key][0], this.FromStructure[key]);
			else
				this.Redirect(key, this.FromStructure[key], null);
		}
		for (let key in this.FromStructure.sounds)
		{
			if (Object.prototype.toString.call(this.FromStructure.sounds[key]) === '[object Array]')
				this.Redirect(key, this.FromStructure.sounds[key][0], this.FromStructure.sounds[key]);
			else
				this.Redirect(key, this.FromStructure.sounds[key], null);
		}
		this.HTML += '<div class="uk-flex uk-flex-right"><button type="submit" class="uk-button uk-button-primary" lang="Submit"></button></div>';
		Template.renderRaw(document.getElementById('music-form'), this.HTML, 'music_form.tp', null);
		Template.updateLang(document.getElementById('music-form'), MCplugin.Lang('Music').Data);
		document.querySelectorAll('input[type="range"]').forEach((element) => {
			document.getElementById(element.id + '-badge').innerText = element.value;
			element.addEventListener('input', () => {
				document.getElementById(element.id + '-badge').innerText = element.value;
			})
		});

		function copyToClipboard(text) {
			const listener = function(ev) {
				ev.preventDefault();
				ev.clipboardData.setData('text/plain', text);
			};
			document.addEventListener('copy', listener);
			document.execCommand('copy');
			document.removeEventListener('copy', listener);
		}
		document.querySelector('div[id="MusicID"]').addEventListener('click', () => {
			copyToClipboard(document.getElementById('GenerateCommand').innerText);
		});

		this.UpdateInformation(MusicName, MusicJson);
	}

	Redirect(name, type, json)
	{
		switch (type)
		{
			case 'input':
				this.Input(name);
				break ;
			case 'group':
				this.Group(name);
				break ;
			case 'switch':
				this.Switch(name);
				break ;
			case 'select':
				this.Select(name, json);
				break ;
			case 'range':
				this.Range(name, json);
				break ;
		}
	}

	Input(name)
	{
		this.HTML += Template.parseRaw(Template.getRaw('music_form_input.tp'), {ID: name, Name: name, Placeholder: ''});
	}

	Group(name)
	{
		this.HTML += Template.parseRaw(Template.getRaw('music_form_group.tp'), {ID: name, Name: name});
	}

	Switch(name)
	{
		this.HTML += Template.parseRaw(Template.getRaw('music_form_switch.tp'), {ID: name, Name: name});
	}

	Select(name, json)
	{
		let HTMLlist = '';
		for (let i in json)
		{
			if (i == 0)
				continue ;
			HTMLlist += '<option>'+ json[i] +'</option>';
		}
		this.HTML += (Template.parseRaw(Template.getRaw('music_form_select.tp'), {ID: name, Name: name, Options: HTMLlist}));
	}

	Range(name, json)
	{
		this.HTML += (Template.parseRaw(Template.getRaw('music_form_range.tp'), {ID: name, Name: name, Value: json[1], Min: json[2], Max: json[3], Step: json[4]}));
	}

	UpdateInformation(MusicName, MusicJson)
	{
		document.getElementById('Sound_Name').value = MusicName;
		if (MusicJson.hasOwnProperty('id'))
			document.getElementById('ID_File').innerText = MusicJson.id.toString();
		if (MusicJson.hasOwnProperty('category'))
			document.getElementById('category').value = MusicJson.category;
		if (MusicJson.hasOwnProperty('replace'))
			document.getElementById('replace').checked = MusicJson.replace;
		if (MusicJson.hasOwnProperty('subtitle'))
			document.getElementById('subtitle').value = MusicJson.subtitle;
		for (let key in MusicJson.sounds)
		{
			if (typeof(MusicJson.sounds[key]) === 'object')
			{
				if (MusicJson.sounds[key].hasOwnProperty('attenuation_distance'))
					document.getElementById('attenuation_distance').value = MusicJson.sounds[key].attenuation_distance;
				if (MusicJson.sounds[key].hasOwnProperty('name'))
					document.getElementById('name').value = MusicJson.sounds[key].name;
				if (MusicJson.sounds[key].hasOwnProperty('pitch'))
					document.getElementById('pitch').value = MusicJson.sounds[key].pitch;
				if (MusicJson.sounds[key].hasOwnProperty('preload'))
					document.getElementById('preload').checked = MusicJson.sounds[key].preload;
				if (MusicJson.sounds[key].hasOwnProperty('stream'))
					document.getElementById('stream').checked = MusicJson.sounds[key].stream;
				if (MusicJson.sounds[key].hasOwnProperty('type'))
					document.getElementById('type').value = MusicJson.sounds[key].type;
				if (MusicJson.sounds[key].hasOwnProperty('volume'))
					document.getElementById('volume').value = MusicJson.sounds[key].volume;
				if (MusicJson.sounds[key].hasOwnProperty('weight'))
					document.getElementById('weight').value = MusicJson.sounds[key].weight;
			}
		}
		
	}
}

module.exports = MusicComponent;
