import { createPinia } from 'pinia';
import routes from 'virtual:generated-pages';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import App from '~/App.vue';
import CathayTranslate from './components/CathayTranslate.vue';

const app = createApp(App);

// for 頁面loading使用
const isLoading = ref(false);
app.provide('isLoading', isLoading);

// default route
routes.unshift({
  path: '/',
  redirect: '/home'
});
const mode = import.meta.env.MODE;
const router = createRouter({
  history: mode === 'production' || mode === 'deploy' ? createWebHashHistory() : createWebHistory(),
  routes
});

app.use(router);

const pinia = createPinia();
// store 內可以直接使用 this.show/hideloading 來顯示隱藏loading overlay
pinia.use(({ store }) => {
  store.showLoading = () => {
    if (!isLoading.value) isLoading.value = true;
  };
  store.hideLoading = () => {
    if (isLoading.value) isLoading.value = false;
  };
});
app.use(pinia);
app.component('cathay-translate', CathayTranslate);

app.mount('#app');
