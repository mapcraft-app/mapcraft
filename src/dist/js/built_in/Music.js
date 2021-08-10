const path = require('path');
const fs = require('fs');
const MCfs = require('../MCfs');

const Mapcraft = JSON.parse(localStorage.getItem('Mapcraft'));
const MainPath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/music/execute.mcfunction');

class Music
{
	static CreateMusic(ID, Music, Category, Duration, IsEdit)
	{
		let MusicPath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/music', ID.toString() + '.mcfunction');
		if (Category === 'none')
			Category = 'master';
		let data = [
			'execute if score @s MC_MusicTime matches 1 run playsound mapcraft:', Music.toString(), ' ', Category.toString(), ' @s ~ ~ ~', '\n',
			'execute if score @s[tag=!RepeatMusic] MC_MusicTime matches ', Duration.toString(), '.. run scoreboard players set @s MC_Music 0', '\n',
			'execute if score @s MC_MusicTime matches ', Duration.toString(), '.. run scoreboard players set @s MC_MusicTime -1', '\n',
			'scoreboard players add @s MC_MusicTime 1'
		];
		fs.writeFile(MusicPath, data.join(''), {flag: 'w', encoding: 'utf-8'}, (err) => {
			if (err)
				throw err;
		});
		if (!IsEdit || IsEdit === undefined)
			MCfs.AddLine(MainPath, 'execute if score @s MC_Music matches '+ ID.toString() +' run function mapcraft-data:music/'+ ID.toString() +'\n');
	}
	static RemoveMusic(ID)
	{
		let MusicPath = path.join(Mapcraft.Data.DataPack, 'data/mapcraft-data/functions/music', ID.toString() + '.mcfunction');
		fs.rm(MusicPath, { recursive: true, force: true }, (err) => {
			if (err)
				throw err;
			MCfs.DeleteLine(MainPath, 'matches '+ ID.toString());
		});
	}
}

module.exports = Music;
