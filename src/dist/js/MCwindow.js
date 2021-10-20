const { BrowserWindow } = require('electron');
const path = require('path');

class MCwindow
{
	static CreateWindow(_width, _height, _preload)
	{
		const _newWindow = new BrowserWindow({
			width: _width,
			height: _height,
			center: true,
			show: false,
			frame: true,
			icon: path.join(__dirname, '../img/icon/icon.ico'),
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				enableRemoteModule: false,
				webSecurity: true,
				preload: _preload,
			},
		});
		return (_newWindow);
	}

	static OpenWindow(windowInstance, page)
	{
		windowInstance.setMenuBarVisibility(false);
		windowInstance.loadFile(page);
		//windowInstance.webContents.openDevTools();
	}
}

module.exports = MCwindow;
