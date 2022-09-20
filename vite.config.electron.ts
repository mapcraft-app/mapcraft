import { defineConfig } from 'vite';

export default defineConfig({
	publicDir: false,
	build: {
		cssCodeSplit: false,
		emptyOutDir: false,
		minify: false,
		rollupOptions: {
			input: [
				'src/electron/main.ts',
				'src/electron/preload/preload.ts'
			],
			output: {
				format: 'commonjs'
			}
		},
		sourcemap: false,
		ssr: true
	},
	define: {
    'import.meta.env.ELECTRON_APP_URL': JSON.stringify('index.html')
  }
});
