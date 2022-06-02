const FM = require('../fileManager');

class FileManager
{
	constructor(lang)
	{
		this.lang = lang;
		this.FM = new FM(JSON.parse(localStorage.getItem('Mapcraft')).Data.ResourcePack, true);
		document.querySelector('.content').classList.add('content-fm');
	}

	destructor()
	{
		document.querySelector('.content').classList.remove('content-fm');
	}
}

module.exports = FileManager;
