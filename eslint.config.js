// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: [
			'build.cjs',
			'dist/*',
			'node_modules/*',
			'**/*.d.ts',
			'src/public/*',
			'src/app/codemirror/*',
			'src/api/deepClone.ts'
		]
	}
);
