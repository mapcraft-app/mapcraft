const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const BezierEasing = require('bezier-easing');
const { MCfs } = require('mapcraft-api');
const MCP = require('mapcraft-api').MCplugin;

const MCplugin = new MCP();
const LANG = MCplugin.Lang('Cutscene');

const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const MainPath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/cutscene/start.mcfunction');
const CutsceneDir = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/cutscene');

function CreateAlert(type, DOMelement, str)
{
	const alert = document.createElement('div');
	alert.classList.add(`uk-alert-${type}`);
	alert.setAttribute('uk-alert', '');
	const closeButton = document.createElement('a');
	closeButton.classList.add('uk-alert-close');
	closeButton.setAttribute('uk-close', '');
	const text = document.createElement('p').appendChild(document.createTextNode(str));
	alert.appendChild(closeButton);
	alert.appendChild(text);
	DOMelement.appendChild(alert);
}

class Cutscene
{
	//#region Cutscene main
	static AddCutscene(ID)
	{
		MCfs.AddLine(MainPath, 'execute positioned -371.7 66 417.9 rotated -160.3 10.3 if entity @s[tag=Cutscene,tag=Cutscene_5] run function mapcraft-data:cutscene/5/cutscene');
		fs.mkdir(path.join(CutsceneDir, ID.toString()), (err) =>
		{
			if (err)
				throw new Error(err);
		});
	}

	static DeleteCutscene(ID)
	{
		MCfs.DeleteLine(MainPath, `tag=Cutscene_${ID.toString()}`);
		fs.rm(path.join(CutsceneDir, ID.toString()), { recursive: true }, (err) =>
		{
			if (err)
				throw new Error(err);
		});
	}
	//#endregion

	//#region Cutscene generator
	static BezierCurve(DISTANCE, TIME, TRANSITION)
	{
		const GetCurve = (transition) =>
		{
			switch (transition)
			{
				case 'linear':
					return (BezierEasing(0, 0, 1, 1));
				case 'ease':
					return (BezierEasing(0.25, 0.1, 0.25, 1));
				case 'ease-in':
					return (BezierEasing(0.42, 0, 1, 1));
				case 'ease-out':
					return (BezierEasing(0, 0, 0.58, 1));
				case 'ease-in-out':
					return (BezierEasing(0.42, 0, 0.58, 1));
				default:
					return (BezierEasing(0, 0, 1, 1));
			}
		};
		const DURATION_TIME = TIME * 20;
		const BEZIER = GetCurve(TRANSITION);
		const Ret = {
			Transition: TRANSITION,
			Points: [],
		};
		if (Ret.Transition === 'linear')
		{
			Ret.Points.push(parseFloat((DISTANCE / DURATION_TIME).toFixed(6)));
			return (Ret);
		}
		let total = 0.0;
		const Bezier = {
			Step: { Increment: 1.0 / DURATION_TIME, Current: 0.0 },
			Curve: { Last: 0.0, Current: 0.0 },
			Percent: { Last: 0.0, Current: 0.0 },
		};
		for (let i = 0; i <= DURATION_TIME; i++)
		{
			Bezier.Curve.Current = BEZIER(Bezier.Step.Current);
			Bezier.Percent.Current = Bezier.Curve.Current - Bezier.Curve.Last;
			Bezier.Step.Current += Bezier.Step.Increment;
			Bezier.Curve.Last = Bezier.Curve.Current;
			if (i < DURATION_TIME)
			{
				total += parseFloat(DISTANCE * Bezier.Percent.Current.toFixed(6));
				Ret.Points.push((DISTANCE * Bezier.Percent.Current).toFixed(6));
			}
			else if (i === DURATION_TIME)
			{
				Ret.Points.push((DISTANCE - total).toFixed(6));
			}
		}
		return (Ret);
	}

	static POINT(_Number)
	{
		return (Number.isNaN(_Number) || Number(_Number) === 0.0) ? (' ~0') : (` ~${Number(_Number)}`);
	}

