import { defineConfig } from 'vite';
// 'path' es un módulo nativo de Node.js para manejar rutas de archivos.
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: { // Define los puntos de entrada para la compilación de la extensión.
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
