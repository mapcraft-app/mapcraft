const path = require('path');
const fs = require('fs');

class MCfs
{
	static AddLine(File, Line)
	{
		fs.appendFile(File, Line, (err) => {
			if (err)
				throw new Error(err);
		});
	}
	
	/**
	 * Modify line if occurence found, add new line at the end of file if not exist if AddIsNotExit set to true
	 * @param {string} File 
	 * @param {string} Occurence 
	 * @param {string} NewLine 
	 * @param {boolean} AddIfNotExit 
	 */
	static async ModifyLine(File, Occurence, NewLine = undefined, AddIfNotExit = false)
	{
		let LineNumber = 0;
		let regex = new RegExp('('+ Occurence +')\\b', 's');
		fs.readFile(File, function(err, data) {
			if (err)
				throw new Error(err);
			let arr = data.toString().replace(/\r\n/g,'\n').split('\n');
			for (let i of arr)
			{
				if (i.match(regex))
				{
					if (NewLine)
						arr.splice(LineNumber, 1, NewLine);
					else
						arr.splice(LineNumber, 1);
					fs.writeFile(File, arr.join('\n'), (err) => {
						if (err)
							throw new Error(err);
					});
					return ;
				}
				LineNumber++;
			}
			if (AddIfNotExit)
				MCfs.AddLine(File, NewLine + '\n');
		});
	}
	static DeleteLine(File, Occurence)
	{
		this.ModifyLine(File, Occurence, '');
	}
}

module.exports = MCfs;
