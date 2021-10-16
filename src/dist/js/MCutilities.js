const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const process = require('process');

class MCutilities
{
	static CheckIfStringIsLegalCharacter(string)
	{
		const Regex = new RegExp('[^-a-z0-9_\/.]+', 'gm');
		if (Regex.test(string))
			return (false);
		return (true);
	}
	
	static GetNextCharacterInAlphabet(char) {
		return String.fromCharCode(char.charCodeAt(0) + 1);
	}

	/**
	 * Generate path of AppData directory of system
	 * Output : process.env.AppDataPath
	 */
	static GetAppDataPath() {
		const __MAPCRAFT = "mapcraft";
		process.env.AppDataPath = String;
		switch (process.platform) {
			case "darwin": {
				process.env.AppDataPath = path.join(process.env.HOME, "Library", "Application Support", __MAPCRAFT);
				break ;
			}
			case "win32": {
				process.env.AppDataPath = path.join(process.env.APPDATA, __MAPCRAFT);
				break ;
			}
			case "linux": {
				process.env.AppDataPath = path.join(process.env.HOME, __MAPCRAFT);
				break ;
			}
			default: {
				console.log("Unsupported platform!");
				process.exit(1);
			}
		};
		if (!fs.existsSync(process.env.AppDataPath)) fs.mkdirSync(process.env.AppDataPath);
	}

	/**
	 * Download file from web, accept http and https
	 * @param {string} url url of download file
	 * @param {string} destination path of file destination
	 * @param {function} callback callback function with (error)
	 */
	static download(url, destination, callback)
	{
		const file = fs.createWriteStream(destination);
		let httpMethod;
		if (url.indexOf(('https://')) !== -1)
			httpMethod = https;
		else
			httpMethod = http;
		const request = httpMethod.get(url, (response) => {
			if (response.statusCode !== 200)
				return callback(response.statusCode + ' error to ' + url);
			response.pipe(file);
			file.on('finish', () => {
				file.close(callback);
			});
		});
		request.on('error', (err) => {
			fs.unlink(destination, (err) => {
				if (err) { console.error('download request error:', err); }
			});
			callback(err.message);
		});
		file.on('error', (err) => {
			fs.unlink(destination, (err) => {
				if (err) { console.error('download request error:', err); }
			});
			callback(err.message);
		});
	}

	/**
	 * Check if directory is empty
	 * @param {string} path path to directory
	 */
	static IsEmptyDir(path)
	{
		return fs.readdirSync(path).length === 0;
	}
}

module.exports = MCutilities;
