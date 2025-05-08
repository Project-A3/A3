import Vue from '@vitejs/plugin-vue';
import path from 'path';
import MultiInput from 'rollup-plugin-multi-input';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`
      }
    },
    build: {
      outDir: path.join(__dirname, 'dist'),
      // dev no need
      rollupOptions: {
        input: ['static/*.html', 'usability/*.html', 'index.html'],
        output: {
          manualChunks: {
            moment: ['moment']
          }
        },
        plugins: [MultiInput()]
      }
    },
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
    ]
  };

  const serverSetting = {
    server: {
      proxy: {
        '/servlet/HttpDispatcher/AAB3_1000/api':{
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
  if (mode === 'development') {
    delete config.build.rollupOptions;
  }

  return  {
    ...config,
    ...(mode === "development" && serverSetting)
  };
});
