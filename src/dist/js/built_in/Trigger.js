const path = require('path');
const fs = require('fs');
const MCfs = require('../MCfs');

const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const DetectPath = path.join(Mapcraft.Mapcraft, 'data/mapcraft/functions/built_in/trigger/zone/detect.mcfunction');
const ExecutePath = path.join(Mapcraft.Mapcraft, 'data/mapcraft/functions/built_in/trigger/zone/execute.mcfunction');

class Trigger
{
	static CreateTrigger(ID, x1, y1, z1, x2, y2, z2, IsEdit)
	{
		let TriggerPath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/trigger', ID.toString());
		let data = [
			'execute if entity @s[x=', x1.toString(),
			',y=', y1.toString(),
			',z=', z1.toString(),
			',dx=', (x2 - x1).toString(),
			',dy=', (y2 - y1).toString(),
			',dz=', (z2 - z1).toString(),
			'] run scoreboard players set @s MC_Trigger ', ID.toString()
		]
		fs.mkdir(TriggerPath, { recursive: true }, (err) => {
			if (err)
				throw err;
			fs.writeFileSync(path.join(TriggerPath, 'detect.mcfunction'), data.join(''), { flag: 'w' }, 'utf8');
			fs.writeFileSync(path.join(TriggerPath, 'execute.mcfunction'), '', { flag: 'w' }, 'utf8');
			if (!IsEdit || IsEdit === undefined)
			{
				MCfs.AddLine(DetectPath, 'function mapcraft-data:trigger/'+ ID.toString() +'/detect\n');
				MCfs.AddLine(ExecutePath, 'execute if score @s MC_Trigger matches '+ ID.toString() +' run function mapcraft-data:trigger/'+ ID.toString() +'/execute\n');
			}
		});
	}
	static RemoveTrigger(ID)
	{
		let Occurence = '/' + ID.toString() + '/';
		let TriggerPath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/trigger', ID.toString());
		fs.rm(TriggerPath, { recursive: true, force: true }, (err) => {
			if (err)
				throw err;
			else
			{
				MCfs.DeleteLine(DetectPath, Occurence);
				MCfs.DeleteLine(ExecutePath, Occurence);
			}
		});
	}
}

module.exports = Trigger;
