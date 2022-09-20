import { readFileSync } from 'fs';
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('readSettings', () => {
	return JSON.parse(readFileSync('./settings.json', 'utf-8'));
});
