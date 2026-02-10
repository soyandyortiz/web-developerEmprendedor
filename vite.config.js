import { defineConfig } from 'vite';
import htmlInject from 'vite-plugin-html-inject';
import path from 'path';

export default defineConfig({
  plugins: [htmlInject()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        personalizador: path.resolve(__dirname, 'personalizador.html'),
        apps: path.resolve(__dirname, 'apps-a-medida.html'),
        web: path.resolve(__dirname, 'desarrollo-web-riobamba.html'),
      }
    }
  }
});
