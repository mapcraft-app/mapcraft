const fs = require('fs');
const OS = require('os');
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
	 * Output : window.appDataPath;
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
}

module.exports = MCutilities;
