import { rm } from 'fs/promises';
import { resolve } from 'path';
import { fs } from 'mapcraft-api/backend';
import type database from 'mapcraft-api/dist/types/src/backend/sql';

const deleteCutscene = async(id: number, db: database, path: {dir: string, main: string}): Promise<void> => {
	await Promise.all([
		db.update('DELETE FROM cutscenePoint WHERE cutsceneId = ?', id),
		db.update('DELETE FROM cutscene WHERE id = ?', id),
		fs.removeLine(path.main, `tag=Cutscene_${id.toString()}`),
	]);
	return rm(resolve(path.dir, id.toString()), { recursive: true });
};

export default (
	id: number,
	db: database,
	path: {dir: string, main: string}
): Promise<void> => {
	/*
	const version = mapStore().minecraftVersion;

	if (
		version === '1.17' || version === '1.17.1' || version === '1.17.2'
		|| version === '1.18' || version === '1.18.1' || version === '1.18.2'
		|| version === '1.19' || version === '1.19.1' || version === '1.19.2' || version === '1.19.3' || version === '1.19.4'
	)
	*/
	return deleteCutscene(id, db, path);
};