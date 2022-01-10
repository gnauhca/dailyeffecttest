import { defineConfig } from 'vite';
import path from 'path';
import styleImport from 'vite-plugin-style-import';
import liveReload from 'vite-plugin-live-reload';
import glob from 'glob';
import copy from 'rollup-plugin-copy';

const htmls = glob.sync('*/*.html');
const inputs = { index: path.resolve(__dirname, 'index.html') };

console.log(htmls);

htmls.forEach((htmlPath) => {
  inputs[htmlPath] = path.resolve(__dirname, htmlPath);
});

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: inputs,
    },
  },
  publicDir: './',
  plugins: [
    copy({
      targets: [
        { src: ['./*/*.js'], dest: 'dist/' },
      ],
      copyOnce: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#333333',
          'link-color': '#333333',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    liveReload(['*']),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => `ant-design-vue/es/${name}/style`,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    hmr: false,
    host: '0.0.0.0',
    port: 8082,
  },
});
