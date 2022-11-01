import { fstat, readdir } from 'fs';
import { resolve } from 'path';

export interface pluginsList {
	path: string;
	package: {
		private: boolean;
		name: string;
		description: string;
		license: string;
		version: string;
		author: {
			email: string;
			name: string;
		};
		repository: {
			type: string;
			url: string;
		};
		keywords: string[];
		config: {
			backend: string;
			frontend: string;
			lang: string;
			routes: string;
		}
	}
}

class Plugins {
	list: pluginsList[];

	constructor() {
		fs.readdir()
	}
}

function importLang() {
	
}

function importFront() {

}

function importBack() {

}

function importRoutes() {

}
