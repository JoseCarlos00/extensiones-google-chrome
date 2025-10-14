import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	build: {
		emptyOutDir: false,
		rollupOptions: {
			input: resolve(__dirname, 'src/shipment/line_insight/main.ts'),
			output: {
				entryFileNames: 'shipment/line_insight/main.js',
				inlineDynamicImports: true,
			},
		},
	},
});
