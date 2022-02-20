const fsPromise = require('fs/promises');
const child = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const process = require('process');
const SevenZip = require('7zip-min');
const { Mapcraft, MCtemplate } = require('mapcraft-api');
const importPlugins = require('../../../../js/importPlugins');

const Template = new MCtemplate(__dirname);

const unZip = (pathToArchive, whereToUnpack) => new Promise((resolve, reject) =>
{
	SevenZip.unpack(pathToArchive, whereToUnpack, (err) =>
	{
		if (err)
			reject(err);
		resolve('ok');
	});
});

async function addPluginViaArchive(archivePath)
{
	document.getElementById('loader').removeAttribute('hidden');
	if (!archivePath)
		throw new Error('ImportPlugin: path is undefined');
	else if (!fs.existsSync(archivePath))
		throw new Error('ImportPlugin: file is not exist');
	else if (path.extname(archivePath) !== '.mapcraft')
		throw new Error('ImportPlugin: file is not .mapcraft archive format');
	const dir = await fsPromise.mkdtemp(path.join(os.tmpdir(), 'mpc_'), { encoding: 'utf-8' });
	try
	{
		await unZip(archivePath, dir);
		const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), { encoding: 'utf-8' }));
		const base = {
			install: path.join(Mapcraft.config.Env.PluginsComponents, `${packageJson.name}_${packageJson.uuid}`),
			components: path.join(Mapcraft.config.Env.PluginsComponents, 'components.json'),
		};
		const json = JSON.parse(fs.readFileSync(base.components, { encoding: 'utf-8', flag: 'r' }));
		const newComponent = {
			active: Boolean(true),
			component: String(packageJson.component),
			directory: String(base.install),
			isNotification: Boolean(packageJson.bin.isNotification),
			lang: String(packageJson.lang),
			name: String(packageJson.name),
			uuid: String(packageJson.uuid),
		};
		json.push(newComponent);
		await fsPromise.mkdir(base.install, { recursive: true });
		await fsPromise.cp(dir, base.install, { force: true, recursive: true });
		await fsPromise.rm(dir, { force: true, recursive: true });
		importPlugins.add(newComponent);
		await fsPromise.writeFile(base.components, JSON.stringify(json, null, 4), { encoding: 'utf-8' });
		const tab = document.querySelector('#table-plugin tbody');
		const ID = (!tab.childElementCount) ? 0 : tab.childElementCount;
		const div = document.createElement('div');
		const data = {
			id: ID,
			uuid: packageJson.uuid,
			icon: (fs.existsSync(path.join(base.install, packageJson.icon))) ? path.join(base.install, packageJson.icon) : './dist/img/icon/default_logo.png',
			name: packageJson.name,
			version: packageJson.version,
			author: packageJson.author,
			description: packageJson.description,
		};
		Template.render(div, 'plugin-table.tp', data);
		div.getElementsByTagName('input')[0].setAttribute('checked', 'checked');
		const TR = div.getElementsByTagName('tr')[0];
		tab.appendChild(TR);
		return TR;
	}
	catch (err)
	{
		fsPromise.rm(dir, { force: true, recursive: true }).catch(() => null /*don't make anything*/);
		throw new Error(`ImportPlugin: ${err.message}`);
	}
}

function execShell(command)
{
	const getCommand = () =>
	{
		switch (os.platform())
		{
			case 'win32':
				return (`start ${command}`);
			case 'darwin':
				return (`open -a Terminal ${command}`);
			default:
				return (`xdg-open /bin/sh ${command}`);
		}
	};

	child.exec(
		getCommand(),
		{
			cwd: process.cwd(),
			encoding: 'utf8',
			windowsHide: false,
		},
		(err) =>
		{
			if (err)
				throw new Error(`ImportPlugin: ${err.message}`);
		},
	);
}

module.exports = { addPluginViaArchive, execShell };
