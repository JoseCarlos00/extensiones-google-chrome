import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	build: {
		emptyOutDir: false,
		rollupOptions: {
			input: [
				resolve(__dirname, 'src/inventory_insight/main.ts'),
				resolve(__dirname, 'src/inventory_insight/style.css'),
			],
			output: {
				entryFileNames: 'inventory_insight/[name].js',
				assetFileNames: 'inventory_insight/[name].[ext]',
			},
		},
	},
});
