/*{
**	"Name": string,
**	"Component": string [.js],
**	"Lang": string,
**	"IsNotification" : true | false,
**	"Using": (Optional) true | false
**}
*/

const fs = require('fs');
const path = require('path');
const MC = require('./Mapcraft');

class MCplugin
{
	constructor()
	{
		this.Components = JSON.parse(fs.readFileSync(MC.GetConfig().Env.Components, 'utf-8'));
		this.BaseLink = path.join(__dirname, '../template/Main');
		this.__default = null;
		this.plugins = [];
		for (const i in this.Components)
			if (this.Components[i].Name !== '__DEFAULT'
			&& (typeof this.Components[i].Using === 'undefined' || this.Components[i].Using === true))
			{
				this.plugins.push({
					Name: this.Components[i].Name,
					Component: this.Components[i].Component,
					IsNotification: this.Components[i].IsNotification,
					Lang: path.join(this.BaseLink, this.Components[i].Lang),
					Instance: require(`../template/Main/${this.Components[i].Component}`) // eslint-disable-line
				});
			}
			else if (this.Components[i].Name === '__DEFAULT')
			{
				localStorage.setItem('Mapcraft_Plugin', this.Components[i].Component);
				this.__default = this.Components[i].Component;
			}
	}

	Instance(Name)
	{
		for (const i in this.plugins)
			if (this.plugins[i].Name === Name)
				return (this.plugins[i].Instance);
		return (undefined);
	}

	Component(Name)
	{
		for (const i in this.plugins)
			if (this.plugins[i].Name === Name)
				return (this.plugins[i]);
		return (undefined);
	}

	Lang(Name)
	{
		let data = null;
		for (const i in this.plugins)
			if (this.plugins[i].Name === Name)
			{
				try
				{
					data = JSON.parse(fs.readFileSync(path.join(this.plugins[i].Lang, `${MC.GetConfig().Env.Lang}.json`)));
				}
				catch (err)
				{
					throw new Error(err);
				}
				return (data);
			}
		return (undefined);
	}

	Default()
	{
		let data = null;
		for (const i in this.plugins)
			if (this.plugins[i].Name === this.__default)
			{
				try
				{
					data = JSON.parse(fs.readFileSync(path.join(this.plugins[i].Lang, `${MC.GetConfig().Env.Lang}.json`)));
				}
				catch (err)
				{
					throw new Error(err);
				}
				return (data);
			}
		return (undefined);
	}

	ListComponents()
	{
		return (this.plugins);
	}
}

module.exports = MCplugin;
