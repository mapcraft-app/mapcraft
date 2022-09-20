/**
 * File is in CommonJs because electron-builder don't support ES6
 */
const { readFileSync } = require('fs');
const { join } = require('path');

const upper = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
const info = {
	icon: (isMac = false) => `src/assets/imgs/app/icon.${(isMac)
		? 'icns'
		: 'ico'}`,
	artifactName: '${productName}_${os}.${ext}',
	arch: [ 'x64' ]
};

try {
	const package = JSON.parse(readFileSync(join(__dirname, 'package.json'), { encoding: 'utf-8' }));
	if (!package.version || !package.name || !package.author.name)
		throw new Error('Version key in package.json is undefined');
	module.exports = {
		// #region WindowsBuild informations
		appId: `com.electron.${package.name}`,
		productName: upper(package.name),
		copyright: `Copyright © 2020 - ${new Date().getFullYear()}, ${package.author.name}`,
		// #endregion WindowsBuild informations
	
		// #region Directory & files
		directories: {
			output: 'dist/electron-build'
		},
		files: [
			{
				from: 'dist',
				filter: [ '!**/electron-build/**/*' ]
			},
			{
				from: '.',
				filter: [ 'package.json' ]
			}
		],
		// #endregion Directory & files
	
		// #region Asar
		asar: true,
		asarUnpack: [
			// 'node_modules/{7zip-bin,7zip-min,kleur,mapcraft-api,prompts,sisteransi}/**/*'
		],
		// #endregion Asar
	
		//#region Windows
		nsis: {
			oneClick: false,
			allowElevation: true,
			allowToChangeInstallationDirectory: true,
			createStartMenuShortcut: false,
			displayLanguageSelector: true,
			installerIcon: 'src/electron/build/installerIcon.ico',
			uninstallerIcon: 'src/electron/build/uninstallerIcon.ico',
			installerSidebar: 'src/electron/build/installerSidebar.bmp',
			uninstallDisplayName: '${productName}',
			license: 'LICENSE',
			installerLanguages: [ 'en_US', 'fr_FR' ],
			language: 1033
		},
		win: {
			icon: info.icon(),
			artifactName: info.artifactName,
			target: [
				{
					target: 'nsis',
					arch: info.arch,
				},
				{
					target: '7z',
					arch: info.arch
				}
			]
		},
		//#endregion Windows

		//#region Mac
		dmg: {
			background: 'src/electron/build/background.png',
			iconSize: 80,
			window: {
				width: 540,
				height: 380
			},
			contents: [
				{
					x: 140,
					y: 190
				},
				{
					x: 400,
					y: 190,
					type: 'link',
					path: '/Applications'
				}
			]
		},
		mac: {
			category: 'public.app-category.productivity',
			type: 'distribution',
			icon: info.icon(true),
			artifactName: info.artifactName,
			target: [
				{
					target: 'dmg',
					arch: info.arch
				},
				{
					target: '7z',
					arch: info.arch
				}
			]
		},
		//#endregion Mac

		//#region Linux
		appImage: {
			license: 'LICENSE',
		},
		linux: {
			category: 'Development',
			synopsis: 'Mapcraft is a software that increases the possibilities of mapmakers without any complex installation',
			icon: info.icon(),
			artifactName: info.artifactName,
			target: [
				{
					target: 'AppImage',
					arch: info.arch
				},
				{
					target: '7z',
					arch: info.arch
				}
			]
		}
		//#endregion Linux
	};
} catch (err) {
	console.error(err);
	module.exports = {
		error: true
	};
}
