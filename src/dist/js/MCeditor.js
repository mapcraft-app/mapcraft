const fs = require('fs');
const path = require('path');

class MCeditor
{
	constructor()
	{
		this.state = {
			isEdit: false,
			link: '',
			fileName: '',
			extension: ''
		};
	}
	OpenFile(link)
	{
		this.state.isEdit = true;
		this.state.link = link;
		this.state.fileName = path.basename(link, path.extname(link));
		this.state.extension = path.extname(link).slice(1);
		if (fs.existsSync(this.state.link))
		{
			let data = fs.readFileSync(this.state.link, 'utf-8');
			return ({
				fileName: this.state.fileName,
				extension: this.state.extension,
				data: data
			});
		}
		else
			throw ('Editor: file no exist');
	}
	SaveFile(data)
	{
		if (this.state.isEdit)
		{
			fs.writeFile(this.state.link, data, (err) => {
				if (err)
					throw ('Editor: ' + err);
				this.CloseFile();
			});
		}
	}
	CloseFile()
	{
		this.state.isEdit = false;
	}
}

module.exports = new MCeditor();
