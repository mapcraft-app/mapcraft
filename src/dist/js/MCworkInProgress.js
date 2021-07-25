const IPC = require('./MCipc');
const WorkInProgress = {
	open: () => {
		IPC.send('WorkProgress:signal-open-modal');
	},
	close: () => {
		IPC.send('WorkProgress:signal-close-modal');
	}
};

module.exports = WorkInProgress;
