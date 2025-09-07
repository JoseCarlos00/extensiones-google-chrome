import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				// Puntos de entrada de la extensión (popup, background)
				popup: resolve(__dirname, 'src/popup/popup.html'),
				background: resolve(__dirname, 'src/background/background.ts'),

				// Content Scripts: Define una entrada por cada página/script.
				// El nombre del key (ej. 'transaction_history/main') define la ruta de salida.
				'transaction_history/main': resolve(__dirname, 'src/transaction_history/main.ts'),
				// 'shipment_insight/main': resolve(__dirname, 'src/shipment_insight/main.ts'), // <-- Ejemplo para otro script
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
});
