export default {
	notification: 'A cutscene has been modified',
	menu: {
		name: 'cutscene',
	},
	list: {
		title: 'cutscene list',
		add: 'add cutscene',
		addName: 'name of new cutscene'
	},
	option: {
		title: 'options',
		name: 'name',
		description: 'description',
		end: {
			title: 'end entity position',
			origin: {
				label: 'put the entity back to its origin point',
				desc: 'when starting the cutscene, the position of the entity will be recorded. At the end, it will be returned to its original position'
			},
			last: {
				label: 'put the entity at the last point of the cutscene',
				desc: 'at the end, the entity will be placed at the exact position of the last point of the cutscene'
			},
			custom: {
				label: 'put the entity to an exact position',
				desc: 'at the end, the entity will be placed at the predefined position below'
			}
		}
	},
	content: {
		menu: {
			editStart: 'edit start mcfunction file',
			editDuring: 'edit the mcfunction that is executed during the cutscene',
			editEnd: 'edit end mcfunction file',
			option: 'edit options',
			save: {
				start: 'save cutscene',
				end: 'save cutscene success',
				fail: 'save cutscene failed',
			},
			autosave: {
				start: 'autosave cutscene',
				end: 'autosave cutscene success',
				fail: 'autosave cutscene failed',
			},
			generate: {
				start: 'generate cutscene',
				end: 'generate cutscene success',
				fail: 'generate cutscene failed'
			}
		},
		header: {
			x: 'x',
			y: 'y',
			z: 'z',
			rx: 'rx',
			ry: 'ry',
			duration: 'duration',
			transition: 'transition'
		},
		table: {
			s: 's',
			error: {
				noData: 'value is mandatory',
				noNeg: 'cannot be negative'
			}
		}
	}
};
