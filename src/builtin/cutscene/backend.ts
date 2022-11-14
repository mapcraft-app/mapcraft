import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('cutscene', {
	one: () => 'hello from backend'
});
