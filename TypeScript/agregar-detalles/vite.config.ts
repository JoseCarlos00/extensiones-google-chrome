import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				// Puntos de entrada de la extensión (popup, background)
				popup: resolve(__dirname, 'popup.html'),
				background: resolve(__dirname, 'src/background/background.ts'),
				'transaction_history/main': resolve(__dirname, 'src/transaction_history/main.ts'),
				'transaction_history/loader': resolve(__dirname, 'src/transaction_history/loader.ts'),
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
});
