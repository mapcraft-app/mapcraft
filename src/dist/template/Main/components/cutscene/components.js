var Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const Database = require('better-sqlite3');
const IPC = require('../../../../js/MCipc');
const MCP = require('../../../../js/MCplugin'), MCplugin = new MCP();
const Temp = require('../../../../js/MCtemplate'), Template = new Temp(__dirname);
const CutsceneMod = require('../../../../js/built_in/Cutscene');

var LANG; UpdateLang();
function UpdateLang() { LANG = MCplugin.Lang('Cutscene'); }

var CutsceneID = -1, LastPoint = -1;

const WorkProgress = {
	open: () => {
		IPC.send('WorkProgress:signal-open-modal');
	},
	close: () => {
		IPC.send('WorkProgress:signal-close-modal');
	}
}

function CreateAlert(type, DOMelement, str)
{
	let alert = document.createElement('div');
	alert.classList.add('uk-alert-' + type);
	alert.setAttribute('uk-alert', '');
	let closeButton = document.createElement('a');
	closeButton.classList.add('uk-alert-close');
	closeButton.setAttribute('uk-close', '');
	let text = document.createElement('p').appendChild(document.createTextNode(str));
	alert.appendChild(closeButton);
	alert.appendChild(text);
	DOMelement.appendChild(alert);
}

//#region IPC signal
IPC.receive('Shell:execute-command', (command) => {
	if (command.Command !== 'cutscene')
		return ;
	switch (command.Type)
	{
		case 'create':
			IPC.send('Cutscene:signal-create-cutscene');
			break ;
		case 'add-point':
			Cutscene._AddPointToCutscene(command);
			break ;
		case 'delete-point':
			console.log('Delete');
	}
});
//#endregion

function PrintTime(Seconds)
{
	let Hours = 0, Minutes = 0;
	if (Seconds >= 3600)
	{
		Hours = Math.round(Seconds / 3600);
		Seconds %= 3600;
	}
	if (Seconds >= 60)
	{
		Minutes = Math.round(Seconds / 60);
		Seconds %= 60;
	}
	Seconds = Math.round(Seconds);
	
	let Str = {
		Hours: Hours.toString(),
		Minutes: Minutes.toString(),
		Seconds: Seconds.toString()
	};
	if (Str.Hours < 10)
		Str.Hours = '0' + Str.Hours;
	if (Str.Minutes < 10)
		Str.Minutes = '0' + Str.Minutes;
	if (Str.Seconds < 10)
		Str.Seconds = '0' + Str.Seconds;
	return (Str.Hours + ':' + Str.Minutes + ':' + Str.Seconds);
}

const DisableDurationLastElement = () => {
	let durationElement = document.querySelectorAll('input[id="Duration"]');
	if (durationElement.length - 2 >= 0 && durationElement[durationElement.length - 2].disabled)
	{
		let ele = document.querySelector('select[point="'+ durationElement[durationElement.length - 2].getAttribute('point') +'"]');
		ele.disabled = false;
		durationElement[durationElement.length - 2].disabled = false;
		durationElement[durationElement.length - 2].removeAttribute('LastPoint');
	}
	if (durationElement.length - 1 >= 0)
	{
		let ele = document.querySelector('select[point="'+ durationElement[durationElement.length - 1].getAttribute('point') +'"]');
		ele.disabled = true;
		durationElement[durationElement.length - 1].disabled = true;
		durationElement[durationElement.length - 1].setAttribute('LastPoint', '');
		durationElement[durationElement.length - 1].value = 0;
	}
};

class Cutscene
{
	static draw()
	{
		UpdateLang();
		this.main();
		this.CutsceneList();
	}

	static main()
	{
		CutsceneID = -1;
		LastPoint = -1;
		Template.render(document.getElementById('content'), 'cutscene.tp', null);
		Template.updateLang(document.getElementById('content'), LANG.Data);
		document.getElementById('CreateNewCutscene-form').addEventListener('submit', (event) => { this._AddCutscene(event) });
		document.getElementById('cutscene-add-point').addEventListener('click', () => { this._AddPointToCutscene() });
		document.getElementById('cutscene-generate').addEventListener('click', () => { this._GenerateCutscene() });
	}