	static GenerateCutscene(ID)
	{
		//#region Data generate
		if (!fs.existsSync(path.join(CutsceneDir, ID.toString())))
			fs.mkdirSync(path.join(CutsceneDir, ID.toString()));
		const DB = Database(Mapcraft.DBPath, { verbose: console.log });
		let sql = DB.prepare('SELECT * FROM Cutscene WHERE ID = ?');
		const CUTSCENE = sql.get(ID);
		sql = DB.prepare('SELECT * FROM CutscenePoint WHERE CutsceneID = ? ORDER BY Point');
		const POINTS = sql.all(ID);
		DB.close();
		if (POINTS.length <= 1)
		{
			CreateAlert('warning', document.getElementById('cutscene-error'), LANG.Data.Generation.Error);
			return;
		}
		const TAG = `Cutscene_${ID.toString()}`;
		const NAME = CUTSCENE.Name;
		const TIME = { Max: CUTSCENE.Duration * 20 };
		const Coordinates = {
			Position: [POINTS[0].X, POINTS[0].Y, POINTS[0].Z].join(' '),
			Rotation: [POINTS[0].Rx, POINTS[0].Ry].join(' '),
		};
		const COMMAND = {
			Launch: ['execute positioned ', Coordinates.Position, ' rotated ', Coordinates.Rotation, ' if entity @s[tag=Cutscene,tag=Cutscene_', ID.toString(), '] run function mapcraft-data:cutscene/', ID.toString(), '/cutscene'],
			Core: {
				0: ['# Core'],
				1: ['execute if score @s MC_Cutscene matches 0 run tp @s[tag=', TAG, ',tag=Cutscene,tag=!Debug] ~ ~ ~ ~ ~'],
				2: ['execute if score @s MC_Cutscene matches 0 unless entity @e[sort=nearest,tag=Cutscene,tag=Camera] run function mapcraft:built_in/cutscene/summon_camera'],
				3: ['execute if score @s MC_Cutscene matches 0 run tag @e[tag=Cutscene,tag=Camera,sort=nearest,limit=1] add ', TAG],
				4: ['execute if score @s MC_Cutscene matches 0 run tp @e[tag=', TAG, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1] ', Coordinates.Position, ' ', Coordinates.Rotation],
				5: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=Debug] run data merge entity @e[tag=', TAG, ',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1] {CustomNameVisible:1b,CustomName:\'{"text":"', NAME, '"}\'}'],
				6: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run gamemode spectator @s'],
				7: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run spectate @e[tag=', TAG, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1] @s'],
				8: ['execute if score @s MC_Cutscene matches 0 if entity @s[tag=!Debug] run function mapcraft-data:cutscene/', ID.toString(), '/start'],
				9: ['execute if entity @s[tag=Debug] positioned as @e[tag=', TAG, ',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1] run particle minecraft:happy_villager ~ ~0.6 ~ 0 0 0 0 0 force'],
				10: ['execute if score @s MC_Cutscene matches 0.. if entity @s[tag=', TAG, ',tag=!Debug] run kill @e[tag=', TAG, ',tag=Cutscene,tag=Camera,tag=DebugCutscene,sort=nearest,limit=1]'],
				11: ['scoreboard players add @s MC_Cutscene 1'],
				12: ['# Cutscene'],
			},
			End: {
				0: ['# End'],
				1: ['execute if score @s MC_Cutscene matches ', TIME.Max.toString(), '.. if entity @s[tag=', TAG, ',tag=!Debug] run spectate'],
				2: ['execute if score @s MC_Cutscene matches ', TIME.Max.toString(), '.. if entity @s[tag=', TAG, ',tag=!Debug] run gamemode creative @s'],
				3: ['execute if score @s MC_Cutscene matches ', TIME.Max.toString(), '.. run kill @e[tag=', TAG, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1]'],
				4: ['execute if score @s MC_Cutscene matches ', TIME.Max.toString(), '.. if entity @s[tag=!Debug] run tag @s remove ', TAG],
				5: ['execute if score @s MC_Cutscene matches ', TIME.Max.toString(), '.. if entity @s[tag=!Debug] run function mapcraft-data:cutscene/', ID.toString(), '/end'],
				6: ['execute if score @s MC_Cutscene matches ', TIME.Max.toString(), '.. run scoreboard players set @s MC_Cutscene 0'],
			},
			LaunchCamera: ['execute if score @s MC_Cutscene matches 0..', TIME.Max.toString(), ' at @e[tag=', TAG, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1] run function mapcraft-data:cutscene/', ID.toString(), '/camera'],
			Camera: ['execute if score @s MC_Cutscene matches ', ' run tp @e[tag=Camera,sort=nearest]'],
			TeleportPlayer: ['execute if score @s[tag=', TAG, ',tag=!Debug] MC_Cutscene matches ..', TIME.Max.toString(), ' if entity @e[tag=', TAG, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1,distance=1..] run spectate @e[tag=', TAG, ',tag=Cutscene,tag=Camera,sort=nearest,limit=1] @s'],
		};
		//#region Start Generation
		const data = {
			file: '',
			camera: '',
			current_duration: 0,
			old_duration: 0,
		};
		const Join = (JSON) =>
		{
			let _data = '';
			for (const id in JSON)
				if (Object.prototype.hasOwnProperty.call(JSON, id))
				{
					_data += JSON[id].join('');
					_data += '\n';
				}
			return (_data);
		};
		MCfs.ModifyLine(MainPath, `tag=${TAG}`, COMMAND.Launch.join(''), true);
		data.file += Join(COMMAND.Core);
		data.file += `${COMMAND.LaunchCamera.join('')}\n`;
		for (let id = 0; id < POINTS.length; id++)
		{
			if ((id + 1) >= POINTS.length)
				break;
			data.current_duration += POINTS[id].Duration * 20;
			const X = this.BezierCurve(POINTS[id + 1].X - POINTS[id].X, POINTS[id].Duration, POINTS[id].Transition);
			const Y = this.BezierCurve(POINTS[id + 1].Y - POINTS[id].Y, POINTS[id].Duration, POINTS[id].Transition);
			const Z = this.BezierCurve(POINTS[id + 1].Z - POINTS[id].Z, POINTS[id].Duration, POINTS[id].Transition);
			const Rx = this.BezierCurve(POINTS[id + 1].Rx - POINTS[id].Rx, POINTS[id].Duration, POINTS[id].Transition);
			const Ry = this.BezierCurve(POINTS[id + 1].Ry - POINTS[id].Ry, POINTS[id].Duration, POINTS[id].Transition);

			if (POINTS[id].Transition === 'linear')
			{
				data.camera += `# Point ${POINTS[id].Point}\n`;
				const Teleport = [this.POINT(X.Points[0]), this.POINT(Y.Points[0]), this.POINT(Z.Points[0]), this.POINT(Rx.Points[0]), this.POINT(Ry.Points[0])].join('');
				const Matches = (id === 0 || data.old_duration >= data.current_duration) ? (`..${data.current_duration}`) : (`${data.old_duration}..${data.current_duration}`);
				data.camera += `${COMMAND.Camera[0]}${Matches}${COMMAND.Camera[1]}${Teleport}\n`;
			}
			else
			{
				let TimeToPoint = data.old_duration;
				data.camera += `# Point ${POINTS[id].Point}\n`;
				for (let _id = 0; TimeToPoint <= data.current_duration; _id++)
				{
					const Teleport = [this.POINT(X.Points[_id]), this.POINT(Y.Points[_id]), this.POINT(Z.Points[_id]), this.POINT(Rx.Points[_id]), this.POINT(Ry.Points[_id])].join('');
					data.camera += `${COMMAND.Camera[0]}${TimeToPoint++}${COMMAND.Camera[1]}${Teleport}\n`;
				}
			}
			data.old_duration = data.current_duration + 1;
		}
		data.file += `# Put the player back in place\n${COMMAND.TeleportPlayer.join('')}\n`;
		data.file += Join(COMMAND.End);
		const PATH = {
			Cutscene: [path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/cutscene/', ID.toString(), 'cutscene.mcfunction'), data.file, 'w'],
			Camera: [path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/cutscene/', ID.toString(), 'camera.mcfunction'), data.camera, 'w'],
			Start: [path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/cutscene/', ID.toString(), 'start.mcfunction'), '# Cutscene start\n', 'wx'],
			End: [path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/cutscene/', ID.toString(), 'end.mcfunction'), '# Cutscene end\n', 'wx'],
		};
		for (const id in PATH)
			if (Object.prototype.hasOwnProperty.call(PATH, id))
				fs.writeFile(PATH[id][0], PATH[id][1], { flag: PATH[id][2], encoding: 'utf-8' }, (err) =>
				{
					if (err && err.code !== 'EEXIST')
						throw new Error(err);
				});
		//#endregion
	}
	//#endregion
}

module.exports = Cutscene;
