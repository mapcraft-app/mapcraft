const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

class ImportPlugin
{
	constructor(filePath)
	{
		if (!filePath)
			throw new Error('ImportPlugin: path is undefined');
		else if (!fs.existsSync(filePath))
			throw new Error('ImportPlugin: file is not exist');
		else if (path.extname(filePath) !== '.zip')
			throw new Error('ImportPlugin: file is not zip archive format');
		try
		{
			this.Zip = new AdmZip(filePath);
		}
		catch (err)
		{
			throw new Error(`ImportPlugin: ${err}`);
		}
	}
}

module.exports = ImportPlugin;
