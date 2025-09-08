import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	build: {
		emptyOutDir: false, // para no borrar otros builds
		rollupOptions: {
			input: resolve(__dirname, 'src/background/background.ts'),
			output: {
				entryFileNames: 'background.js',
			},
		},
	},
});
