import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	// Agrega esta línea para que las rutas de los assets sean relativas
	base: './',
	build: {
		emptyOutDir: false,
		rollupOptions: {
			// Punto de entrada: el HTML del popup
			input: resolve(__dirname, 'popup.html'),
			output: {
				entryFileNames: 'popup.js', // Vite generará un JS asociado
			},
		},
	},
});
