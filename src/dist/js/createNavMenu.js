const { Mapcraft, MCtemplate, MCplugin } = require('mapcraft-api');
const path = require('path');
const fs = require('fs');

const Template = new MCtemplate(__dirname);
const builtinPlugins = new MCplugin();
const importPlugins = require('./importPlugins');

const navRaw = `
<li id="{id}" title="{title}">
	<h4 id="nav-{id}" {importPlugins} class="nav-hover-element">
		<span class="uk-margin-small-right" uk-icon="icon: {icon}"></span> {title}
	</h4>
</li>`;
const homeRaw = `
<li id="{id}" {importPlugins} title="{title}">
	<div class="uk-card uk-card-primary uk-card-body main-card home-wrap">
		<span uk-icon="icon: {icon}; ratio: 2"></span>
		<h3>{title}</h3>
	</div>
</li>`;

/**
 * Create and screen plugin navigation module
 */
exports.CreateNavMenu = (DOMelement, TEMPLATE, ISHOME = false) =>
{
	let HTML = '';
	const Component = (!ISHOME) ? navRaw : homeRaw;

	const Plugins = JSON.parse(fs.readFileSync(Mapcraft.config.Env.Components, 'utf-8'));
	const UserPlugins = JSON.parse(fs.readFileSync(path.join(Mapcraft.config.Env.PluginsComponents, 'components.json')), 'utf-8');
	// Built-in plugins
	for (const i in Plugins)
		if (!ISHOME && Plugins[i].name !== '__DEFAULT' && Plugins[i].name !== 'Main' && builtinPlugins.active(Plugins[i].name) === true)
		{
			const _LANG = builtinPlugins.lang(Plugins[i].name);
			HTML += Template.parseRaw(Component, { id: Plugins[i].name, title: _LANG.Title, icon: _LANG.Icon });
		}
		else if (Plugins[i].name !== '__DEFAULT' && Plugins[i].name !== 'Main' && Plugins[i].name !== 'Home' && builtinPlugins.active(Plugins[i].name) === true)
		{
			const _LANG = builtinPlugins.lang(Plugins[i].name);
			HTML += Template.parseRaw(Component, { id: Plugins[i].name, title: _LANG.Title, icon: _LANG.Icon });
		}
	// User plugins
	for (const i in UserPlugins)
		if (typeof UserPlugins[i].active === 'undefined' || UserPlugins[i].active === true)
		{
			const _LANG = importPlugins.lang(UserPlugins[i].uuid);
			HTML += Template.parseRaw(Component, { id: UserPlugins[i].uuid, importPlugins: 'userplugin', title: _LANG.Title, icon: _LANG.Icon });
		}
	Template.renderRaw(DOMelement, HTML, TEMPLATE, null);
	if (!ISHOME)
		document.querySelectorAll('#toogle-nav li').forEach((element) =>
		{
			if (element.id === localStorage.getItem('Mapcraft_Plugin'))
				element.childNodes[1].classList.add('nav-hover-element-selected');
		});
};
