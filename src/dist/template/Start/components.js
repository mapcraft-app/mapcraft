const fs = require('fs');
const path = require('path');
const MC = require('mapcraft-api').Mapcraft;
const Temp = require('mapcraft-api').MCtemplate;
const { MCutilities } = require('mapcraft-api');

const Template = new Temp(__dirname);

let LANG = MCutilities.getLang(__dirname, MC.config.Env.Lang);

class Component
{
	static main()
	{
		Template.render(document.body, 'main.tp', null);
	}

	static selection()
	{
		let HTML = '';
		let countElement = 0;
		const _Component = Template.getRaw('selection.tp');

		if (!fs.existsSync(MC.config.Env.SavePath))
		{
			document.getElementById('start-selection').innerHTML = `<h2>${LANG.Error.DirectoryNotExist}</h2>`;
			return;
		}

		const TempSaveList = fs.readdirSync(MC.config.Env.SavePath);
		for (const Save of TempSaveList)
		{
			const testIfDir = path.join(MC.config.Env.SavePath, '/', Save);
			if (fs.existsSync(testIfDir) && fs.lstatSync(testIfDir).isDirectory())
				if (fs.existsSync(path.join(testIfDir, '/level.dat')))
				{
					let imgLink = String;
					if (fs.existsSync(path.join(testIfDir, '/icon.png')))
						imgLink = path.join(testIfDir, '/icon.png');
					else
						imgLink = path.join(__dirname, '../../img/icon/default_logo.png');
					HTML += Template.parseRaw(_Component, { id: countElement, ImgPath: imgLink, title: Save });
				}
			countElement++;
		}
		Template.renderRaw(document.getElementById('start-selection'), HTML, 'selection.tp', null);
	}

	static option()
	{
		let HTML = '';
		const _Component = Template.getRaw('option.tp');
		const ComponentData = Template.getRaw('resource.tp');
		const ComponentSelection = Template.getRaw('lang.tp');
		HTML += Template.parseRaw(_Component, { for: 'TempPath', id: 'option-TempPath', text: 'Option.TagTemp', path: MC.config.Env.TempPath });
		HTML += Template.parseRaw(_Component, { for: 'GamePath', id: 'option-GamePath', text: 'Option.TagGame', path: MC.config.Env.GamePath });
		HTML += Template.parseRaw(_Component, { for: 'SavePath', id: 'option-SavePath', text: 'Option.TagSave', path: MC.config.Env.SavePath });

		HTML += Template.parseRaw(ComponentData, { for: 'ResourcePath', id: 'option-ResourcePath', text: 'Option.TagResource', path: MC.config.Data.ResourcePack });
		HTML += Template.parseRaw(ComponentData, { for: 'DataPath', id: 'option-DataPath', text: 'Option.TagData', path: MC.config.Data.DataPack });

		HTML += Template.parseRaw(ComponentSelection, { id: 'option-Lang', text: 'Option.TagLang' });

		Template.renderRaw(document.getElementById('start-option'), HTML, 'option.tp', null);

		HTML = '';
		const ComponentLang = '<option value="{Code}">{Lang}</option>';
		const JsonLangList = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../lang.json'), 'utf-8'));
		for (const i in JsonLangList)
			if (Object.prototype.hasOwnProperty.call(JsonLangList, i))
				HTML += Template.parseRaw(ComponentLang, { Code: i, Lang: JsonLangList[i] });
		Template.renderRaw(document.getElementById('option-Lang'), HTML, 'lang_input.tp', null);
		this.setSelectLang();
	}

	static setSelectLang()
	{
		const DOM = document.getElementById('option-Lang');
		for (let i = 0, { length } = DOM; i < length; i++)
			if (DOM[i].value === MC.config.Env.Lang)
				DOM[i].setAttribute('selected', null);
			else if (DOM[i].hasAttribute('selected'))
				DOM[i].removeAttribute('selected');
	}

	/*Interface for component */
	static drawFullComponent()
	{
		LANG = MCutilities.getLang(__dirname, MC.config.Env.Lang);
		this.main();
		this.selection();
		this.option();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
		this.setSelectLang();
	}

	static drawSaveConfig()
	{
		LANG = MCutilities.getLang(__dirname, MC.config.Env.Lang);
		this.selection();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
		this.setSelectLang();
	}

	static drawResetConfig()
	{
		LANG = MCutilities.getLang(__dirname, MC.config.Env.Lang);
		this.selection();
		this.option();
		Template.updateLang(document.getElementsByTagName('*'), LANG);
		this.setSelectLang();
	}
}

module.exports = Component;
