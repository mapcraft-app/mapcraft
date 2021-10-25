const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Mapcraft } = require('mapcraft-api');

const checksum = (name) => crypto
	.createHash('sha1')
	.update(name, 'utf8')
	.digest('hex')
	.slice(0, 16);

const randomValue = () => crypto
	.randomBytes(Math.ceil(16 / 2))
	.toString('hex')
	.slice(0, 8);

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
		this.Components = JSON.parse(fs.readFileSync(path.join(Mapcraft.GetConfig().Env.PluginsComponents, 'components.json'), 'utf-8'));
		this.plugins = [];
		//eslint-disable-next-line guard-for-in
		for (const i in this.Components)
		{
			if (typeof this.Components[i].checksum === 'undefined')
			{
				const _checksum = `${checksum(this.Components[i].name)}${randomValue()}`;
				const _newDir = `${this.Components[i].name}_${_checksum}`;
				try
				{
					fs.renameSync(path.join(this.BaseLink, this.Components[i].name), path.join(this.BaseLink, _newDir));
				}
				catch (err)
				{
					console.error(err);
				}
				this.Components[i].checksum = _checksum;
				this.Components[i].directory = path.join(this.BaseLink, _newDir);
				this.ifNewPlugin = true;
			}
			if ((typeof this.Components[i].using === 'undefined' || this.Components[i].using === true))
				this.plugins.push({
					name: this.Components[i].name,
					checksum: this.Components[i].checksum,
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
	 * @param {String} Name Name of component
	 * @returns Instance function of component, or undefined if error
	 */
	Instance(Name)
	{
		for (const i in this.plugins)
			if (this.plugins[i].name === Name)
				return (this.plugins[i].instance);
		return (undefined);
	}

	/**
	 * Get component
	 * @param {String} Name Name of component
	 * @returns Full component, or undefined if error
	 */
	Component(Name)
	{
		for (const i in this.plugins)
			if (this.plugins[i].name === Name)
				return (this.plugins[i]);
		return (undefined);
	}

	/**
	 * Get lang data of component
	 * @param {String} Name Name of component
	 * @returns {JSON} Lang data
	 */
	Lang(Name)
	{
		let data = null;
		for (const i in this.plugins)
			if (this.plugins[i].name === Name)
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

module.exports = ImportPlugin;
