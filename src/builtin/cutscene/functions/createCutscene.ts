import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import { fs } from 'mapcraft-api/backend';
import type database from 'mapcraft-api/dist/types/src/backend/sql';
import type { cutsceneInterface } from '../interface';

const deleteCutscene_GEN1 = async (db: database, name: string, path: {dir: string, main: string}): Promise<cutsceneInterface> => {
	await db.update('INSERT INTO cutscene (name, duration) VALUES (?, ?)', name, 0);
	const ret: cutsceneInterface = await db.get('SELECT * FROM cutscene WHERE name = ?', name);
	await db.update('UPDATE cutscene SET tag = ? WHERE id = ?', `Cutscene_${ret.id}`, ret.id);
	await Promise.all([
		fs.addLine(path.main, `execute positioned 0 0 0 rotated 0 0 if entity @s[tag=Cutscene,tag=Cutscene_${ret.id}] run function mapcraft-data:cutscene/${ret.id}/cutscene\n`),
		mkdir(resolve(path.dir, ret.id.toString()))
	]);
	return {
		id: Number(ret.id),
		name: String(ret.name),
		tag: `Cutscene_${ret.id}`,
		duration: Number(ret.duration),
		description: '',
		position: 'origin'
	};
};

export default (
	name: string,
	db: database,
	path: {dir: string, main: string}
): Promise<cutsceneInterface> => {
	/*
	const version = mapStore().minecraftVersion;

	if (
		version === '1.17' || version === '1.17.1' || version === '1.17.2'
		|| version === '1.18' || version === '1.18.1' || version === '1.18.2'
		|| version === '1.19' || version === '1.19.1' || version === '1.19.2' || version === '1.19.3' || version === '1.19.4'
	)
	*/
	return deleteCutscene_GEN1(db, name, path);
};