const { ipcRenderer } = require('electron');

const Channel = {
	Dialog: ['open-file', 'open-directory', 'question', 'error'],
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
	Trigger: ['signal-open-modal', 'open-modal'],
	Recipes: ['signal-is-exist', 'is-exist', 'signal-open-switcher', 'open-switcher']
};
const validChannels = [];

class ArrayIPC
{
	constructor()
	{
		for (const i in Channel)
			if (Object.prototype.hasOwnProperty.call(Channel, i))
			{
				const channel = i;
				const array = Channel[i];
				for (const y in array)
					if (Object.prototype.hasOwnProperty.call(array, y))
						validChannels.push(`${channel}:${array[y]}`);
			}
	}
}

const newIPC = new ArrayIPC();

const IPC = {
	send: (channel, ...args) =>
	{
		if (validChannels.includes(channel))
			ipcRenderer.send(channel, ...args);
		else
			throw new Error(`${channel} is not autorized`);
	},
	receive: (channel, func) =>
	{
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	},
};

module.exports = IPC;
