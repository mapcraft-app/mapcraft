module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		'vue/setup-compiler-macros': true
	},
	parser: 'vue-eslint-parser',
	extends: [
		'plugin:@typescript-eslint/recommended',
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'prettier'
	],
	plugins: ['@typescript-eslint', 'vue'],
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
		extraFileExtensions: ['.vue']
	},
	rules: {
		'vue/no-multiple-template-root': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/html-indent': [
			'warn',
			'tab',
			{
				alignAttributesVertically: true
			}
		],
		'vue/html-self-closing': 'off',
		'vue/max-attributes-per-line': [
			'warn',
			{
				singleline: {
					max: 5
				},
				multiline: {
					max: 3
				}
			}
		],
		'vue/v-slot-style': 'off',

		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-inferrable-types': [
			'error',
			{
				ignoreParameters: true
			}
		],

		'no-console': process.env.NODE_ENV === 'production'
			? 'warn'
			: 'off',
		'no-debugger': process.env.NODE_ENV === 'production'
			? 'warn'
			: 'off',

		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],

		'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'brace-style': ['error', '1tbs', { allowSingleLine: true }],
		eqeqeq: ['error', 'always'],
		curly: ['error', 'multi-or-nest'],
		'multiline-ternary': ['error', 'always'],
		'no-tabs': ['error', { allowIndentationTabs: true }]
	},
	ignorePatterns: ['dist'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/explicit-module-boundary-types': ['error']
			}
		}
	]
};
