const { ipcRenderer } = require("electron");

let validChannels = new Array();
let Channel = {
	Dialog: ['open-file', 'open-directory'],
	Editor: ['open', 'open-modal', 'close', 'close-modal', 'save-file'],
	Log: ['is-change', 'send-change'],
	Notification: ['click-notification'],
	Plugin: ['is-changed', 'update-interface'],
	Shell: ['send-command', 'new-command', 'execute-command'],
	Start: ['is-selected-world'],
	Update: ['open-window', 'create-modal', 'close-modal', 'make-update'],
	User: ['close-window', 'change-username', 'remove-blur'],
	WorkProgress: ['signal-open-modal', 'open-modal', 'signal-close-modal', 'close-modal'],
	
	Cutscene: ['signal-create-cutscene', 'create-cutscene'],
	Trigger: ['signal-open-modal', 'open-modal']
}

class ArrayIPC
{
	constructor()
	{
		for (let i in Channel)
		{
			let channel = i;
			let array = Channel[i];
			for (let i in array)
				validChannels.push(channel + ':' + array[i]);
		}
	}
}

let newIPC = new ArrayIPC();

let IPC = {
	send: (channel, ...args) => {
		if (validChannels.includes(channel))
			ipcRenderer.send(channel, ...args);
		else
			throw (channel + ' is not autorized');
	},
	receive: (channel, func) => {
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	}
};

module.exports = IPC;
