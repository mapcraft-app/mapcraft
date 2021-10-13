const fs = require('fs');
const path = require('path');
const MC = require('../../js/Mapcraft');
const Temp = require('../../js/MCtemplate'), Template = new Temp(__dirname);

function GetLang()
{
	let data;
	try { data = JSON.parse(fs.readFileSync(path.join(__dirname, './lang', MC.GetConfig().Env.Lang + '.json'))) }
	catch (err) { throw err }
	return (data);
}; let LANG = GetLang();

class Component
{	
	/* Component */
	static main()
	{
		Template.render(document.body, 'main.tp', null);
	}
	static selection()
	{
		let HTML = '';
		let countElement = 0;
		let Component = Template.getRaw('selection.tp');
		
		if (!fs.existsSync(MC.GetConfig().Env.SavePath))
		{
			document.getElementById('start-selection').innerHTML = '<h2>'+ LANG.Error.DirectoryNotExist +'</h2>';
			return ;
		}
		
		let TempSaveList = fs.readdirSync(MC.GetConfig().Env.SavePath);
		for (let Save of TempSaveList)
		{
			let testIfDir = path.join(MC.GetConfig().Env.SavePath, '/', Save);
			if (fs.existsSync(testIfDir) && fs.lstatSync(testIfDir).isDirectory())
			{
				if (fs.existsSync(path.join(testIfDir, '/icon.png')) && fs.existsSync(path.join(testIfDir, '/level.dat')))
					HTML += Template.parseRaw(Component, {id: countElement, ImgPath: path.join(testIfDir, '/icon.png'), title: Save});
			}
			countElement++;
		}
		Template.renderRaw(document.getElementById('start-selection'), HTML, 'selection.tp', null);
	}
	static option()
	{
		let HTML = '';
		let Component = Template.getRaw('option.tp');
		let ComponentData = Template.getRaw('resource.tp');
		let ComponentSelection = Template.getRaw('lang.tp');
		HTML += Template.parseRaw(Component, {for: 'TempPath', id:'option-TempPath', text:'Option.TagTemp', path: MC.GetConfig().Env.TempPath});
		HTML += Template.parseRaw(Component, {for: 'GamePath', id:'option-GamePath', text:'Option.TagGame', path: MC.GetConfig().Env.GamePath});
		HTML += Template.parseRaw(Component, {for: 'SavePath', id:'option-SavePath', text:'Option.TagSave', path: MC.GetConfig().Env.SavePath});

		HTML += Template.parseRaw(ComponentData, {for: 'ResourcePath', id:'option-ResourcePath', text:'Option.TagResource', path: MC.GetConfig().Data.ResourcePack});
		HTML += Template.parseRaw(ComponentData, {for: 'DataPath', id:'option-DataPath', text:'Option.TagData', path: MC.GetConfig().Data.DataPack});
		
		HTML += Template.parseRaw(ComponentSelection, {id: 'option-Lang', text: 'Option.TagLang'});

		Template.renderRaw(document.getElementById('start-option'), HTML, 'option.tp', null);

		HTML = '';
		let ComponentLang = '<option value="{Code}">{Lang}</option>';
		let JsonLangList = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../lang.json'), 'utf-8'));
		for (let i in JsonLangList)
			HTML += Template.parseRaw(ComponentLang, {Code:i, Lang:JsonLangList[i]});
		Template.renderRaw(document.getElementById('option-Lang'), HTML, 'lang_input.tp', null);
		this.setSelectLang();

	}
	static setSelectLang()
	{
		let DOM = document.getElementById('option-Lang');
		for (let i = 0, length = DOM.length; i < length; i++) {
			if (DOM[i].value === MC.GetConfig().Env.Lang)
				DOM[i].setAttribute('selected', null);
			else if (DOM[i].hasAttribute('selected'))
				DOM[i].removeAttribute('selected');
		}
	}
	
	/* Interface for component */
	static drawFullComponent()
	{
		LANG = GetLang();
		this.main();
		this.selection();
		this.option();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
		this.setSelectLang();
	}
	static drawSaveConfig(SelectionNode)
	{
		LANG = GetLang();
		this.selection();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
		this.setSelectLang();
	}
	static drawResetConfig(SelectionNode, OptionNode)
	{
		LANG = GetLang();
		this.selection();
		this.option();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
		this.setSelectLang();
	}
}

module.exports = Component;
