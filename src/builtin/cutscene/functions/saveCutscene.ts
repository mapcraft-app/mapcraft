import { type sql } from 'mapcraft-api/backend';
import type { cutsceneInterface, cutscenePointInterface } from '../interface';

const saveCutscene_GEN1 = async (
	db: sql,
	cutscene: cutsceneInterface,
	points: cutscenePointInterface[]
): Promise<void> => {
	const oldPoints: { cutsceneId: number, point: number }[] = await db.all('SELECT cutsceneId, point FROM cutscenePoint WHERE cutsceneId = ?', cutscene.id);
	const prepare = {
		insertPoint: db.prepare('INSERT INTO cutscenePoint (cutsceneId, point, x, y, z, rx, ry, duration, transition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'),
		updatePoint: db.prepare('UPDATE cutscenePoint SET x = ?, y = ?, z = ?, rx = ?, ry = ?, duration = ?, transition = ? WHERE cutsceneId = ? AND point = ?'),
		cutscene: db.prepare('UPDATE cutscene SET name = ?, duration = ?, description = ?, position = ? WHERE id = ?')
	};
	const isExist = (x: number) => !!oldPoints.find((e) => e.cutsceneId === points[x].cutsceneId && e.point === points[x].point);
	let i = 0;

	prepare.cutscene.run(cutscene.name, cutscene.duration, cutscene.description, cutscene.position, cutscene.id);
	for (; i < points.length; i++) {
		if (isExist(Number(i)))
			prepare.updatePoint.run(points[i].x, points[i].y, points[i].z, points[i].rx, points[i].ry, points[i].duration, points[i].transition, points[i].cutsceneId, points[i].point);
		else
			prepare.insertPoint.run(points[i].cutsceneId, points[i].point, points[i].x, points[i].y, points[i].z, points[i].rx, points[i].ry, points[i].duration, points[i].transition);
	}
	for (; i < oldPoints.length; i++)
		db.update('DELETE FROM cutscenePoint WHERE cutsceneId = ? AND point = ?', oldPoints[i].cutsceneId, oldPoints[i].point);
};

export default (
	db: sql,
	cutscene: cutsceneInterface,
	points: cutscenePointInterface[]
): Promise<void> => {
	/*
	const version = mapStore().minecraftVersion;

	if (
		version === '1.17' || version === '1.17.1' || version === '1.17.2'
		|| version === '1.18' || version === '1.18.1' || version === '1.18.2'
		|| version === '1.19' || version === '1.19.1' || version === '1.19.2' || version === '1.19.3' || version === '1.19.4'
	)
	*/
	return saveCutscene_GEN1(db, cutscene, points);
};
