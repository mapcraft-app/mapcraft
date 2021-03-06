const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Mapcraft, MCshell } = require('mapcraft-api');

/**
 * Specialized import plugin based on MCplugin logic, don't use this in your personnal project
 * @private
 */
class ImportPlugin
{
	constructor()
	{
		this.ifNewPlugin = false;
		this.BaseLink = Mapcraft.config.Env.PluginsComponents;
		this.jsonBase = fs.readFileSync(path.join(Mapcraft.config.Env.PluginsComponents, 'components.json'), { encoding: 'utf-8', flag: 'r' });
		this.Components = JSON.parse(this.jsonBase);
		for (const i in this.Components)
			if (Object.prototype.hasOwnProperty.call(this.Components, i))
				if (typeof this.Components[i].directory === 'undefined')
				{
					let newUUID;
					if (typeof this.Components[i].uuid === 'undefined')
						newUUID = crypto.randomUUID();
					else
						newUUID = this.Components[i].uuid;
					try
					{
						fs.renameSync(path.join(this.BaseLink, this.Components[i].name), path.join(this.BaseLink, `${this.Components[i].name}_${newUUID}`));
					}
					catch (err)
					{
						throw new Error(`importPlugins: ${err.message}`);
					}
					this.Components[i].directory = path.join(this.BaseLink, `${this.Components[i].name}_${newUUID}`);
					this.ifNewPlugin = true;
				}
		if (!global.ImportPluginSave)
		{
			global.ImportPluginSave = [];
			for (const i in this.Components)
				if (Object.prototype.hasOwnProperty.call(this.Components, i))
					global.ImportPluginSave.push({
						name: this.Components[i].name,
						uuid: this.Components[i].uuid,
						directory: this.Components[i].directory,
						component: this.Components[i].component,
						active: this.Components[i].active,
						isNotification: this.Components[i].isNotification,
						lang: this.Components[i].lang,
						instance: require(path.join(this.Components[i].directory, this.Components[i].component)) // eslint-disable-line
					});
		}
		this.plugins = global.ImportPluginSave;
		if (this.ifNewPlugin)
			fs.writeFileSync(path.join(Mapcraft.config.Env.PluginsComponents, 'components.json'), JSON.stringify(this.plugins, null, 4), { encoding: 'utf-8', flag: 'w' });
		MCshell.add(global.ImportPluginSave);
	}

	/**
	 * Get instance of component
	 * @param {String} UUID UUID of component
	 * @returns Instance function of component, or undefined if error
	 */
	instance(UUID)
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
	component(UUID)
	{
		for (const i in this.plugins)
			if (this.plugins[i].uuid === UUID)
				return (this.plugins[i]);
		return (undefined);
	}

	/**
	 * Add new component in list
	 * @param {JSON} componentData Json data of new component
	 */
	add(componentData)
	{
		for (const i in this.plugins)
			if (Object.prototype.hasOwnProperty.call(this.plugins, i) && this.plugins[i].uuid === componentData.uuid)
				throw new Error('Component already exists');
		global.ImportPluginSave.push({
			name: componentData.name,
			uuid: componentData.uuid,
			directory: componentData.directory,
			component: componentData.component,
			active: componentData.active,
			isNotification: componentData.isNotification,
			lang: componentData.lang,
			instance: require(path.join(componentData.directory, componentData.component)) // eslint-disable-line
		});
		this.plugins = global.ImportPluginSave;
		MCshell.add(
			[
				{ directory: componentData.directory },
			],
		);
	}

	/**
	 * Toogle component
	 * @param {String} UUID UUID of component
	 * @param {Boolean} forceValue Set to true/false if you want to force activate/desactivate plugin
	 */
	toggle(UUID, forceValue = undefined)
	{
		for (const i in this.plugins)
			if (this.plugins[i].uuid === UUID)
			{
				if (forceValue === undefined)
					this.plugins[i].active = !(this.plugins[i].active);
				else
					this.plugins[i].active = Boolean(forceValue);
				break;
			}
	}

	/**
	 * Remove component from list
	 * @param {String} UUID UUID of component
	 */
	remove(UUID)
	{
		for (const i in this.plugins)
			if (Object.prototype.hasOwnProperty.call(this.plugins, i) && this.plugins[i].uuid === UUID)
			{
				this.plugins.splice(i, 1);
				return;
			}
	}

	/**
	 * Get lang data of component
	 * @param {String} UUID UUID of component
	 * @returns {JSON} Lang data
	 */
	lang(UUID)
	{
		let data = null;
		for (const i in this.plugins)
			if (this.plugins[i].uuid === UUID)
			{
				try
				{
					if (!fs.existsSync(path.join(this.plugins[i].directory, this.plugins[i].lang, `${Mapcraft.config.Env.Lang}.json`)))
						if (!fs.existsSync(path.join(this.plugins[i].directory, this.plugins[i].lang, 'en_US.json')))
							throw new Error('No lang data is found');
						else
							data = JSON.parse(fs.readFileSync(path.join(this.plugins[i].directory, this.plugins[i].lang, 'en_US.json')));
					else
						data = JSON.parse(fs.readFileSync(path.join(this.plugins[i].directory, this.plugins[i].lang, `${Mapcraft.config.Env.Lang}.json`)));
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
	listComponents()
	{
		return (this.plugins);
	}
}

module.exports = new ImportPlugin();
