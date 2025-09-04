import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: { // Define los puntos de entrada para la compilación de la extensión.
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content.ts'),
        style: resolve(__dirname, 'src/style.css')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
