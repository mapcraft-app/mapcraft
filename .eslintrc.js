module.exports = {
	"env": {
		"node": true,
		"browser": true,
		"commonjs": true,
		"es2021": true,
	},
	"extends": [
		"airbnb-base"
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"rules": {
		"class-methods-use-this": ["off"],
		"curly": ["warn", "multi", "consistent"],
		"max-len": ["warn", {"code": 180, "ignoreComments": true, "ignoreStrings": true, "ignoreRegExpLiterals": true, "ignoreTemplateLiterals": true}],
		"no-console": ["off"],
		"no-plusplus": ["off", false],
		"no-loop-func": ["off"],
		"no-underscore-dangle": "off",
		"no-restricted-syntax": ["off"],
		"nonblock-statement-body-position": ["warn", "below"],
		"object-curly-newline": ["error", { "multiline": true }],
		"brace-style": ["warn", "allman"],
		"indent": ["error", "tab", {"SwitchCase": 1}],
		"no-tabs": ["off", {allowIndentationTabs: true}],
		"max-classes-per-file": ["warn", 5],
		"spaced-comment": ["error", "always", { "markers": ["#region "] }],
		"import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
	},
	"ignorePatterns": [".eslintrc.js", "node_modules/**/*", "build/**/*", "src/dist/js/MCipc.js", "src/dist/js/AceEditor", "src/dist/js/GUI"],
};
