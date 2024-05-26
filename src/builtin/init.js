/* eslint-disable */
const process = require('process');
const { resolve } = require('path');
const { mkdir, writeFile } = require('fs/promises');

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

if (process.argv < 2)
	throw new Error('Pass name');
const args = process.argv.slice(2);

const backend = `import { exposeInMainWorld } from 'app/src/api/plugins/backend';

exposeInMainWorld('${args[0]}', {});
`;
const declare = `export declare global {
	interface Window {
		${args[0]}: {}
	}
}
`;
const main = `<template>
	<span class="text-h6">${capitalize(args[0].toLowerCase())}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: '${capitalize(args[0].toLowerCase())}',
	setup () {
		return {};
	}
});
</script>

<style scoped>
</style>
`;
const package = {
	'private': true,
	'name': args[0].toLowerCase(),
	'icon': 'token',
	'description': `${args[0].toLowerCase()} plugin`,
	'license': 'MIT',
	'version': '1.0.0',
	'author': {
		'email': 'hello@mapcraft.app',
		'name': 'Mapcraft'
	},
	'repository': {
		'type': 'git',
		'url': 'https://github.com/mapcraft/'
	},
	'keywords': [
		'builtin',
		'mapcraft',
		args[0].toLowerCase()
	]
};
const shell =
`import { commandFormat, shellModel } from 'app/src/electron/api/shell/interface';

export default {
	name: '${args[0].toLowerCase()}',
	builtin: true,
	fn: (args) => {
		return commandFormat(args, {});
	}
} as shellModel;
`;

const langIndex = `import en from './en-US';
import fr from './fr-FR';

export default {
	'en-US': en,
	'fr-FR': fr
};
`;
const langBase = `export default {
	menu: {
		name: '${capitalize(args[0].toLowerCase())}'
	}
};
`;

async function __main__() {
	await mkdir(resolve(__dirname, args[0].toLowerCase(), 'lang'), { recursive: true });
	await mkdir(resolve(__dirname, args[0].toLowerCase(), 'components'), { recursive: true });
	
	writeFile(resolve(__dirname, args[0].toLowerCase(), 'backend.ts'), backend, { flag: 'w' });
	writeFile(resolve(__dirname, args[0].toLowerCase(), 'declare.d.ts'), declare, { flag: 'w' });
	writeFile(resolve(__dirname, args[0].toLowerCase(), 'main.vue'), main, { flag: 'w' });
	writeFile(resolve(__dirname, args[0].toLowerCase(), 'package.json'), JSON.stringify(package, null, 2), { flag: 'w' });
	writeFile(resolve(__dirname, args[0].toLowerCase(), 'shell.ts'), shell, { flag: 'w' });

	writeFile(resolve(__dirname, args[0].toLowerCase(), 'lang', 'index.ts'), langIndex, { flag: 'w' });
	writeFile(resolve(__dirname, args[0].toLowerCase(), 'lang', 'en-US.ts'), langBase, { flag: 'w' });
	writeFile(resolve(__dirname, args[0].toLowerCase(), 'lang', 'fr-FR.ts'), langBase, { flag: 'w' });
}

__main__();