	static CutsceneList()
	{
		let HTML = '';
		let Component = Template.getRaw('li.tp');
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		let sql = db.prepare('SELECT * FROM Cutscene');
		for (let cutscene of sql.iterate())
		{
			if (!cutscene.Duration)
				cutscene.Duration = 0;
			HTML += Template.parseRaw(Component, { ID: cutscene.ID, Name: cutscene.Name, CutsceneHashtag: LANG.Data.Tooltip, Tag: cutscene.Tag, Duration: PrintTime(cutscene.Duration)});
		}
		Template.renderRaw(document.getElementById('cutscene-list'), HTML, 'li.tp', null);
		db.close();
		document.querySelectorAll('ul[id="cutscene-list"] > li').forEach((li) => {
			li.addEventListener('click', () => {
				CutsceneID = li.getAttribute('id');
				document.getElementById('heading-cutscene').innerText = li.getAttribute('name');
				document.querySelector('span[generate-time]').innerText = li.querySelector('h3:last-child > span[time]').innerText;
				this.CutscenePoints();
			});
		});
	}

	static CutscenePoints()
	{
		let HTML = '';
		let Component = Template.getRaw('list.tp');
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		let sql = db.prepare('SELECT * FROM CutscenePoint WHERE CutsceneID = ?');
		LastPoint = -1;
		for (let Point of sql.iterate(CutsceneID))
		{
			if (LastPoint < Point.Point)
				LastPoint = Point.Point;
			HTML += Template.parseRaw(Component, {
				Point: ((Point.Point <= 0) ? (LANG.Data.StartPoint) : (Point.Point)),
				X: Point.X, Y: Point.Y, Z: Point.Z, Rx: Point.Rx, Ry: Point.Ry,
				Secondes: Point.Duration,
				SelectA: (Point.Transition === 'linear') ? ('selected') : (''),
				SelectB: (Point.Transition === 'ease') ? ('selected') : (''),
				SelectC: (Point.Transition === 'ease-in') ? ('selected') : (''),
				SelectD: (Point.Transition === 'ease-out') ? ('selected') : (''),
				SelectE: (Point.Transition === 'ease-in-out') ? ('selected') : (''),
			});
		}
		Template.renderRaw(document.getElementById('cutscene-form'), HTML, 'list.tp', null);
		document.querySelector('button[href="#DeleteCutscene-Modal"]').disabled = false;
		document.getElementById('cutscene-add-point').style.display = 'block';
		document.getElementById('DeleteModal-id').innerText = CutsceneID.toString();
		DisableDurationLastElement();
		document.getElementById('cutscene-delete').addEventListener('click', () => {
			this._CutsceneDelete();
		});
		this._DetectModification();
	}

	static _DetectModification()
	{
		const UPDATE = async (Case, Value, ID, Point) => {
			if ((Case === 'Transition' && typeof Value !== 'string') || (Case !== 'Transition' && isNaN(Value)))
			{
				let str = LANG.Data.TypeError.Incorrect + ' ';
				str += (Case === 'Transition') ? (LANG.Data.TypeError.String) : (LANG.Data.TypeError.Number);
				str += ' ' + LANG.Data.TypeError.Received + ' ';
				str += (typeof Value === 'string') ? (LANG.Data.TypeError.String) : (LANG.Data.TypeError.Number);
				CreateAlert('warning', document.getElementById('cutscene-error'), str);
				return ;
			}
			let db = Database(Mapcraft.DBPath, { verbose: null });
			if (Case === 'Duration')
			{
				if (Math.sign(Value) === -1 || !Value)
					Value = '0';
				let sql = db.prepare('SELECT Duration FROM Cutscene WHERE ID = ?');
				let OldCutsceneDuration = sql.get(ID).Duration;
				sql = db.prepare('SELECT Duration FROM CutscenePoint WHERE CutsceneID = ? AND Point = ?');
				let OldDuration = sql.get(ID, Point).Duration;
				let NewDuration = parseInt(Value) - OldDuration;
				let NewCutsceneDuration = OldCutsceneDuration + NewDuration;
				sql = db.prepare('UPDATE Cutscene SET Duration = ? WHERE ID = ?');
				sql.run(NewCutsceneDuration, ID);
				let TIME = PrintTime(NewCutsceneDuration);
				document.querySelector('li[id="'+ ID +'"] span[time]').innerText = TIME;
				document.querySelector('span[generate-time]').innerText = TIME;
			}
			let sql = db.prepare('UPDATE CutscenePoint SET '+ Case +' = ? WHERE CutsceneID = ? AND Point = ?');
			sql.run(Value, ID, Point);
			db.close();
		};

		document.querySelectorAll('tbody[id="cutscene-form"] input').forEach((el) => {
			el.addEventListener('input', () => {
				if (el.getAttribute('id') === 'Duration' && el.hasAttribute('LastPoint'))
					return ;
				let Point = ((el.getAttribute('point') === LANG.Data.StartPoint) ? ('0') : (el.getAttribute('point')));
				UPDATE(el.getAttribute('id'), el.value, CutsceneID, Point);
			});
		});
		document.querySelectorAll('tbody[id="cutscene-form"] select').forEach((el) => {
			el.addEventListener('input', () => {
				let Point = ((el.getAttribute('point') === LANG.Data.StartPoint) ? ('0') : (el.getAttribute('point')));
				UPDATE(el.getAttribute('id'), el.value, CutsceneID, Point);
			});
		});
		this._PointDelete();
	}

