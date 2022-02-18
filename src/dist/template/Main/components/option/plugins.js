const fsPromise = require('fs/promises');
const fs = require('fs');
const os = require('os');
const path = require('path');
const SevenZip = require('7zip-min');
const { Mapcraft, MCtemplate } = require('mapcraft-api');

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

module.exports = async (archivePath) =>
{
	document.getElementById('loader').removeAttribute('hidden');

	if (!archivePath)
		throw new Error('ImportPlugin: path is undefined');
	else if (!fs.existsSync(archivePath))
		throw new Error('ImportPlugin: file is not exist');
	else if (path.extname(archivePath) !== '.mapcraft')
		throw new Error('ImportPlugin: file is not .mapcraft archive format');
	try
	{
		const dir = await fsPromise.mkdtemp(path.join(os.tmpdir(), 'mpc_'), { encoding: 'utf-8' });
		await unZip(archivePath, dir);
		const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), { encoding: 'utf-8' }));
		const base = {
			install: path.join(Mapcraft.config.Env.PluginsComponents, `${packageJson.name}_${packageJson.uuid}`),
			components: path.join(Mapcraft.config.Env.PluginsComponents, 'components.json'),
		};
		const json = JSON.parse(fs.readFileSync(base.components, { encoding: 'utf-8', flag: 'r' }));
		json.push(
			{
				active: Boolean(true),
				component: String(packageJson.component),
				directory: String(base.install),
				isNotification: Boolean(packageJson.bin.isNotification),
				lang: String(packageJson.lang),
				name: String(packageJson.name),
				uuid: String(packageJson.uuid),
			},
		);
		await fsPromise.writeFile(base.components, JSON.stringify(json, null, 4), { encoding: 'utf-8' });
		await fsPromise.mkdir(base.install, { recursive: true });
		await fsPromise.cp(dir, base.install, { force: true, recursive: true });
		await fsPromise.rm(dir, { force: true, recursive: true });

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
		tab.appendChild(div.getElementsByTagName('tr')[0]);
	}
	catch (err)
	{
		throw new Error(`ImportPlugin: ${err.message}`);
	}
};
