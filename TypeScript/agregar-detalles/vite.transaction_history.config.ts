import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	build: {
		emptyOutDir: true,
		rollupOptions: {
			input: resolve(__dirname, 'src/transaction_history/main.ts'),
			output: {
				entryFileNames: 'transaction_history/main.js',
				inlineDynamicImports: true, // ahora sí funciona porque solo hay un input
			},
		},
	},
});
