import { defineConfig } from 'vite';
import path from 'path';
import liveReload from 'vite-plugin-live-reload';
import glob from 'glob';
import copy from 'rollup-plugin-copy';

const htmls = glob.sync('{src/*.html,src/*/*.html,src/*/*/*.html}');
const inputs = {};

htmls.forEach((htmlPath) => {
  inputs[htmlPath.replace('src/', '')] = path.resolve(__dirname, htmlPath);
});

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  base: process.env.NODE_ENV === 'development' ? './' : '/daily-effect-test/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: inputs,
    },
  },
  plugins: [
    liveReload(['*']),
    copy({
      targets: [
        { src: ['src/**/*.(js|jpg|png|gif|gltf)', '!src/**/node_modules/**'], dest: 'dist/' },
      ],
      flatten: false,
      verbose: true,
      hook: 'writeBundle',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: false,
    host: '0.0.0.0',
    port: 8082,
  },
});
