import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				downloadExcel: resolve(__dirname, 'src/downloadExcel.js')
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
		outDir: 'dist',
		emptyOutDir: true,
	},
});
