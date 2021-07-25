const { BrowserWindow } = require('electron');
const path = require('path');

class MCwindow
{
	static CreateWindow(width, height, preload) {
		let _newWindow = new BrowserWindow({
			width: width,
			height: height,
			center: true,
			show: false,
			frame: true,
			icon: path.join(__dirname, '../img/icon/icon.ico'),
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				enableRemoteModule: false,
				webSecurity: true,
				preload: preload
			}
		});
		return (_newWindow);
	}
	static OpenWindow(windowInstance, page) {
		windowInstance.setMenuBarVisibility(false);
		windowInstance.loadFile(page);
		windowInstance.webContents.openDevTools();
	}
}

module.exports = MCwindow;
