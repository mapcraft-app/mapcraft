const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Mapcraft } = require('mapcraft-api');

/**
 * Specialized import plugin based on MCplugin logic, don't use this in your personnal project
 * @private
 */
class ImportPlugin
{
	constructor()
	{
		this.ifNewPlugin = false;
		this.BaseLink = Mapcraft.GetConfig().Env.PluginsComponents;
		this.jsonBase = fs.readFileSync(path.join(Mapcraft.GetConfig().Env.PluginsComponents, 'components.json'), { encoding: 'utf-8', flag: 'r' });
		this.Components = JSON.parse(this.jsonBase);
		this.plugins = [];
		//eslint-disable-next-line guard-for-in
		for (const i in this.Components)
		{
			if (typeof this.Components[i].directory === 'undefined')
			{
				let newUUID;
				if (typeof this.Components[i].uuid === 'undefined')
					newUUID = crypto.randomUUID();
				else
					newUUID = this.Components[i].uuid;
				try
				{
					fs.renameSync(path.join(this.BaseLink, this.Components[i].name), path.join(this.BaseLink, newUUID));
				}
				catch (err)
				{
					console.error(err);
				}
				this.Components[i].directory = path.join(this.BaseLink, newUUID);
				this.ifNewPlugin = true;
			}
			if ((typeof this.Components[i].using === 'undefined' || this.Components[i].using === true))
				this.plugins.push({
					name: this.Components[i].name,
					uuid: this.Components[i].uuid,
					directory: this.Components[i].directory,
					component: this.Components[i].component,
					isNotification: this.Components[i].isNotification,
					lang: this.Components[i].lang,
					instance: require(path.join(this.Components[i].directory, this.Components[i].component)) // eslint-disable-line
				});
		}
		if (this.ifNewPlugin)
			fs.writeFile(path.join(Mapcraft.GetConfig().Env.PluginsComponents, 'components.json'), JSON.stringify(this.plugins, null, 4), { encoding: 'utf-8', flag: 'w' }, (err) =>
			{
				if (err)
					throw new Error(err);
			});
	}

	/**
	 * Get instance of component
	 * @param {String} UUID UUID of component
	 * @returns Instance function of component, or undefined if error
	 */
	//Instance(Name)
	Instance(UUID)
	{
		for (const i in this.plugins)
			if (this.plugins[i].uuid === UUID)
				return (this.plugins[i].instance);
		return (undefined);
	}

	/**
	 * Get component
	 * @param {String} UUID UUID of component
	 * @returns Full component, or undefined if error
	 */
	//Component(Name)
	Component(UUID)
	{
		for (const i in this.plugins)
			if (this.plugins[i].uuid === UUID)
				return (this.plugins[i]);
		return (undefined);
	}

	/**
	 * Get lang data of component
	 * @param {String} UUID UUID of component
	 * @returns {JSON} Lang data
	 */
	//Lang(Name)
	Lang(UUID)
	{
		let data = null;
		for (const i in this.plugins)
			if (this.plugins[i].uuid === UUID)
			{
				try
				{
					data = JSON.parse(fs.readFileSync(path.join(this.plugins[i].directory, this.plugins[i].lang, `${Mapcraft.GetConfig().Env.Lang}.json`)));
				}
				catch (err)
				{
					throw new Error(err);
				}
				return (data);
			}
		return (undefined);
	}

	/**
	 * Get full list of components
	 * @returns List of components
	 */
	ListComponents()
	{
		return (this.plugins);
	}
}

module.exports = new ImportPlugin();
