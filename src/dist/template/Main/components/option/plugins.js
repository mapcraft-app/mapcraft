const fsPromise = require('fs/promises');
const child = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const process = require('process');

/**
 * The asar format causes that 7zip programs no longer have the necessary chmod.
 * These are thus extracted outside the archive to be able to function again.
 * If a solution is found later, this code will be removed
 */
const zipPath = (path.basename(process.env.AppPath) === 'app.asar')
	? path.join(process.env.AppPath, '..', 'app.asar.unpacked', 'node_modules', '7zip-min')
	: path.join(process.env.AppPath, 'node_modules', '7zip-min');
const SevenZip = require(zipPath); //eslint-disable-line import/no-dynamic-require

const { Mapcraft, MCtemplate } = require('mapcraft-api');

const importPlugins = require(path.join(globalThis.src.js, 'importPlugins'));

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

function addPluginToTable(packageJson, base = undefined)
{
	if (!base)
		base = path.join(Mapcraft.config.Env.PluginsComponents, `${packageJson.name}_${packageJson.uuid}`); //eslint-disable-line no-param-reassign
	const tab = document.querySelector('#table-plugin tbody');
	const ID = (!tab.childElementCount) ? 0 : tab.childElementCount;
	const div = document.createElement('div');
	const data = {
		id: ID,
		uuid: packageJson.uuid,
		icon: (fs.existsSync(path.join(base, packageJson.icon))) ? path.join(base, packageJson.icon) : './dist/img/icon/default_logo.png',
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
			component: String(packageJson.bin.component),
			directory: String(base.install),
			isNotification: Boolean(packageJson.isNotification),
			lang: String(packageJson.bin.lang),
			name: String(packageJson.name),
			uuid: String(packageJson.uuid),
		};
		json.push(newComponent);
		await fsPromise.mkdir(base.install, { recursive: true });
		await fsPromise.cp(dir, base.install, { force: true, recursive: true });
		await fsPromise.rm(dir, { force: true, recursive: true });
		importPlugins.add(newComponent);
		await fsPromise.writeFile(base.components, JSON.stringify(json, null, 4), { encoding: 'utf-8' });
		return addPluginToTable(packageJson);
	}
	catch (err)
	{
		fsPromise.rm(dir, { force: true, recursive: true }).catch(() => null /*don't make anything*/);
		throw new Error(`ImportPlugin: ${err}`);
	}
}

function execShell(command)
{
	return new Promise((resolve, reject) =>
	{
		child.spawn(
			'node',
			[
				(path.basename(process.env.AppPath) === 'app.asar')
					? path.join(process.env.AppPath, '..', 'app.asar.unpacked', 'node_modules', 'mapcraft-api', 'cli', 'cli.js')
					: path.join(process.env.AppPath, 'node_modules', 'mapcraft-api', 'cli', 'cli.js'),
				String(command),
			],
			{
				cwd: process.cwd(),
				detached: true,
				shell: true,
				windowsHide: false,
			},
		)
			.on('close', (code) =>
			{
				if (code !== 0)
					reject(new Error(`plugins/spawn: ${code}`));
				resolve(code);
			});
	});
}

module.exports = { addPluginViaArchive, execShell };
