import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [UnoCSS(), react()],
  assetsInclude: ['**/*.xml'],
  server: {
    proxy: {
      '/PROXY_DOMAIN': {
        changeOrigin: true,
        target: 'http://10.20.1.17:8080',
        rewrite: path => path.replace(/^\/PROXY_DOMAIN/, ''),
      },
    },
  },
});
