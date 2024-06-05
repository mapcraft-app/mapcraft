/**
 * File is in CommonJs because electron-builder don't support ES6
 */
const packageJson = require('./package.json');

const upper = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const info = {
	icon: (os = 'windows') => {
		switch (os) {
		case 'mac':
			return 'src/public/imgs/app/icon.icns';
		case 'linux':
			return 'src/public/imgs/app/icon.png';
		default:
			return 'src/public/imgs/app/icon.ico';
		}
	},
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

if (!packageJson.version || !packageJson.name || !packageJson.author || !packageJson.author.name)
	throw new Error('Key(s) `version`, `name` or `author.name` in package.json is undefined');

module.exports = {
	// #region WindowsBuild informations
	appId: `com.electron.${packageJson.name}`,
	productName: upper(packageJson.name),
	copyright: `Copyright © 2020 - ${new Date().getFullYear()}, ${packageJson.author.name}`,
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
	asar: packageJson.builder.asar ?? true,
	asarUnpack: packageJson.builder.asarUnpack ?? undefined,
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
		target: build('nsis', packageJson.builder.arch ?? undefined)
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
		icon: info.icon('mac'),
		artifactName: info.artifactName,
		target: build('dmg', packageJson.builder.arch ?? undefined)
	},
	//#endregion Mac

	//#region Linux
	appImage: {
		license: 'LICENSE',
	},
	linux: {
		category: 'Development',
		synopsis: 'Mapcraft is a software that increases the possibilities of mapmakers without any complex installation',
		icon: info.icon('linux'),
		artifactName: info.artifactName,
		target: build('AppImage', packageJson.builder.arch ?? undefined)
	}
	//#endregion Linux
};