	static _AddCutscene(event)
	{
		event.preventDefault();
		event.stopImmediatePropagation();
		if (!event.target['CreateNewCutscene-form-Name'].value)
		{
			CreateAlert('warning', document.getElementById('ModalError'), LANG.Data.CreateModal.Error);
			return ;
		}
		WorkProgress.open();
		let NAME = event.target['CreateNewCutscene-form-Name'].value;
		let db = Database(Mapcraft.DBPath, { verbose: console.log });
		let sql = db.prepare('INSERT INTO Cutscene (Name, Duration) VALUES (?, ?)');
		sql.run(NAME, 0);
		sql = db.prepare('SELECT ID FROM Cutscene WHERE Name = ?');
		let ret = sql.get(NAME);
		sql = db.prepare('UPDATE Cutscene SET Tag = ? WHERE ID = ?');
		sql.run('Cutscene_' + ret.ID.toString(), ret.ID);
		db.close();
		CutsceneMod.AddCutscene(ret.ID);
		this.CutsceneList();
		WorkProgress.close();
	}
	
	static _AddPointToCutscene(command = undefined)
	{
		let TR = document.createElement('TR');
		const INSERT = (X, Y, Z, Rx, Ry, Duration) => {
			let db = Database(Mapcraft.DBPath, { verbose: console.log });
			let sql = db.prepare('INSERT INTO CutscenePoint (CutsceneID, Point, X, Y, Z, Rx, Ry, Duration, Transition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
			sql.run(CutsceneID, ++LastPoint, X, Y, Z, Rx, Ry, Duration, 'linear');
			db.close();
			TR.setAttribute('point', LastPoint);
			TR.innerHTML = Template.parseRaw(Template.getRaw('list.tp'), {
				Point: ((LastPoint <= 0) ? (LANG.Data.StartPoint) : (LastPoint)),
				X: X,
				Y: Y,
				Z: Z,
				Rx: Rx,
				Ry: Ry,
				Secondes: Duration
			});
			document.getElementById('cutscene-form').appendChild(TR);
		};
		if (CutsceneID === -1)
		{
			CreateAlert('warning', document.getElementById('cutscene-error'), LANG.Data.AddPointError);
			return ;
		}
		if (!command)
			INSERT(0, 0, 0, 0, 0, 0);
		else
			INSERT(command.Coordinates.Point[0], command.Coordinates.Point[1], command.Coordinates.Point[2], command.Coordinates.Rotation[0], command.Coordinates.Rotation[1], 0);
		document.getElementById('cutscene-form').appendChild(TR);
		DisableDurationLastElement();
		this._DetectModification();
	}

	static _CutsceneDelete()
	{
		WorkProgress.open();
		let LI = document.querySelector('ul[id="cutscene-list"] > li[id="'+ CutsceneID +'"');
		let db = Database(Mapcraft.DBPath, {verbose: null});
		let sql = db.prepare('DELETE FROM CutscenePoint WHERE CutsceneID = ?');
		sql.run(CutsceneID);
		sql = db.prepare('DELETE FROM Cutscene WHERE ID = ?');
		sql.run(CutsceneID);
		CutsceneMod.DeleteCutscene(CutsceneID);
		db.close();
		if (LI)
		{
			while (LI.firstChild)
				LI.removeChild(LI.firstChild);
			LI.parentNode.removeChild(LI);
		}
		let TBODY = document.getElementById('cutscene-form');
		if (TBODY)
		{
			while (TBODY.firstChild)
				TBODY.removeChild(TBODY.firstChild);
		}
		document.querySelector('button[href="#DeleteCutscene-Modal"]').disabled = true;
		document.getElementById('cutscene-add-point').style.display = 'none';
		document.querySelector('span[generate-time]').innerText = '';
		document.getElementById('DeleteModal-id').innerText = '';
		document.getElementById('heading-cutscene').innerText = '';
		CutsceneID = -1;
		LastPoint = -1;
		WorkProgress.close();
	}

	static _PointDelete()
	{
		document.querySelectorAll('tbody[id="cutscene-form"] button[id="delete"]').forEach((el) => {
			el.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				WorkProgress.open();
				const NumberPoint = (el.getAttribute('point') === LANG.Data.StartPoint) ? ('0') : (el.getAttribute('point'));
				let TR = el.parentNode.parentNode;
				TR.classList.add('uk-animation-fade', 'uk-animation-reverse', 'uk-animation-fast');
				TR.addEventListener('animationend', () => {
					TR.parentNode.removeChild(TR);
					DisableDurationLastElement();
				});
				let db = Database(Mapcraft.DBPath, {verbose: console.log});
				//#region Update duration && Delete current point
				let TotalDuration = db.prepare('SELECT Duration FROM Cutscene WHERE ID = ?').get(CutsceneID).Duration;
				let PointDuration = db.prepare('SELECT Duration FROM CutscenePoint WHERE CutsceneID = ? AND Point = ?').get(CutsceneID, NumberPoint).Duration;
				TotalDuration -= PointDuration;
				db.prepare('UPDATE Cutscene SET Duration = ? WHERE ID = ?').run(TotalDuration, CutsceneID);
				let TIME = PrintTime(TotalDuration);
				document.querySelector('li[id="'+ CutsceneID +'"] span[time]').innerText = TIME;
				document.querySelector('span[generate-time]').innerText = TIME;
				let Points = db.prepare('SELECT Point FROM CutscenePoint WHERE CutsceneID = ? AND Point > ? ORDER BY Point').all(CutsceneID, NumberPoint);
				db.prepare('DELETE FROM CutscenePoint WHERE CutsceneID = ? AND Point = ?').run(CutsceneID, NumberPoint);
				//#endregion
				//#region Update point number
				if (!Points.length)
					LastPoint = NumberPoint - 1;
				for (let Point of Points)
				{
					let IDinput = ((Point.Point - 1) <= 0) ? (LANG.Data.StartPoint) : (Point.Point - 1);
					document.querySelectorAll('tr[point="'+ Point.Point.toString() +'"] *[point]').forEach((element) => {
						if (element.nodeName === 'P')
							element.innerText = IDinput;
						element.setAttribute('point', IDinput);
					});
					document.querySelector('tr[point="'+ Point.Point.toString() +'"]').setAttribute('point', IDinput);
					db.prepare('UPDATE CutscenePoint SET Point = ? WHERE CutsceneID = ? AND Point = ?').run((Point.Point - 1), CutsceneID, Point.Point);
					LastPoint = (Point.Point - 1);
				}
				let RemoveLastDuration = db.prepare('SELECT Duration FROM CutscenePoint WHERE CutsceneID = ? AND Point = ?').get(CutsceneID, LastPoint);
				if (RemoveLastDuration)
				{
					TotalDuration -= RemoveLastDuration.Duration;
					db.prepare('UPDATE CutscenePoint SET Duration = 0 WHERE CutsceneID = ? AND Point = ?').run(CutsceneID, LastPoint);
					db.prepare('UPDATE Cutscene SET Duration = ? WHERE ID = ?').run(TotalDuration, CutsceneID);
					let TIME = PrintTime(TotalDuration);
					document.querySelector('li[id="'+ CutsceneID +'"] span[time]').innerText = TIME;
					document.querySelector('span[generate-time]').innerText = TIME;
					document.querySelector('input[lastpoint]').value = 0;
				}
				db.close();
				WorkProgress.close();
				//#endregion
			});
		});
	}

	static _GenerateCutscene()
	{
		if (CutsceneID === -1)
		{
			CreateAlert('warning', document.getElementById('cutscene-error'), LANG.Data.GenerateError);
			return ;
		}
		WorkProgress.open();
		CutsceneMod.GenerateCutscene(CutsceneID);
		WorkProgress.close();
	}
}

module.exports = Cutscene;
