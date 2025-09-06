import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				// Define los puntos de entrada para la compilación de la extensión.
				popup: resolve(__dirname, 'src/popup/popup.html'),
				main: resolve(__dirname, 'src/main.ts'),
				style: resolve(__dirname, 'public/css/style.css'),
				background: resolve(__dirname, 'src/background/index.ts'),
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
});
