/**
 * File is in CommonJs because electron-builder don't support ES6
 */
const { readFileSync } = require('fs');
const { join } = require('path');

const upper = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
const info = {
	icon: (isMac = false) => `src/public/imgs/app/icon.${(isMac)
		? 'icns'
		: 'ico'}`,
	artifactName: '${productName}_${os}.${ext}',
	arch: (d = undefined) => d ?? [ 'x64' ]
};
const build = (type, arch = undefined) => {
	return [
		{
			target: type,
			arch: info.arch(arch),
		},
		{
			target: '7z',
			arch: info.arch(arch)
		}
	];
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
			buildResources: 'src/assets/build',
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
		asar: package.builder.asar ?? true,
		asarUnpack: package.builder.asarUnpack ?? undefined,
		// #endregion Asar
	
		//#region Windows
		nsis: {
			oneClick: false,
			allowElevation: true,
			allowToChangeInstallationDirectory: true,
			createStartMenuShortcut: false,
			displayLanguageSelector: true,
			installerIcon: 'src/assets/build/installerIcon.ico',
			uninstallerIcon: 'src/assets/build/uninstallerIcon.ico',
			installerSidebar: 'src/assets/build/installerSidebar.bmp',
			uninstallDisplayName: '${productName}',
			license: 'LICENSE',
			installerLanguages: [ 'en_US', 'fr_FR' ],
			language: 1033
		},
		win: {
			icon: info.icon(),
			artifactName: info.artifactName,
			target: build('nsis', package.builder.arch ?? undefined)
		},
		//#endregion Windows

		//#region Mac
		dmg: {
			background: 'src/assets/build/background.png',
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
			target: build('dmg', package.builder.arch ?? undefined)
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
			target: build('AppImage', package.builder.arch ?? undefined)
		}
		//#endregion Linux
	};
} catch (err) {
	console.error(err);
	module.exports = {
		error: true
	};
}
