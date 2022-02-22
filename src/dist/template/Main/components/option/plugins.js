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
		return addPluginToTable(packageJson);
	}
	catch (err)
	{
		fsPromise.rm(dir, { force: true, recursive: true }).catch(() => null /*don't make anything*/);
		throw new Error(`ImportPlugin: ${err.message}`);
	}
}

function execShell(command)
{
	console.log(path.join(process.env.AppPath, './node_modules/mapcraft-api/cli/cli.js'));
	return new Promise((resolve, reject) =>
	{
		let stdout = '';
		let stderr = '';
		child.spawn(
			'node',
			[
				path.join(process.env.AppPath, './node_modules/mapcraft-api/cli/cli.js'),
				String(command),
			],
			{
				cwd: process.cwd(),
				detached: true,
				shell: true,
				windowsHide: false,
			},
		)
			.stdout.on('data', (data) =>
			{
				stdout += data;
			})
			.stderr.on('data', (data) =>
			{
				stderr += data;
			})
			.on('close', (code) =>
			{
				if (code)
				{
					reject(new Error(`plugins/spawn: ${code}`));
				}
				else
				{
					console.warn(stdout);
					console.error(stderr);
					resolve('ok');
				}
			});
	});

	/*
	const getScript = () =>
	{
		switch (os.platform())
		{
			case 'darwin':
				return path.join(__dirname, 'scripts', 'darwin.bat');
			case 'win32':
				return path.join(__dirname, 'scripts', 'win32.sh');
			default:
				return path.join(__dirname, 'scripts', 'unix.sh');
		}
	};
	return new Promise((resolve, reject) =>
	{
		child.execFile(
			getScript(),
			[command],
			{
				cwd: process.env.AppPath,
				encoding: 'utf8',
				windowsHide: false,
				shell: true,
			},
			(err, stdout, stderr) =>
			{
				if (err)
					reject(err);
				console.log(stdout);
				console.error(stderr);
				resolve('ok');
			},
		);
	)};
	*/
}

module.exports = { addPluginViaArchive, execShell };
