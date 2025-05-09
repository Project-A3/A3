import Vue from '@vitejs/plugin-vue';
import path from 'path';
import MultiInput from 'rollup-plugin-multi-input';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    base:  '/html/AA/B3/AAB3_1000/',
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`
      }
    },
    build: {
      outDir: (() => mode === 'deploy' ? 'dist' : '../../../Web Content/html/AA/B3/AAB3_1000')(),
      assetsDir: 'assets',
      // dev no need
      rollupOptions: {
        // input: ['static/*.html', 'usability/*.html', 'index.html'],
        output: {
          // next 3 line mask filename is hash
          // entryFileNames: `assets/[name].js`,
          // chunkFileNames: `assets/[name].js`,
          // assetFileNames: `assets/[name].[ext]`,
          manualChunks(id) {
            if (id.includes('api')) {
              return 'initial';
            } else if (id.includes('moment')) {
              return 'moment';
            }
          }
          // manualChunks: {
          //   moment: ['moment'],
          //   initial: ['src/api/client.js', 'src/api/index.js']
          // }
        },
        plugins: [MultiInput()]
      }
    },
    publicDir: false,
    preview: {
      port: 4173
    },
    envPrefix: 'CATHAYLIFE_',
    plugins: [
      Vue(),
      Pages({
        exclude: ['**/components/*.vue', '**/components/**/*.vue']
      }),
      AutoImport({
        imports: ['vue', 'vue-router']
      })
      ,vueDevTools()
    ]
  };
  
  if (mode === 'development') {
    delete config.build.rollupOptions;
  }

  return  config;
});
