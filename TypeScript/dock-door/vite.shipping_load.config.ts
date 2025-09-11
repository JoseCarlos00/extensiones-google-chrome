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
				resolve(__dirname, 'src/shipping_load/ShippingLoad.ts'),
				resolve(__dirname, 'src/shipping_load/shippingLoad.css'),
			],
			output: {
				entryFileNames: 'shipping_load/ShippingLoad.js',
				assetFileNames: 'shipping_load/[name].[ext]',
			},
		},
	},
});
